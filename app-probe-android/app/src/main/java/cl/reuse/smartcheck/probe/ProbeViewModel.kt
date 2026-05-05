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
 *   Consent → Measuring(progress) → Done | Error
 *
 * Decisiones:
 *  - No usamos clean-arch ni Repository pattern: un VM es suficiente para 3 pantallas.
 *  - El sessionId viene del deep-link y vive en el VM hasta que el usuario cierra.
 *  - La medición tiene dos partes:
 *      1. snapshot inmediato (BatteryReader.read) → temp, voltaje, capacidad raw, etc.
 *      2. Coulomb counting (HealthEstimator) → estima salud real durante 60s.
 */
sealed interface ProbeUiState {
    data class Consent(val sessionId: String?, val designCapacityMAh: Int?) : ProbeUiState
    data class Measuring(val progress: Float, val hint: String) : ProbeUiState
    data class Done(val reading: BatteryReading, val estimate: HealthEstimator.Result) : ProbeUiState
    data class Error(val message: String, val reading: BatteryReading?, val estimate: HealthEstimator.Result?) : ProbeUiState
}

class ProbeViewModel(app: Application) : AndroidViewModel(app) {

    private val apiBase: String by lazy {
        getApplication<Application>().getString(R.string.smartcheck_api_base)
    }

    private val _state = MutableStateFlow<ProbeUiState>(
        ProbeUiState.Consent(sessionId = null, designCapacityMAh = null)
    )
    val state: StateFlow<ProbeUiState> = _state.asStateFlow()

    private var currentSessionId: String? = null
    private var currentDesignCapacityMAh: Int? = null

    fun onDeepLink(sessionId: String?, designCapacityMAh: Int?) {
        currentSessionId = sessionId
        currentDesignCapacityMAh = designCapacityMAh
        val current = _state.value
        if (current is ProbeUiState.Consent) {
            _state.value = ProbeUiState.Consent(sessionId, designCapacityMAh)
        }
    }

    /** Compat con el viejo handler — mantengo por si cambia el call site. */
    fun onSessionIdReceived(sessionId: String?) = onDeepLink(sessionId, currentDesignCapacityMAh)

    fun startMeasurement() {
        val sessionId = currentSessionId
        if (sessionId.isNullOrBlank()) {
            _state.value = ProbeUiState.Error(
                message = "Falta sessionId. Volvé al diagnóstico web y escaneá el QR de nuevo.",
                reading = null,
                estimate = null,
            )
            return
        }
        _state.value = ProbeUiState.Measuring(progress = 0f, hint = HINT_INITIAL)

        viewModelScope.launch {
            // Pequeño delay para mostrar la animación inicial.
            delay(800)

            // 1. Snapshot crudo: temp, voltaje, capacidad actual, etc.
            val reading = withContext(Dispatchers.IO) {
                BatteryReader.read(getApplication())
            }

            // 2. Coulomb counting durante 60s para estimar salud real.
            // Tip al usuario según si está cargando o no.
            val initialHint = if (reading.isCharging == true) HINT_CHARGING else HINT_NOT_CHARGING
            _state.value = ProbeUiState.Measuring(progress = 0f, hint = initialHint)

            val estimator = HealthEstimator(
                context = getApplication(),
                designCapacityMAh = currentDesignCapacityMAh,
            )
            val estimate = withContext(Dispatchers.IO) {
                estimator.measure(
                    durationMs = HealthEstimator.DEFAULT_DURATION_MS,
                    intervalMs = HealthEstimator.DEFAULT_INTERVAL_MS,
                    onProgress = { p ->
                        // Update UI desde IO. Posteamos al VM scope.
                        viewModelScope.launch {
                            val st = _state.value
                            if (st is ProbeUiState.Measuring) {
                                _state.value = ProbeUiState.Measuring(p, st.hint)
                            }
                        }
                    }
                )
            }

            // 3. Upload con todo: snapshot + estimate.
            val payload = buildPayload(sessionId, reading, estimate)
            val result = withContext(Dispatchers.IO) {
                ApiClient(apiBase).uploadProbe(payload)
            }

            _state.value = if (result.isSuccess) {
                ProbeUiState.Done(reading, estimate)
            } else {
                ProbeUiState.Error(
                    message = result.exceptionOrNull()?.message
                        ?: "No pudimos enviar la medición. Revisá tu conexión.",
                    reading = reading,
                    estimate = estimate,
                )
            }
        }
    }

