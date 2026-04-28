package cl.reuse.smartcheck.probe.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cl.reuse.smartcheck.probe.R

@Composable
fun MeasuringScreen() {
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
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(contentAlignment = Alignment.Center) {
            // Halo
            Box(
                Modifier
                    .scale(pulse)
                    .size(180.dp)
                    .clip(CircleShape)
                    .background(Mint500.copy(alpha = 0.15f))
            )
            Box(
                Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(Mint500),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = Ink900,
                    strokeWidth = 4.dp,
                    modifier = Modifier.size(48.dp),
                )
            }
        }
        Spacer(Modifier.height(36.dp))
        Text(
            text = stringResource(R.string.measuring_title),
            color = Color.White,
            fontSize = 22.sp,
            fontWeight = FontWeight.SemiBold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.measuring_subtitle),
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 14.sp,
        )
    }
}
