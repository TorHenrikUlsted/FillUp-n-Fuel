package com.thuworkshop.fillupnfuel.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R

/** Colours taken from the app logo: sage, mint, a warm yellow and near-black ink. */
object AppColors {
    /** Screen background. */
    val Ground = Color(0xFFF6F8F5)
    val Surface = Color.White
    val Ink = Color(0xFF15201A)

    /** Labels and secondary text; 5.6:1 on [Ground]. */
    val Muted = Color(0xFF56665B)

    /** Field and card borders, the empty gauge arc. */
    val Line = Color(0xFFDCE5DE)

    /** The result card. */
    val Forest = Color(0xFF2F5D44)

    /** Chips on the result card. */
    val ForestChip = Color(0xFF456E58)

    /** Small labels on [Forest]; 5.4:1. */
    val OnForestMuted = Color(0xFFCFE3D6)

    /** Unit switches, the selected tab, gauge buttons. */
    val Mint = Color(0xFFDCEBDF)
    val OnMint = Color(0xFF1F3B2C)

    /** Something to act on: refuel stops, missing tank size. */
    val Sun = Color(0xFFF6DD8B)
    val OnSun = Color(0xFF3D2E00)

    /** The filled part of the fuel gauge. */
    val GaugeFill = Color(0xFF3F8F63)
    val TickMinor = Color(0xFFA7B5AB)

    /** Unselected segment track, the close button. */
    val Track = Color(0xFFF1F4F1)
}

/** Headings and numbers. Body text uses the system font. */
val SpaceGrotesk = FontFamily(
    Font(R.font.space_grotesk_medium, FontWeight.Medium),
    Font(R.font.space_grotesk_semibold, FontWeight.SemiBold),
    Font(R.font.space_grotesk_bold, FontWeight.Bold),
)

object AppText {
    val Display = TextStyle(fontFamily = SpaceGrotesk, fontWeight = FontWeight.Bold, fontSize = 48.sp, lineHeight = 52.sp)
    val Title = TextStyle(fontFamily = SpaceGrotesk, fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
    val Level = TextStyle(fontFamily = SpaceGrotesk, fontWeight = FontWeight.Bold, fontSize = 30.sp)
    val FieldLarge = TextStyle(fontFamily = SpaceGrotesk, fontWeight = FontWeight.SemiBold, fontSize = 28.sp, color = AppColors.Ink)
    val Field = TextStyle(fontWeight = FontWeight.Medium, fontSize = 20.sp, color = AppColors.Ink)
    val Label = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = AppColors.Muted)
    val Chip = TextStyle(fontWeight = FontWeight.Medium, fontSize = 13.sp)
}

private val colorScheme = lightColorScheme(
    primary = AppColors.Forest,
    onPrimary = Color.White,
    primaryContainer = AppColors.Mint,
    onPrimaryContainer = AppColors.OnMint,
    secondaryContainer = AppColors.Mint,
    onSecondaryContainer = AppColors.OnMint,
    background = AppColors.Ground,
    onBackground = AppColors.Ink,
    surface = AppColors.Surface,
    onSurface = AppColors.Ink,
    onSurfaceVariant = AppColors.Muted,
    surfaceContainer = AppColors.Surface,
    surfaceContainerLow = AppColors.Surface,
    outline = AppColors.Line,
    outlineVariant = AppColors.Line,
)

/** The app is light-only. */
@Composable
fun FillUpTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = colorScheme, typography = Typography(), content = content)
}
