package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.filled.UnfoldMore
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.isDecimalInput
import com.thuworkshop.fillupnfuel.ui.theme.AppColors
import com.thuworkshop.fillupnfuel.ui.theme.AppText

/** A unit the user can switch: [text] is shown, tapping calls [onSwitch]; [switchLabel] says what it switches to. */
class UnitChoice(val text: String, val switchLabel: String, val onSwitch: () -> Unit)

/**
 * A labelled number field. A fixed [unit] sits inside the box; a [unitSwitch] sits
 * on the label row instead, so a tap on the number never switches the unit.
 * Accepts "," or "." as decimal separator.
 *
 * The field owns its text while you type. It takes [value] in again only when
 * [unitKey] changes, as a unit switch rewrites the number; copying every value
 * back would undo keystrokes that arrive within one frame.
 */
@Composable
fun NumberField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    unitKey: Any?,
    modifier: Modifier = Modifier,
    large: Boolean = false,
    unit: String? = null,
    unitSwitch: UnitChoice? = null,
) {
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    val shape = RoundedCornerShape(if (large) 18.dp else 16.dp)
    val textStyle: TextStyle = if (large) AppText.FieldLarge else AppText.Field

    val state = remember(unitKey) { TextFieldState(value) }
    val currentOnValueChange by rememberUpdatedState(onValueChange)
    LaunchedEffect(state) {
        snapshotFlow { state.text.toString() }.collect { currentOnValueChange(it) }
    }

    Column(modifier, verticalArrangement = Arrangement.spacedBy(2.dp)) {
        // Every label row has the switch's touch height, so boxes side by side stay aligned.
        Row(
            modifier = Modifier.fillMaxWidth().height(UnitSwitchTouchHeight).padding(start = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(label, style = AppText.Label, modifier = Modifier.weight(1f), maxLines = 1)
            unitSwitch?.let { UnitSwitch(it) }
        }
        BasicTextField(
            state = state,
            modifier = Modifier.fillMaxWidth().semantics { contentDescription = label },
            inputTransformation = { if (!isDecimalInput(asCharSequence().toString())) revertAllChanges() },
            textStyle = textStyle,
            lineLimits = TextFieldLineLimits.SingleLine,
            cursorBrush = SolidColor(AppColors.Forest),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal, imeAction = ImeAction.Next),
            interactionSource = interaction,
            decorator = { field ->
                Surface(
                    shape = shape,
                    color = AppColors.Surface,
                    border = if (focused) BorderStroke(2.dp, AppColors.Forest) else BorderStroke(1.5.dp, AppColors.Line),
                ) {
                    Row(
                        modifier = Modifier.height(if (large) 64.dp else 56.dp)
                            .padding(start = if (large) 18.dp else 14.dp, end = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Box(Modifier.weight(1f)) {
                            if (state.text.isEmpty()) Text("0", style = textStyle.copy(color = AppColors.TickMinor))
                            field()
                        }
                        unit?.let { Text(it, style = AppText.Label) }
                    }
                }
            },
        )
    }
}

private val UnitSwitchTouchHeight = 44.dp

/** A small unit pill that switches to the other unit when tapped; its touch area is taller than the pill. */
@Composable
private fun UnitSwitch(choice: UnitChoice) {
    Box(
        modifier = Modifier
            .height(UnitSwitchTouchHeight)
            .clip(RoundedCornerShape(14.dp))
            .clickable(onClickLabel = choice.switchLabel, role = Role.Button, onClick = choice.onSwitch)
            .semantics { contentDescription = choice.switchLabel }
            .padding(horizontal = 2.dp),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            modifier = Modifier.height(28.dp).clip(RoundedCornerShape(14.dp)).background(AppColors.Mint).padding(horizontal = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            Text(choice.text, style = AppText.Label.copy(color = AppColors.OnMint, fontSize = 12.sp))
            Icon(Icons.Filled.UnfoldMore, contentDescription = null, tint = AppColors.OnMint, modifier = Modifier.size(14.dp))
        }
    }
}

/** "Your car", above the fields both calculators share. */
@Composable
fun CarHeader() {
    Row(
        modifier = Modifier.fillMaxWidth().padding(start = 4.dp, top = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Icon(Icons.Outlined.DirectionsCar, contentDescription = null, tint = AppColors.Muted, modifier = Modifier.size(18.dp))
        Text(stringResource(R.string.your_car), style = AppText.Label)
    }
}
