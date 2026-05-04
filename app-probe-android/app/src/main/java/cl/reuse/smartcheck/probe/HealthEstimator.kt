package cl.reuse.smartcheck.probe

import android.content.Context
import android.os.BatteryManager
import android.util.Log
import kotlinx.coroutines.delay
import kotlin.math.abs

/**
 * Estimador de salud de batería por Coulomb counting.
 *
 * Esta es la pieza central de SmartCheck que NO depende de partnerships con OEMs.
 * Funciona en cualquier Android porque sólo usa APIs públicas que ningún fabricante
 * bloquea: BATTERY_PROPERTY_CHARGE_COUNTER y BATTERY_PROPERTY_CAPACITY.
 *
 * --- La matemática ---
 *
 * Si el dispositivo gana ΔL% de nivel mientras el contador acumula ΔµAh:
 *
 *   capacidadActual_µAh = ΔµAh × 100 / ΔL
 *   saludPct = (capacidadActual / capacidadDeFabrica) × 100
 *
 * El truco: charge_counter mide microampere-hora reales que entraron/salieron de la
 * batería. Es coulomb counting puro; el OEM no tiene cómo "filtrarlo" sin romper el
 * propio sistema operativo. Por eso es accesible públicamente en todas las marcas.
 *
 * --- Confianza ---
 *
 * La precisión sube con:
 *   - mayor ΔL durante la medición (3% mejor que 1%)
 *   - mayor número de muestras consistentes (descarta outliers)
 *   - temperatura estable y dentro de rango (15°C-40°C)
 *   - corriente estable (cargador plug fijo, sin app abriéndose y cerrándose)
 *
 * En condiciones ideales (60s, ΔL≥3%, temp 25°C) la precisión es ±3-5%.
 * En condiciones malas (30s, ΔL=1%, temp 45°C) puede ser ±15%.
 *
 * --- Modo carga vs descarga ---
 *
 * Funciona en ambas direcciones:
 *   - Carga: charge_counter sube. Idealmente cargador conectado, sin uso intensivo.
 *   - Descarga: charge_counter baja. Idealmente pantalla apagada, sin apps en bg.
 *
 * El operador del local generalmente conectará el cable. Para clientes que llegan
 * con batería al 100% no podemos cargar más — usamos modo descarga (más ruidoso pero
 * factible si dejamos al equipo idle 60s).
 */
