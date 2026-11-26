package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.ui.theme.AppColors
import com.thuworkshop.fillupnfuel.ui.theme.AppText
import com.thuworkshop.fillupnfuel.ui.theme.SpaceGrotesk
import kotlin.math.PI
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

// The dial is drawn in a 320 × 204 box, scaled to fit; E and F sit below the arc ends.
private const val BOX_W = 320f
private const val BOX_H = 204f
private const val CX = 160f
private const val CY = 170f
private const val RADIUS = 140f
private const val ARC_WIDTH = 18f

/**
 * A half-circle fuel gauge from E to F in sixteenths. Tap or drag on the dial,
 * or use − and +, to set the level.
 */
@Composable
fun FuelGauge(level: FuelLevel, onLevelChange: (FuelLevel) -> Unit, modifier: Modifier = Modifier) {
    val step by animateFloatAsState(level.step.toFloat(), label = "needle")
    val label = levelLabel(level)
    val currentOnChange by rememberUpdatedState(onLevelChange)
    val textMeasurer = rememberTextMeasurer()

    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        color = AppColors.Surface,
        border = BorderStroke(1.5.dp, AppColors.Line),
    ) {
        Column(
            modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            val fuelLevel = stringResource(R.string.fuel_level, label)
            Canvas(
                modifier = Modifier
                    .widthIn(max = 320.dp)
                    .fillMaxWidth()
                    .aspectRatio(BOX_W / BOX_H)
                    .semantics { stateDescription = fuelLevel }
                    .pointerInput(Unit) {
                        detectTapGestures { currentOnChange(levelAt(it, size.width.toFloat())) }
                    }
                    .pointerInput(Unit) {
                        detectDragGestures { change, _ -> currentOnChange(levelAt(change.position, size.width.toFloat())) }
                    },
            ) {
                drawDial(step, textMeasurer)
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                StepButton(
                    enabled = level != FuelLevel.EMPTY,
                    onClick = { onLevelChange(level.lower()) },
                ) { Icon(Icons.Filled.Remove, stringResource(R.string.decrease_fuel_level)) }
                Text(label, style = AppText.Level, color = AppColors.Ink)
                StepButton(
                    enabled = level != FuelLevel.FULL,
                    onClick = { onLevelChange(level.higher()) },
                ) { Icon(Icons.Filled.Add, stringResource(R.string.increase_fuel_level)) }
            }
        }
    }
}

@Composable
private fun StepButton(enabled: Boolean, onClick: () -> Unit, icon: @Composable () -> Unit) {
    FilledTonalIconButton(
        onClick = onClick,
        enabled = enabled,
        shape = CircleShape,
        modifier = Modifier.size(56.dp),
        colors = IconButtonDefaults.filledTonalIconButtonColors(
            containerColor = AppColors.Mint,
            contentColor = AppColors.OnMint,
            disabledContainerColor = AppColors.Mint.copy(alpha = 0.4f),
            disabledContentColor = AppColors.OnMint.copy(alpha = 0.35f),
        ),
        content = icon,
    )
}

@Composable
private fun levelLabel(level: FuelLevel): String = when (level) {
    FuelLevel.EMPTY -> stringResource(R.string.gauge_empty_label)
    FuelLevel.FULL -> stringResource(R.string.gauge_full_label)
    else -> level.label
}

/** The level nearest to where the dial was touched; below the pivot counts as the nearer end. */
private fun levelAt(position: Offset, widthPx: Float): FuelLevel {
    val scale = widthPx / BOX_W
    val x = position.x / scale - CX
    val y = (position.y / scale - CY).coerceAtMost(0f)
    val angle = atan2(y, x) // −π (E) … 0 (F)
    val step = ((angle + PI) / PI * FuelLevel.STEPS).roundToInt().coerceIn(0, FuelLevel.STEPS)
    return FuelLevel(step)
}

private fun DrawScope.drawDial(step: Float, textMeasurer: TextMeasurer) {
    val scale = size.width / BOX_W
    val center = Offset(CX, CY) * scale
    val radius = RADIUS * scale
    val arcStroke = Stroke(ARC_WIDTH * scale, cap = StrokeCap.Round)
    val arcTopLeft = center - Offset(radius, radius)
    val arcSize = Size(radius * 2, radius * 2)

    drawArc(AppColors.Line, 180f, 180f, false, arcTopLeft, arcSize, style = arcStroke)
    if (step > 0.05f) {
        drawArc(AppColors.GaugeFill, 180f, 180f * step / FuelLevel.STEPS, false, arcTopLeft, arcSize, style = arcStroke)
    }

    for (i in 0..FuelLevel.STEPS) {
        val major = i % (FuelLevel.STEPS / 4) == 0
        val outer = (RADIUS - 22) * scale
        val inner = outer - (if (major) 14 else 7) * scale
        drawLine(
            color = if (major) AppColors.Muted else AppColors.TickMinor,
            start = center.polar(outer, i.toFloat()),
            end = center.polar(inner, i.toFloat()),
            strokeWidth = (if (major) 3f else 1.5f) * scale,
            cap = StrokeCap.Round,
        )
    }

    drawLine(AppColors.Ink, center, center.polar(112 * scale, step), strokeWidth = 5 * scale, cap = StrokeCap.Round)
    drawCircle(AppColors.Ink, 11 * scale, center)
    drawCircle(AppColors.Sun, 4 * scale, center)

    val edge = TextStyle(fontFamily = SpaceGrotesk, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = AppColors.Muted)
    for ((text, x) in listOf("E" to 20f, "F" to 300f)) {
        val measured = textMeasurer.measure(text, edge)
        drawText(measured, topLeft = Offset(x * scale - measured.size.width / 2f, size.height - measured.size.height))
    }
}

/** The point [distance] from this centre in the direction of gauge [step]. */
private fun Offset.polar(distance: Float, step: Float): Offset {
    val angle = PI + PI * step / FuelLevel.STEPS
    return Offset(x + (distance * cos(angle)).toFloat(), y + (distance * sin(angle)).toFloat())
}
