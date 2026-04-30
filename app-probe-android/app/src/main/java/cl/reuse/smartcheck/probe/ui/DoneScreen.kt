package cl.reuse.smartcheck.probe.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cl.reuse.smartcheck.probe.BatteryReading
import cl.reuse.smartcheck.probe.R

@Composable
fun DoneScreen(
    reading: BatteryReading,
    onClose: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Ink900)
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(24.dp))

        Box(
            Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(Mint500),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.Check,
                contentDescription = null,
                tint = Ink900,
                modifier = Modifier.size(48.dp),
            )
        }

        Spacer(Modifier.height(20.dp))
        Text(
            text = stringResource(R.string.done_title),
            color = Color.White,
            fontSize = 26.sp,
            fontWeight = FontWeight.SemiBold,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = stringResource(R.string.done_subtitle),
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 13.sp,
        )

        Spacer(Modifier.height(20.dp))

        // --- Health card (siempre visible, dice "no disponible" si el OEM lo bloquea) ---
        Surface(
            color = Color.White.copy(alpha = 0.05f),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column(Modifier.padding(18.dp)) {
                Text(
                    text = stringResource(R.string.done_health).uppercase(),
                    color = Color.White.copy(alpha = 0.5f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(Modifier.height(6.dp))
                if (reading.healthPct != null) {
                    Text(
                        text = "${"%.1f".format(reading.healthPct)}%",
                        color = Color.White,
                        fontSize = 40.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                } else {
                    Text(
                        text = stringResource(R.string.done_health_unavailable),
                        color = Color.White.copy(alpha = 0.7f),
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Medium,
                    )
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(
                            Icons.Default.Info,
                            contentDescription = null,
                            tint = Color.White.copy(alpha = 0.5f),
                            modifier = Modifier.size(14.dp),
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            text = stringResource(R.string.done_health_restricted_note),
                            color = Color.White.copy(alpha = 0.55f),
                            fontSize = 11.sp,
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(10.dp))

        // --- Métricas que SÍ leemos: temperatura, voltaje, carga, ciclos ---
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            MetricCard(
                label = stringResource(R.string.done_level),
                value = reading.levelPct?.let { "$it%" } ?: "—",
                modifier = Modifier.weight(1f),
            )
            MetricCard(
                label = stringResource(R.string.done_temp),
                value = reading.temperatureCelsius?.let { "${"%.1f".format(it)}°" } ?: "—",
                modifier = Modifier.weight(1f),
            )
            MetricCard(
                label = stringResource(R.string.done_voltage),
                value = reading.voltageMv?.let { "${"%.2f".format(it / 1000.0)}V" } ?: "—",
                modifier = Modifier.weight(1f),
            )
        }

        Spacer(Modifier.height(8.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            MetricCard(
                label = stringResource(R.string.done_cycles),
                value = reading.cycleCount?.toString() ?: "—",
                modifier = Modifier.weight(1f),
            )
            MetricCard(
                label = stringResource(R.string.done_capacity),
                value = reading.currentCapacityUAh
                    ?.let { "${(it / 1000)} mAh" }
                    ?: "—",
                modifier = Modifier.weight(1f),
            )
            MetricCard(
                label = stringResource(R.string.done_technology),
                value = reading.technology ?: "—",
                modifier = Modifier.weight(1f),
            )
        }

        Spacer(Modifier.height(8.dp))

        // Estado de carga, full width
        Surface(
            color = Color.White.copy(alpha = 0.05f),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                Modifier.padding(14.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = stringResource(R.string.done_charging).uppercase(),
                    color = Color.White.copy(alpha = 0.5f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(Modifier.weight(1f))
                Text(
                    text = if (reading.isCharging == true)
                        stringResource(R.string.done_charging_yes)
                    else stringResource(R.string.done_charging_no),
                    color = if (reading.isCharging == true) Mint500 else Color.White.copy(alpha = 0.8f),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                )
            }
        }

        Spacer(Modifier.height(20.dp))

        Button(
            onClick = onClose,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White.copy(alpha = 0.1f),
                contentColor = Color.White,
            ),
        ) {
            Text(
                text = stringResource(R.string.done_close),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
            )
        }

        Spacer(Modifier.height(12.dp))
    }
}

@Composable
private fun MetricCard(label: String, value: String, modifier: Modifier = Modifier) {
    Surface(
        color = Color.White.copy(alpha = 0.05f),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier,
    ) {
        Column(Modifier.padding(12.dp)) {
            Text(
                text = label.uppercase(),
                color = Color.White.copy(alpha = 0.5f),
                fontSize = 9.sp,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = value,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
fun ErrorScreen(
    message: String,
    onRetry: () -> Unit,
    onClose: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Ink900)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = stringResource(R.string.error_upload),
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = message,
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 12.sp,
        )
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = onRetry,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Mint500, contentColor = Ink900),
        ) {
            Text(stringResource(R.string.error_retry), fontWeight = FontWeight.SemiBold)
        }
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onClose, modifier = Modifier.fillMaxWidth()) {
            Text(stringResource(R.string.done_close), color = Color.White.copy(alpha = 0.6f))
        }
    }
}