class HealthEstimator(
    private val context: Context,
    /** Capacidad de fábrica en mAh, viene del TAC db de SmartCheck. Si null, no hay
     *  forma de calcular % salud — devolvemos sólo capacidad estimada. */
    private val designCapacityMAh: Int?,
) {

    data class Sample(
        val timestampMs: Long,
        val chargeCounterUAh: Long,
        val levelPct: Int,
        val currentUA: Long?,
        val temperatureC: Double?,
        val voltageMv: Int?,
    )

    sealed class Result {
        /** Estimación válida con healthPct, capacidad actual, confianza, y muestras. */
        data class Ok(
            val healthPct: Double,
            val estimatedCapacityUAh: Long,
            val designCapacityUAh: Long,
            val deltaLevelPct: Int,
            val deltaUAh: Long,
            val durationMs: Long,
            val sampleCount: Int,
            val confidence: Confidence,
            val direction: Direction,
            val avgTemperatureC: Double?,
            val tempWarning: Boolean,
        ) : Result()

        /** Tenemos capacidad estimada pero no design → no podemos calcular %. */
        data class NoDesign(val estimatedCapacityUAh: Long, val sampleCount: Int) : Result()

        /** El nivel no cambió suficiente. Sugerí al usuario enchufar/usar el equipo. */
        data class InsufficientChange(val deltaLevelPct: Int, val sampleCount: Int) : Result()

        /** charge_counter no responde en este equipo (raro). */
        data object NoCounter : Result()
    }

    enum class Confidence { HIGH, MEDIUM, LOW }
    enum class Direction { CHARGING, DISCHARGING, STABLE }

    private val samples = mutableListOf<Sample>()

    /**
     * Mide durante [durationMs] muestreando cada [intervalMs]. Reporta progreso
     * 0.0..1.0 vía [onProgress]. Devuelve [Result] al terminar (no lanza).
     */
    suspend fun measure(
        durationMs: Long = DEFAULT_DURATION_MS,
        intervalMs: Long = DEFAULT_INTERVAL_MS,
        onProgress: (Float) -> Unit = {},
    ): Result {
        val bm = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        samples.clear()
        val startMs = System.currentTimeMillis()

        while (System.currentTimeMillis() - startMs < durationMs) {
            val s = takeSample(bm)
            if (s != null) {
                samples += s
                Log.d(TAG, "sample #${samples.size}: level=${s.levelPct}% counter=${s.chargeCounterUAh}µAh i=${s.currentUA}µA T=${s.temperatureC}°C")
            }
            val elapsed = System.currentTimeMillis() - startMs
            onProgress((elapsed.toFloat() / durationMs).coerceIn(0f, 1f))
            delay(intervalMs)
        }
        onProgress(1f)
        return analyze()
    }

    private fun takeSample(bm: BatteryManager): Sample? {
        val counter = safeLong(bm, BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER) ?: return null
        val level = safeInt(bm, BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: return null
        // El sticky broadcast lo leemos para temp/voltaje (no lo recolectamos cada vez
        // por costo — sólo en el primer y último sample).
        val now = System.currentTimeMillis()
        val current = safeLong(bm, BatteryManager.BATTERY_PROPERTY_CURRENT_NOW)
        // temp/voltage: del receiver (más caro). Lo leemos sólo cada N muestras.
        val (temp, volt) = if (samples.size % 5 == 0) {
            BatteryReader.readTemperatureAndVoltage(context)
        } else null to null
        return Sample(now, counter, level, current, temp, volt)
    }

    private fun analyze(): Result {
        if (samples.isEmpty()) return Result.NoCounter
        val first = samples.first()
        val last = samples.last()

        val deltaLevel = last.levelPct - first.levelPct
        val deltaCounter = last.chargeCounterUAh - first.chargeCounterUAh
        val absDeltaLevel = abs(deltaLevel)
        val absDeltaCounter = abs(deltaCounter)
        val durationMs = last.timestampMs - first.timestampMs

        val direction = when {
            deltaLevel > 0 -> Direction.CHARGING
            deltaLevel < 0 -> Direction.DISCHARGING
            else -> Direction.STABLE
        }

        // Necesitamos al menos 2% de cambio de nivel — con menos el ruido domina.
        if (absDeltaLevel < MIN_DELTA_LEVEL_PCT) {
            return Result.InsufficientChange(absDeltaLevel, samples.size)
        }
        if (absDeltaCounter <= 0) return Result.NoCounter

        // capacidadActual_uAh = (ΔµAh / ΔL%) × 100
        val estimatedCapacityUAh = (absDeltaCounter * 100L) / absDeltaLevel.toLong()

        // Temperatura promedio (de las muestras donde la leímos)
        val tempReadings = samples.mapNotNull { it.temperatureC }
        val avgTemp = if (tempReadings.isNotEmpty()) tempReadings.average() else null
        val tempWarning = avgTemp != null && (avgTemp > 40.0 || avgTemp < 10.0)

        val confidence = computeConfidence(
            absDeltaLevel = absDeltaLevel,
            sampleCount = samples.size,
            durationMs = durationMs,
            tempWarning = tempWarning,
        )

        if (designCapacityMAh == null) {
            return Result.NoDesign(estimatedCapacityUAh, samples.size)
        }

        val designUAh = designCapacityMAh.toLong() * 1_000L
        val healthPct = (estimatedCapacityUAh.toDouble() / designUAh.toDouble()) * 100.0
        // Saludes >115% son artefacto de medición — clampamos para no asustar al operador.
        val clampedHealth = healthPct.coerceIn(0.0, 115.0)

        Log.i(
            TAG,
            "Estimate: health=${"%.1f".format(clampedHealth)}% est=${estimatedCapacityUAh / 1000}mAh " +
            "design=${designCapacityMAh}mAh ΔL=${absDeltaLevel}% Δc=${absDeltaCounter / 1000}mAh " +
            "n=${samples.size} confidence=$confidence dir=$direction T̄=${avgTemp?.let { "%.1f".format(it) }}°C"
        )

        return Result.Ok(
            healthPct = clampedHealth,
            estimatedCapacityUAh = estimatedCapacityUAh,
            designCapacityUAh = designUAh,
            deltaLevelPct = absDeltaLevel,
            deltaUAh = absDeltaCounter,
            durationMs = durationMs,
            sampleCount = samples.size,
            confidence = confidence,
            direction = direction,
            avgTemperatureC = avgTemp,
            tempWarning = tempWarning,
        )
    }

    private fun computeConfidence(
        absDeltaLevel: Int,
        sampleCount: Int,
        durationMs: Long,
        tempWarning: Boolean,
    ): Confidence {
        // Heurística simple. Refinable con telemetría real.
        val deltaScore = when {
            absDeltaLevel >= 4 -> 2
            absDeltaLevel >= 2 -> 1
            else -> 0
        }
        val sampleScore = when {
            sampleCount >= 20 -> 2
            sampleCount >= 8 -> 1
            else -> 0
        }
        val durationScore = when {
            durationMs >= 60_000 -> 2
            durationMs >= 30_000 -> 1
            else -> 0
        }
        val total = deltaScore + sampleScore + durationScore - (if (tempWarning) 1 else 0)
        return when {
            total >= 5 -> Confidence.HIGH
            total >= 3 -> Confidence.MEDIUM
            else -> Confidence.LOW
        }
    }

    private fun safeLong(bm: BatteryManager, prop: Int): Long? = try {
        val v = bm.getLongProperty(prop)
        if (v == Long.MIN_VALUE) null else v
    } catch (e: Exception) { null }

    private fun safeInt(bm: BatteryManager, prop: Int): Int? = try {
        val v = bm.getIntProperty(prop)
        if (v == Int.MIN_VALUE || v < 0) null else v
    } catch (e: Exception) { null }

    companion object {
        private const val TAG = "SmartCheck/HealthEst"
        const val DEFAULT_DURATION_MS = 60_000L     // 60s default
        const val DEFAULT_INTERVAL_MS = 3_000L      // muestrea cada 3s → ~20 samples
        const val MIN_DELTA_LEVEL_PCT = 2           // mínimo aceptable; debajo es ruido
    }
}
