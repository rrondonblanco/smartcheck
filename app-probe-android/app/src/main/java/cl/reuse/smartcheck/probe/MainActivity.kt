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
                    is ProbeUiState.Measuring -> MeasuringScreen()
                    is ProbeUiState.Done -> {
                        DoneScreen(
                            reading = s.reading,
                            onClose = { finishAndRemoveTask() },
                        )
                        // Auto-cerrar a los 5 segundos para que el usuario vuelva a la web sin pelear.
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
        Log.i(TAG, "deep-link received: $data → sessionId=$sessionId")
        vm.onSessionIdReceived(sessionId)
    }

    companion object {
        private const val TAG = "SmartCheck/MainActivity"
        private const val AUTO_CLOSE_DELAY_MS = 5_000L
    }
}
