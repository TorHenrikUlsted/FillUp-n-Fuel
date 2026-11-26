package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.core.isDecimalInput
import com.thuworkshop.fillupnfuel.ui.theme.AppColors

/** A number field with an optional label above it. Accepts "," or "." as decimal separator. */
@Composable
fun NumberField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    label: String? = null,
) {
    Column(modifier) {
        if (label != null) {
            Text(
                text = label,
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.Label,
                textAlign = TextAlign.Center,
                letterSpacing = 0.3.sp,
            )
        }
        OutlinedTextField(
            value = value,
            onValueChange = { if (isDecimalInput(it)) onValueChange(it) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = {
                Text(placeholder, modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center, fontSize = 14.sp)
            },
            textStyle = TextStyle(fontSize = 16.sp, color = AppColors.InputText, textAlign = TextAlign.Center),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal, imeAction = ImeAction.Next),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = AppColors.InputBackground,
                unfocusedContainerColor = AppColors.InputBackground,
                unfocusedBorderColor = AppColors.InputBorder,
                focusedBorderColor = AppColors.Sage,
                unfocusedPlaceholderColor = AppColors.Placeholder,
                focusedPlaceholderColor = AppColors.Placeholder,
                cursorColor = AppColors.SageDark,
            ),
        )
    }
}

/** A one-tap choice between a few units. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun <T> UnitToggle(
    options: List<Pair<T, String>>,
    selected: T,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
) {
    SingleChoiceSegmentedButtonRow(modifier) {
        options.forEachIndexed { index, (value, label) ->
            SegmentedButton(
                selected = value == selected,
                onClick = { onSelect(value) },
                shape = SegmentedButtonDefaults.itemShape(index, options.size),
                colors = SegmentedButtonDefaults.colors(
                    activeContainerColor = AppColors.Sage,
                    activeContentColor = Color.White,
                    activeBorderColor = AppColors.Sage,
                    inactiveBorderColor = AppColors.InputBorder,
                ),
                icon = {},
                label = { Text(label, fontWeight = FontWeight.Bold) },
            )
        }
    }
}