    fun retryUpload() {
        val current = _state.value
        if (current is ProbeUiState.Error && current.reading != null && current.estimate != null) {
            val sessionId = currentSessionId ?: return
            _state.value = ProbeUiState.Measuring(progress = 1f, hint = "Reintentando upload…")
            viewModelScope.launch {
                val payload = buildPayload(sessionId, current.reading, current.estimate)
                val result = withContext(Dispatchers.IO) {
                    ApiClient(apiBase).uploadProbe(payload)
                }
                _state.value = if (result.isSuccess)
                    ProbeUiState.Done(current.reading, current.estimate)
                else ProbeUiState.Error(
                    message = result.exceptionOrNull()?.message ?: "Reintento falló",
                    reading = current.reading,
                    estimate = current.estimate,
                )
            }
        } else {
            startMeasurement()
        }
    }

    private fun buildPayload(
        sessionId: String,
        reading: BatteryReading,
        estimate: HealthEstimator.Result,
    ): JSONObject {
        val device = DeviceInfo.read()
        Log.d(TAG, "Building payload for session=$sessionId device=${device.manufacturer}/${device.model}")
        return JSONObject().apply {
            put("sessionId", sessionId)
            put("device", device.toJson())
            put("battery", reading.toJson())
            put("estimate", estimate.toJson())
            put("method", "android-probe-coulomb-v1")
            put("probeVersion", BuildConfig.VERSION_NAME)
            put("designCapacityMAh", currentDesignCapacityMAh ?: JSONObject.NULL)
            put("timestamp", java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                java.util.Locale.US
            ).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }
                .format(java.util.Date()))
        }
    }

    companion object {
        private const val TAG = "SmartCheck/ProbeVM"
        private const val HINT_INITIAL = "Leyendo el equipo, no toques nada por unos segundos."
        // Estos textos los lee el operador y se los puede explicar al cliente en el local.
        // Lenguaje claro, sin jerga técnica, dejando explícito que NO es un test agresivo.
        private const val HINT_CHARGING = "Estamos midiendo cuánta energía entra a la batería mientras carga, y comparándolo con la capacidad de fábrica de tu modelo. No la descargamos ni la estresamos. Mantené el cable conectado los 60 segundos para precisión alta."
        private const val HINT_NOT_CHARGING = "Estamos midiendo cuánta energía sale de la batería mientras se descarga lentamente. No la cargamos ni la estresamos. Para mejor precisión: conectá el cargador y reiniciamos la medición — sube de baja a alta confianza."
    }
}

/** Extensión: serializa el resultado del estimador para el payload del backend. */
private fun HealthEstimator.Result.toJson(): JSONObject = JSONObject().apply {
    when (this@toJson) {
        is HealthEstimator.Result.Ok -> {
            put("status", "ok")
            put("healthPct", healthPct)
            put("estimatedCapacityUAh", estimatedCapacityUAh)
            put("designCapacityUAh", designCapacityUAh)
            put("deltaLevelPct", deltaLevelPct)
            put("deltaUAh", deltaUAh)
            put("durationMs", durationMs)
            put("sampleCount", sampleCount)
            put("confidence", confidence.name.lowercase())
            put("direction", direction.name.lowercase())
            putOpt("avgTemperatureC", avgTemperatureC)
            put("tempWarning", tempWarning)
        }
        is HealthEstimator.Result.NoDesign -> {
            put("status", "no_design_capacity")
            put("estimatedCapacityUAh", estimatedCapacityUAh)
            put("sampleCount", sampleCount)
        }
        is HealthEstimator.Result.InsufficientChange -> {
            put("status", "insufficient_change")
            put("deltaLevelPct", deltaLevelPct)
            put("sampleCount", sampleCount)
        }
        is HealthEstimator.Result.NoCounter -> {
            put("status", "no_charge_counter")
        }
    }
}
