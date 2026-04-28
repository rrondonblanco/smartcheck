package cl.reuse.smartcheck.probe.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import cl.reuse.smartcheck.probe.R

@Composable
fun ConsentScreen(
    sessionId: String?,
    onAccept: () -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Ink900)
            .padding(horizontal = 20.dp)
            .padding(top = 40.dp, bottom = 16.dp)
    ) {
        Text(
            text = stringResource(R.string.app_name),
            color = Color.White.copy(alpha = 0.5f),
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.consent_title),
            color = Color.White,
            fontSize = 26.sp,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.consent_subtitle),
            color = Color.White.copy(alpha = 0.7f),
            fontSize = 14.sp,
        )

        Spacer(Modifier.height(20.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ConsentBlock(
                title = stringResource(R.string.consent_what_title),
                bullets = listOf(
                    stringResource(R.string.consent_what_1),
                    stringResource(R.string.consent_what_2),
                    stringResource(R.string.consent_what_3),
                    stringResource(R.string.consent_what_4),
                ),
            )
            ConsentBlock(
                title = stringResource(R.string.consent_where_title),
                paragraph = stringResource(R.string.consent_where),
            )
            ConsentBlock(
                title = stringResource(R.string.consent_keep_title),
                paragraph = stringResource(R.string.consent_keep),
            )
            ConsentBlock(
                title = "Lo que NO hacemos",
                paragraph = stringResource(R.string.consent_no_collect),
                emphasis = true,
            )

            // Sesión actual
            Surface(
                color = Mint500.copy(alpha = 0.1f),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(14.dp)) {
                    Text(
                        text = stringResource(R.string.consent_session_label).uppercase(),
                        color = Mint500,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = sessionId ?: stringResource(R.string.consent_no_session),
                        color = Color.White,
                        fontSize = if (sessionId != null) 16.sp else 13.sp,
                        fontWeight = FontWeight.Medium,
                    )
                }
            }
        }

        Spacer(Modifier.height(12.dp))
        Button(
            onClick = onAccept,
            enabled = !sessionId.isNullOrBlank(),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Mint500,
                contentColor = Ink900,
                disabledContainerColor = Color.White.copy(alpha = 0.1f),
                disabledContentColor = Color.White.copy(alpha = 0.4f),
            ),
        ) {
            Text(
                text = stringResource(R.string.consent_accept),
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
        Spacer(Modifier.height(8.dp))
        TextButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(
                text = stringResource(R.string.consent_cancel),
                color = Color.White.copy(alpha = 0.5f),
                fontSize = 13.sp,
            )
        }
    }
}

@Composable
private fun ConsentBlock(
    title: String,
    bullets: List<String>? = null,
    paragraph: String? = null,
    emphasis: Boolean = false,
) {
    val bg = if (emphasis) Mint500.copy(alpha = 0.05f) else Color.White.copy(alpha = 0.05f)
    Surface(
        color = bg,
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(14.dp)) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(8.dp))
            bullets?.forEach { b ->
                Row(
                    modifier = Modifier.padding(vertical = 2.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text("• ", color = Mint500, fontSize = 13.sp)
                    Text(b, color = Color.White.copy(alpha = 0.75f), fontSize = 13.sp, lineHeight = 18.sp)
                }
            }
            paragraph?.let {
                Text(it, color = Color.White.copy(alpha = 0.75f), fontSize = 13.sp, lineHeight = 18.sp)
            }
        }
    }
}
