package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.East
import androidx.compose.material.icons.filled.West
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.FuelLevel
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

private object GaugeColors {
    val Track = Color(0xFF2A2D3A)
    val TrackBorder = Color(0xFF3D4152)
    val Filled = Color(0xFF00D4AA)
    val FilledEnd = Color(0xFF00A884)
    val Needle = Color(0xFFDC2626)
    val NeedleHighlight = Color(0xFFEF4444)
    val NeedleShadow = Color(0x59000000)
    val PinCap = Color(0xFFB91C1C)
    val Tick = Color(0x59FFFFFF)
    val TickMajor = Color(0x99FFFFFF)
    val Text = Color(0xFF475569)
    val TextMuted = Color(0xFF64748B)
}

private val GaugeWidth = 300.dp
private val GaugeHeight = 200.dp
private val ArcWidth = 10.dp

/**
 * A half-circle fuel gauge from E to F in sixteenths. Tapping its left or right
 * half, or the arrows below, moves the needle one step.
 */
@Composable
fun FuelGauge(level: FuelLevel, onLevelChange: (FuelLevel) -> Unit, modifier: Modifier = Modifier) {
    val step by animateFloatAsState(level.step.toFloat(), label = "needle")
    val lower = stringResource(R.string.decrease_fuel_level)
    val higher = stringResource(R.string.increase_fuel_level)

    Column(modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Box(Modifier.size(GaugeWidth, GaugeHeight)) {
            Canvas(Modifier.matchParentSize()) { drawGauge(step) }
            Row(Modifier.matchParentSize()) {
                Box(
                    Modifier.weight(1f).fillMaxHeight()
                        .clickable(onClickLabel = lower, role = Role.Button) { onLevelChange(level.lower()) },
                )
                Box(
                    Modifier.weight(1f).fillMaxHeight()
                        .clickable(onClickLabel = higher, role = Role.Button) { onLevelChange(level.higher()) },
                )
            }
        }

        Row(
            modifier = Modifier.width(200.dp).offset(y = (-44).dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            val edge = TextStyle(fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GaugeColors.TextMuted, letterSpacing = 1.sp)
            Text(stringResource(R.string.gauge_empty), style = edge)
            Text(level.label, fontSize = 22.sp, fontWeight = FontWeight.SemiBold, color = GaugeColors.Text)
            Text(stringResource(R.string.gauge_full), style = edge)
        }

        Row(
            modifier = Modifier.offset(y = (-32).dp).fillMaxWidth().padding(horizontal = 48.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            IconButton(onClick = { onLevelChange(level.lower()) }, modifier = Modifier.size(56.dp)) {
                Icon(Icons.Filled.West, contentDescription = lower, modifier = Modifier.size(40.dp))
            }
            IconButton(onClick = { onLevelChange(level.higher()) }, modifier = Modifier.size(56.dp)) {
                Icon(Icons.Filled.East, contentDescription = higher, modifier = Modifier.size(40.dp))
            }
        }
    }
}

/** Draws the gauge with the needle at [step] (fractional while animating). */
private fun DrawScope.drawGauge(step: Float) {
    val arcWidth = ArcWidth.toPx()
    val center = Offset(size.width / 2, size.width / 2)
    val radius = (size.width - arcWidth * 2) / 2 - 8.dp.toPx()
    val arcTopLeft = Offset(center.x - radius, center.y - radius)
    val arcSize = Size(radius * 2, radius * 2)
    val sweep = 180f * step / FuelLevel.STEPS

    // Track, then the filled part from E up to the needle.
    drawArc(GaugeColors.TrackBorder, 180f, 180f, false, arcTopLeft, arcSize, style = Stroke(arcWidth + 4.dp.toPx(), cap = StrokeCap.Round))
    drawArc(GaugeColors.Track, 180f, 180f, false, arcTopLeft, arcSize, style = Stroke(arcWidth, cap = StrokeCap.Round))
    if (sweep > 0.1f) {
        drawArc(
            brush = Brush.horizontalGradient(listOf(GaugeColors.FilledEnd, GaugeColors.Filled), center.x - radius, center.x + radius),
            startAngle = 180f,
            sweepAngle = sweep,
            useCenter = false,
            topLeft = arcTopLeft,
            size = arcSize,
            style = Stroke(arcWidth, cap = StrokeCap.Round),
        )
    }

    // Ticks, with a longer one every quarter.
    for (i in 0..FuelLevel.STEPS) {
        val angle = i * PI / FuelLevel.STEPS - PI
        val major = i % (FuelLevel.STEPS / 4) == 0
        val length = (if (major) 14 else 8).dp.toPx()
        drawLine(
            color = if (major) GaugeColors.TickMajor else GaugeColors.Tick,
            start = center.polar(radius, angle),
            end = center.polar(radius - length, angle),
            strokeWidth = (if (major) 2.5f else 1.5f).dp.toPx(),
            cap = StrokeCap.Round,
        )
    }

    // Needle: a narrow triangle from just behind the pin to near the arc.
    val angle = (sweep - 180f) * PI / 180
    val tip = center.polar(radius - 4.dp.toPx(), angle)
    val back = center.polar(6.dp.toPx(), angle + PI)
    val halfWidth = 4.dp.toPx()
    val side = Offset((halfWidth * cos(angle + PI / 2)).toFloat(), (halfWidth * sin(angle + PI / 2)).toFloat())
    val needle = Path().apply {
        moveTo(tip.x, tip.y)
        lineTo(back.x + side.x, back.y + side.y)
        lineTo(back.x - side.x, back.y - side.y)
        close()
    }
    translate(2.dp.toPx(), 2.dp.toPx()) { drawPath(needle, GaugeColors.NeedleShadow) }
    drawPath(
        needle,
        Brush.linearGradient(
            0f to GaugeColors.PinCap, 0.6f to GaugeColors.Needle, 1f to GaugeColors.NeedleHighlight,
            start = back, end = tip,
        ),
    )

    drawCircle(GaugeColors.TrackBorder, 10.dp.toPx(), center)
    drawCircle(GaugeColors.PinCap, 7.dp.toPx(), center)
    drawCircle(GaugeColors.NeedleHighlight, 4.dp.toPx(), center)
}

private fun Offset.polar(distance: Float, angle: Double) =
    Offset(x + (distance * cos(angle)).toFloat(), y + (distance * sin(angle)).toFloat())
