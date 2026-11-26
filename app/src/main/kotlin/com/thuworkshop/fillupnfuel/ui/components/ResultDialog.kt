package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.theme.AppColors

/** A card of results with a close button. */
@Composable
fun ResultDialog(onDismiss: () -> Unit, content: @Composable ColumnScope.() -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(12.dp), color = Color.White) {
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(28.dp),
            ) {
                content()
                PrimaryButton(stringResource(R.string.close), onClick = onDismiss)
            }
        }
    }
}

/** A faint heading over one or more result lines. */
@Composable
fun ResultSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(title, color = AppColors.Faint, fontSize = 22.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(bottom = 8.dp))
        content()
    }
}

/** A result line: the number in sage, followed by its unit or meaning in black. */
@Composable
fun ResultLine(value: String, suffix: String = "") {
    Text(amountWithSuffix(value, suffix), fontSize = 20.sp, textAlign = TextAlign.Center)
}

/** A plain result message, red when it asks for missing input. */
@Composable
fun ResultMessage(text: String, warning: Boolean = false) {
    Text(text, fontSize = 18.sp, textAlign = TextAlign.Center, color = if (warning) AppColors.Warning else Color.Black)
}

fun amountWithSuffix(value: String, suffix: String): AnnotatedString = buildAnnotatedString {
    withStyle(SpanStyle(color = AppColors.SageDark)) { append(value) }
    if (suffix.isNotEmpty()) append(" $suffix")
}
