package cl.reuse.smartcheck.probe

import android.os.Build
import org.json.JSONObject

/**
 * Información del dispositivo. Sólo metadata pública, ningún identificador
 * persistente (ni IMEI, ni Android ID, ni Advertising ID).
 *
 * El IMEI lo capturó la Web vía teclado/OCR — el APK no lo necesita y deliberadamente
 * no lo pide para mantener el alcance de permisos en cero.
 */
data class DeviceInfo(
    val manufacturer: String,
    val model: String,
    val device: String,
    val androidVersion: String,
    val sdkInt: Int,
) {
    fun toJson(): JSONObject = JSONObject().apply {
        put("manufacturer", manufacturer)
        put("model", model)
        put("device", device)
        put("androidVersion", androidVersion)
        put("sdkInt", sdkInt)
    }

    companion object {
        fun read(): DeviceInfo = DeviceInfo(
            manufacturer = Build.MANUFACTURER ?: "unknown",
            model = Build.MODEL ?: "unknown",
            device = Build.DEVICE ?: "unknown",
            androidVersion = Build.VERSION.RELEASE ?: "unknown",
            sdkInt = Build.VERSION.SDK_INT,
        )
    }
}
