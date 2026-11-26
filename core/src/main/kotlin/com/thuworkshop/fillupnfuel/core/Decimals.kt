package com.thuworkshop.fillupnfuel.core

import java.math.BigDecimal
import java.math.RoundingMode

/**
 * Reads a number the user typed, accepting either "," or "." as the decimal
 * separator. Blank or unreadable input gives null.
 */
fun parseDecimal(text: String): Double? =
    text.trim().replace(',', '.').toDoubleOrNull()?.takeIf { it.isFinite() }

/** True when [text] holds only characters a decimal input field accepts. */
fun isDecimalInput(text: String): Boolean =
    text.all { it.isDigit() || it == '.' || it == ',' } && text.count { it == '.' || it == ',' } <= 1

/** Formats a value for an input field: rounded, without trailing zeros, "." as separator. */
internal fun formatForInput(value: Double, decimals: Int): String =
    BigDecimal(value).setScale(decimals, RoundingMode.HALF_UP).stripTrailingZeros().toPlainString()

internal fun Double.orZeroIfInvalid(): Double = if (isFinite()) this else 0.0
