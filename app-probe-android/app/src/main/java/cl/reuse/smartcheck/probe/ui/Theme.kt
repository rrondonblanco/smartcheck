package cl.reuse.smartcheck.probe.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Paleta Reuse — sincronizada con app v2.html / colors.xml
val Ink900 = Color(0xFF151930)
val Ink800 = Color(0xFF181B33)
val Ink700 = Color(0xFF1B1F3A)
val Ink500 = Color(0xFF333855)
val Mint500 = Color(0xFFC6FFAD)
val Mint400 = Color(0xFFA8EF84)
val Canvas = Color(0xFFFAFAF7)

private val DarkColors = darkColorScheme(
    primary = Mint500,
    onPrimary = Ink900,
    secondary = Mint400,
    background = Ink900,
    onBackground = Color.White,
    surface = Ink800,
    onSurface = Color.White,
)

@Composable
fun SmartCheckProbeTheme(content: @Composable () -> Unit) {
    // SmartCheck siempre en dark. Coherencia con la web (que también está siempre dark).
    MaterialTheme(
        colorScheme = DarkColors,
        content = content,
    )
}
