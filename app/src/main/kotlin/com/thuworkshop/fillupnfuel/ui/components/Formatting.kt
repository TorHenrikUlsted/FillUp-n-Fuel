package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalConfiguration

/** Formats a result with two decimals, in the app's current language (comma in Norwegian). */
@Composable
fun formatAmount(value: Double): String =
    String.format(LocalConfiguration.current.locales[0], "%.2f", value)
