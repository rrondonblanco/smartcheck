package cl.reuse.smartcheck.probe

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.util.Log
import org.json.JSONObject
import java.io.File

/**
 * Lee el estado de la batería desde fuentes públicas, sin root, sin permisos especiales.
 *
 * Estrategia:
 *   1. BatteryManager (API pública desde Android 5+): % carga, contador de capacidad
 *      en µAh, corriente instantánea.
 *   2. ACTION_BATTERY_CHANGED (sticky broadcast): temperatura, voltaje, status, plugged,
 *      tecnología.
 *   3. /sys/class/power_supply/battery/... (lectura directa): charge_full, charge_full_design,
 *      cycle_count. Esta es la pieza diferencial frente al navegador — accesible
 *      públicamente en la mayoría de Androids vendidos en LATAM (Samsung, Xiaomi,
 *      Motorola, OPPO/Realme). Puede no estar en algunos OEM exóticos.
 *
 * Cálculo de salud:
 *   healthPct = (charge_full / charge_full_design) * 100
 *   Fallback: si charge_full no es accesible, usamos BATTERY_PROPERTY_CHARGE_COUNTER
 *   medido al 100% como aproximación (el caller sabe que es un fallback).
 */
data class BatteryReading(
    val healthPct: Double?,
    val designCapacityUAh: Long?,
    val currentCapacityUAh: Long?,
    val cycleCount: Int?,
    val temperatureCelsius: Double?,
    val voltageMv: Int?,
    val technology: String?,
    val currentNowUA: Long?,
    val levelPct: Int?,
    val isCharging: Boolean?,
    val pluggedSource: String?,           // "ac" | "usb" | "wireless" | "none"
    val healthStatus: String?,            // mapping de BATTERY_HEALTH_*
    val source: String,                   // "sysfs+battery_manager" | "battery_manager" | etc.
    val warnings: List<String>,
) {
    fun toJson(): JSONObject = JSONObject().apply {
        putOpt("healthPct", healthPct)
        putOpt("designCapacityUAh", designCapacityUAh)
        putOpt("currentCapacityUAh", currentCapacityUAh)
        putOpt("cycleCount", cycleCount)
        putOpt("temperatureCelsius", temperatureCelsius)
        putOpt("voltageMv", voltageMv)
        putOpt("technology", technology)
        putOpt("currentNowUA", currentNowUA)
        putOpt("levelPct", levelPct)
        putOpt("isCharging", isCharging)
        putOpt("pluggedSource", pluggedSource)
        putOpt("healthStatus", healthStatus)
        put("source", source)
        if (warnings.isNotEmpty()) {
            put("warnings", warnings.joinToString("; "))
        }
    }
}

object BatteryReader {

    private const val TAG = "SmartCheck/BatteryReader"

    private val SYSFS_CANDIDATES = listOf(
        "/sys/class/power_supply/battery",
        "/sys/class/power_supply/Battery",
        "/sys/class/power_supply/bms",
    )

    fun read(context: Context): BatteryReading {
        val warnings = mutableListOf<String>()
        val bm = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager

        // --- BatteryManager properties (no requieren broadcast) ---
        // BATTERY_PROPERTY_CHARGE_COUNTER vuelve en µAh. Algunos OEMs devuelven Long.MIN_VALUE
        // o 0 si no está implementado.
        val capacityNow = safeLongProp(bm, BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER)
        val currentNow = safeLongProp(bm, BatteryManager.BATTERY_PROPERTY_CURRENT_NOW)
        val levelPct = safeIntProp(bm, BatteryManager.BATTERY_PROPERTY_CAPACITY)

        // --- Sticky broadcast ACTION_BATTERY_CHANGED ---
        val batteryIntent: Intent? = context.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )

