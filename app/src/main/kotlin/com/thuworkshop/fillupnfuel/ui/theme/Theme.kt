package com.thuworkshop.fillupnfuel.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

object AppColors {
    val Sage = Color(0xFFA8BFAD)
    val SageDark = Color(0xFF859889)
    val Faint = Color(0xFF999999)
    val Label = Color(0xFF64748B)
    val Placeholder = Color(0xFF94A3B8)
    val InputText = Color(0xFF1E293B)
    val InputBackground = Color(0xFFF8FAFC)
    val InputBorder = Color(0xFFE2E8F0)
    val Divider = Color(0xFFE0E0E0)
    val BackBar = Color(0xFFDDDDDD)
    val Warning = Color(0xFFDC2626)
}

private val colorScheme = lightColorScheme(
    primary = AppColors.Sage,
    onPrimary = Color.White,
    secondary = AppColors.SageDark,
    onSecondary = Color.White,
    background = Color.White,
    onBackground = Color.Black,
    surface = Color.White,
    onSurface = Color.Black,
    error = AppColors.Warning,
)

/** The app is light-only, as before. */
@Composable
fun FillUpTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = colorScheme, content = content)
}
