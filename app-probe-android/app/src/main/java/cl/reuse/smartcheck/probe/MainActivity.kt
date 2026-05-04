package cl.reuse.smartcheck.probe

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import cl.reuse.smartcheck.probe.ui.ConsentScreen
import cl.reuse.smartcheck.probe.ui.DoneScreen
import cl.reuse.smartcheck.probe.ui.ErrorScreen
import cl.reuse.smartcheck.probe.ui.MeasuringScreen
import cl.reuse.smartcheck.probe.ui.SmartCheckProbeTheme

/**
 * Único Activity de la app. Maneja el deep-link smartcheck://probe?sessionId=...
 *
 * Por launchMode="singleTask" si el usuario tiene la app abierta y vuelve a escanear
 * el QR, recibimos onNewIntent y actualizamos el sessionId sin reiniciar el flujo.
 */
class MainActivity : ComponentActivity() {

    private val vm: ProbeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent)

        setContent {
            SmartCheckProbeTheme {
                val state by vm.state.collectAsState()
                when (val s = state) {
                    is ProbeUiState.Consent -> ConsentScreen(
                        sessionId = s.sessionId,
                        onAccept = { vm.startMeasurement() },
                        onCancel = { finish() },
                    )
                    is ProbeUiState.Measuring -> MeasuringScreen(progress = s.progress, hint = s.hint)
                    is ProbeUiState.Done -> {
                        DoneScreen(
                            reading = s.reading,
                            estimate = s.estimate,
                            onClose = { finishAndRemoveTask() },
                        )
                        // Auto-cerrar a los 8 segundos (más tiempo porque ahora hay más data que mirar).
                        LaunchedEffect(s) {
                            Handler(Looper.getMainLooper()).postDelayed({
                                if (!isFinishing) finishAndRemoveTask()
                            }, AUTO_CLOSE_DELAY_MS)
                        }
                    }
                    is ProbeUiState.Error -> ErrorScreen(
                        message = s.message,
                        onRetry = { vm.retryUpload() },
                        onClose = { finish() },
                    )
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        val data = intent?.data ?: return
        val sessionId = data.getQueryParameter("sessionId")
            ?: data.getQueryParameter("session_id")
        // designCapacityMAh viene de la TAC db de SmartCheck (ej. Note 20 Ultra = 4500).
        // Sin esto el estimador devuelve sólo capacidad estimada, no % salud.
        val designCapacityMAh = data.getQueryParameter("designCapacityMAh")?.toIntOrNull()
            ?: data.getQueryParameter("design_capacity_mah")?.toIntOrNull()
        Log.i(TAG, "deep-link: $data → sessionId=$sessionId designCapacity=${designCapacityMAh}mAh")
        vm.onDeepLink(sessionId, designCapacityMAh)
    }

    companion object {
        private const val TAG = "SmartCheck/MainActivity"
        private const val AUTO_CLOSE_DELAY_MS = 8_000L
    }
}
