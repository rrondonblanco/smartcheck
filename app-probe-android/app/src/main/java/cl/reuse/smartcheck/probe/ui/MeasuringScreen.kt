package cl.reuse.smartcheck.probe.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cl.reuse.smartcheck.probe.R

/**
 * Pantalla de medición. Muestra:
 *  - halo pulsante (decoración)
 *  - barra de progreso real con [progress] 0..1
 *  - tip educativo en card prominente con [tipHeadline] + [tipBody]
 *
 * El tip explica QUÉ está pasando (Coulomb counting, no stress test) para que el
 * operador tenga lenguaje claro al hablar con el cliente.
 */
@Composable
fun MeasuringScreen(progress: Float = 0f, hint: String = "") {
    val infinite = rememberInfiniteTransition(label = "pulse")
    val pulse by infinite.animateFloat(
        initialValue = 1f,
        targetValue = 1.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseScale"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Ink900)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(contentAlignment = Alignment.Center) {
            Box(
                Modifier
                    .scale(pulse)
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(Mint500.copy(alpha = 0.15f))
            )
            Box(
                Modifier
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(Mint500),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "${(progress * 100).toInt()}%",
                    color = Ink900,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
        Spacer(Modifier.height(24.dp))
        Text(
            text = stringResource(R.string.measuring_title),
            color = Color.White,
            fontSize = 22.sp,
            fontWeight = FontWeight.SemiBold,
        )
        Spacer(Modifier.height(6.dp))
        Text(
            text = stringResource(R.string.measuring_subtitle),
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 13.sp,
            textAlign = TextAlign.Center,
        )

        Spacer(Modifier.height(20.dp))
        LinearProgressIndicator(
            progress = { progress.coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = Mint500,
            trackColor = Color.White.copy(alpha = 0.1f),
        )

        if (hint.isNotBlank()) {
            Spacer(Modifier.height(20.dp))
            // Tip card prominente — el operador necesita entender QUÉ está pasando
            // para explicarle al cliente sin sonar a "voodoo".
            TipCard(
                headline = stringResource(R.string.tip_what_we_do_headline),
                body = hint,
            )
        }
    }
}

@Composable
private fun TipCard(headline: String, body: String) {
    Surface(
        color = Mint500.copy(alpha = 0.12f),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            Modifier.padding(14.dp),
            verticalAlignment = Alignment.Top,
        ) {
            Box(
                Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(Mint500),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    Icons.Default.Info,
                    contentDescription = null,
                    tint = Ink900,
                    modifier = Modifier.size(16.dp),
                )
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    text = headline,
                    color = Mint500,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = body,
                    color = Color.White.copy(alpha = 0.85f),
                    fontSize = 12.5f.sp,
                    lineHeight = 17.sp,
                )
            }
        }
    }
}
