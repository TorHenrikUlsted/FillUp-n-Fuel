package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.util.VelocityTracker
import androidx.compose.ui.input.pointer.util.addPointerInputChange
import androidx.compose.ui.unit.dp
import kotlin.math.abs

enum class SwipeDirection { Left, Right, Up, Down }

/**
 * Calls [onSwipe] when a clear swipe ends on this element: long enough, or a quick
 * flick, and mostly along one axis. It only watches, so fields and scrolling
 * inside keep working. [allowed] is checked when the finger goes down.
 */
fun Modifier.onSwipe(
    allowed: () -> Set<SwipeDirection> = { SwipeDirection.entries.toSet() },
    onSwipe: (SwipeDirection) -> Unit,
): Modifier = pointerInput(Unit) {
    val distance = 80.dp.toPx()
    val flickDistance = 24.dp.toPx()
    val flickVelocity = 1000.dp.toPx()

    awaitEachGesture {
        val down = awaitFirstDown(requireUnconsumed = false, pass = PointerEventPass.Initial)
        val directions = allowed()
        val tracker = VelocityTracker().apply { addPointerInputChange(down) }
        var last = down
        do {
            val change = awaitPointerEvent(PointerEventPass.Initial).changes.firstOrNull { it.id == down.id } ?: return@awaitEachGesture
            tracker.addPointerInputChange(change)
            last = change
        } while (change.pressed)

        val delta = last.position - down.position
        val velocity = tracker.calculateVelocity()
        val horizontal = abs(delta.x) >= abs(delta.y)
        val (main, cross, speed) =
            if (horizontal) Triple(delta.x, delta.y, velocity.x) else Triple(delta.y, delta.x, velocity.y)
        val clear = abs(main) > 1.5f * abs(cross) &&
            (abs(main) >= distance || (abs(main) >= flickDistance && abs(speed) >= flickVelocity && speed * main > 0))
        if (!clear) return@awaitEachGesture

        val direction = when {
            horizontal && main < 0 -> SwipeDirection.Left
            horizontal -> SwipeDirection.Right
            main < 0 -> SwipeDirection.Up
            else -> SwipeDirection.Down
        }
        if (direction in directions) onSwipe(direction)
    }
}
