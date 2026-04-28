package cl.reuse.smartcheck.probe

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * Estado UI del probe. Una sola fuente de verdad.
 *
 * Flujo:
 *   Consent → Measuring → Done | Error
 *
 * Decisiones:
 *  - No usamos clean-arch ni Repository pattern: un VM es suficiente para 3 pantallas.
 *  - El sessionId viene del deep-link y vive en el VM hasta que el usuario cierra.
 *  - La medición se hace en Dispatchers.IO; el upload también.
 */
sealed interface ProbeUiState {
    data class Consent(val sessionId: String?) : ProbeUiState
    data object Measuring : ProbeUiState
    data class Done(val reading: BatteryReading) : ProbeUiState
    data class Error(val message: String, val reading: BatteryReading?) : ProbeUiState
}

class ProbeViewModel(app: Application) : AndroidViewModel(app) {

    private val apiBase: String by lazy {
        // El default está en strings/buildConfig; en debug Rob puede sobreescribirlo
        // exportando una variable LAN. Mantenemos la lectura de res para que TI
        // pueda cambiarlo por buildType sin tocar código.
        getApplication<Application>().getString(R.string.smartcheck_api_base)
    }

    private val _state = MutableStateFlow<ProbeUiState>(ProbeUiState.Consent(sessionId = null))
    val state: StateFlow<ProbeUiState> = _state.asStateFlow()

    private var currentSessionId: String? = null

    fun onSessionIdReceived(sessionId: String?) {
        currentSessionId = sessionId
        val current = _state.value
        if (current is ProbeUiState.Consent) {
            _state.value = ProbeUiState.Consent(sessionId = sessionId)
        }
    }

    fun startMeasurement() {
        val sessionId = currentSessionId
        if (sessionId.isNullOrBlank()) {
            _state.value = ProbeUiState.Error(
                message = "Falta sessionId. Volvé al diagnóstico web y escaneá el QR de nuevo.",
                reading = null,
            )
            return
        }
        _state.value = ProbeUiState.Measuring

        viewModelScope.launch {
            // Pequeño delay artificial para que el usuario vea la animación.
            // No medimos peor por esperar 1.2s; medir en <100ms se siente sospechoso.
            delay(1200)

            val reading = withContext(Dispatchers.IO) {
                BatteryReader.read(getApplication())
            }

            val payload = buildPayload(sessionId, reading)
            val client = ApiClient(apiBase)

            val result = withContext(Dispatchers.IO) {
                client.uploadProbe(payload)
            }

            _state.value = if (result.isSuccess) {
                ProbeUiState.Done(reading)
            } else {
                ProbeUiState.Error(
                    message = result.exceptionOrNull()?.message
                        ?: "No pudimos enviar la medición. Revisá tu conexión.",
                    reading = reading,
                )
            }
        }
    }

    fun retryUpload() {
        // Si tenemos una lectura previa, solo reintentamos el upload.
        val current = _state.value
        if (current is ProbeUiState.Error && current.reading != null) {
            val sessionId = currentSessionId ?: return
            _state.value = ProbeUiState.Measuring
            viewModelScope.launch {
                val payload = buildPayload(sessionId, current.reading)
                val result = withContext(Dispatchers.IO) {
                    ApiClient(apiBase).uploadProbe(payload)
                }
                _state.value = if (result.isSuccess) ProbeUiState.Done(current.reading)
                else ProbeUiState.Error(
                    message = result.exceptionOrNull()?.message ?: "Reintento falló",
                    reading = current.reading,
                )
            }
        } else {
            // Si no había lectura previa, arrancamos desde cero.
            startMeasurement()
        }
    }

    private fun buildPayload(sessionId: String, reading: BatteryReading): JSONObject {
        val device = DeviceInfo.read()
        Log.d(TAG, "Building payload for session=$sessionId device=${device.manufacturer}/${device.model}")
        return JSONObject().apply {
            put("sessionId", sessionId)
            put("device", device.toJson())
            put("battery", reading.toJson())
            put("method", "android-probe")
            put("probeVersion", BuildConfig.VERSION_NAME)
            put("timestamp", java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }
                .format(java.util.Date()))
        }
    }

    companion object {
        private const val TAG = "SmartCheck/ProbeVM"
    }
}