        val temperatureC = batteryIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1)
            ?.takeIf { it >= 0 }
            ?.let { it / 10.0 } // décimas de grado → grados Celsius

        val voltageMv = batteryIntent?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, -1)
            ?.takeIf { it >= 0 }

        val technology = batteryIntent?.getStringExtra(BatteryManager.EXTRA_TECHNOLOGY)

        val plugged = batteryIntent?.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) ?: 0
        val pluggedSource = when (plugged) {
            BatteryManager.BATTERY_PLUGGED_AC -> "ac"
            BatteryManager.BATTERY_PLUGGED_USB -> "usb"
            BatteryManager.BATTERY_PLUGGED_WIRELESS -> "wireless"
            else -> "none"
        }
        val isCharging = plugged != 0 || (batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
            ?.let { it == BatteryManager.BATTERY_STATUS_CHARGING || it == BatteryManager.BATTERY_STATUS_FULL } ?: false)

        val healthStatus = batteryIntent?.getIntExtra(BatteryManager.EXTRA_HEALTH, -1)?.let { mapHealth(it) }

        // --- /sys/class/power_supply/battery/... ---
        val sysfsRoot = SYSFS_CANDIDATES.firstOrNull { File(it).exists() }
        val chargeFull = sysfsRoot?.let { readLongFromFile("$it/charge_full") }
        val chargeFullDesign = sysfsRoot?.let { readLongFromFile("$it/charge_full_design") }
        val cycleCount = sysfsRoot?.let { readIntFromFile("$it/cycle_count") }

        if (sysfsRoot == null) {
            warnings += "sysfs_battery_path_not_found"
        }
        if (chargeFull == null) warnings += "charge_full_unavailable"
        if (chargeFullDesign == null) warnings += "charge_full_design_unavailable"
        if (cycleCount == null) warnings += "cycle_count_unavailable"

        // --- Cálculo de salud ---
        val healthPct: Double? = when {
            chargeFull != null && chargeFullDesign != null && chargeFullDesign > 0 -> {
                (chargeFull.toDouble() / chargeFullDesign.toDouble()) * 100.0
            }
            // Fallback: si tenemos capacityNow al 100%, lo tratamos como charge_full estimado.
            // Si no estamos al 100%, no tiene sentido — el caller verá warnings.
            capacityNow != null && levelPct != null && levelPct >= 95 -> {
                warnings += "health_estimated_from_charge_counter"
                null // preferimos null antes que un número inventado
            }
            else -> null
        }?.let { (it * 10).toLong() / 10.0 } // 1 decimal

        val source = if (sysfsRoot != null) "sysfs+battery_manager" else "battery_manager"

        Log.i(
            TAG,
            "Reading: health=$healthPct% chargeFull=$chargeFull design=$chargeFullDesign " +
            "cycles=$cycleCount temp=$temperatureC°C v=${voltageMv}mV tech=$technology " +
            "level=$levelPct% source=$source warnings=$warnings"
        )

        return BatteryReading(
            healthPct = healthPct,
            designCapacityUAh = chargeFullDesign,
            currentCapacityUAh = chargeFull ?: capacityNow,
            cycleCount = cycleCount,
            temperatureCelsius = temperatureC,
            voltageMv = voltageMv,
            technology = technology,
            currentNowUA = currentNow,
            levelPct = levelPct,
            isCharging = isCharging,
            pluggedSource = pluggedSource,
            healthStatus = healthStatus,
            source = source,
            warnings = warnings,
        )
    }

    private fun safeLongProp(bm: BatteryManager, prop: Int): Long? = try {
        val v = bm.getLongProperty(prop)
        // Algunos OEMs devuelven Long.MIN_VALUE como sentinela
        if (v == Long.MIN_VALUE || v == 0L) null else v
    } catch (e: Exception) {
        Log.w(TAG, "safeLongProp($prop) failed: ${e.message}")
        null
    }

    private fun safeIntProp(bm: BatteryManager, prop: Int): Int? = try {
        val v = bm.getIntProperty(prop)
        if (v == Int.MIN_VALUE || v < 0) null else v
    } catch (e: Exception) {
        null
    }

    private fun readLongFromFile(path: String): Long? = try {
        File(path).takeIf { it.canRead() }?.readText()?.trim()?.toLongOrNull()
    } catch (e: SecurityException) {
        null
    } catch (e: Exception) {
        Log.w(TAG, "readLongFromFile($path) failed: ${e.message}")
        null
    }

    private fun readIntFromFile(path: String): Int? = try {
        File(path).takeIf { it.canRead() }?.readText()?.trim()?.toIntOrNull()
    } catch (e: SecurityException) {
        null
    } catch (e: Exception) {
        null
    }

    private fun mapHealth(code: Int): String = when (code) {
        BatteryManager.BATTERY_HEALTH_GOOD -> "good"
        BatteryManager.BATTERY_HEALTH_OVERHEAT -> "overheat"
        BatteryManager.BATTERY_HEALTH_DEAD -> "dead"
        BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE -> "over_voltage"
        BatteryManager.BATTERY_HEALTH_UNSPECIFIED_FAILURE -> "unspecified_failure"
        BatteryManager.BATTERY_HEALTH_COLD -> "cold"
        else -> "unknown"
    }

    /**
     * Helper expuesto para [HealthEstimator]: lee temperatura (°C) y voltaje (mV)
     * desde el sticky broadcast. Pair(temp, voltage); cualquiera puede ser null si
     * el OEM no lo expone.
     */
    fun readTemperatureAndVoltage(context: Context): Pair<Double?, Int?> {
        val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            ?: return null to null
        val tempC = intent.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1)
            .takeIf { it >= 0 }?.let { it / 10.0 }
        val voltMv = intent.getIntExtra(BatteryManager.EXTRA_VOLTAGE, -1).takeIf { it >= 0 }
        return tempC to voltMv
    }
}
