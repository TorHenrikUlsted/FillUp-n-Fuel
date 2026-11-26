package com.thuworkshop.fillupnfuel.core

import kotlin.math.roundToLong

/** The fuel figures that change meaning when the [FuelUnit] changes, as typed. */
data class FuelFigures(
    val consumption: String,
    val tankSize: String,
    val fuelPrice: String,
)

/**
 * Converts typed fuel figures from one unit to another. Blank or unreadable
 * fields are left as they are.
 */
fun FuelFigures.convert(from: FuelUnit, to: FuelUnit): FuelFigures {
    if (from == to) return this
    val toMpg = to == FuelUnit.MILES_PER_GALLON
    return FuelFigures(
        consumption = consumption.convertWith { if (it == 0.0) 0.0 else Factors.L100KM_TIMES_MPG / it },
        tankSize = tankSize.convertWith {
            if (toMpg) it * Factors.GALLONS_PER_LITER else (it * Factors.LITERS_PER_GALLON).roundToLong().toDouble()
        },
        fuelPrice = fuelPrice.convertWith {
            if (toMpg) it * Factors.LITERS_PER_GALLON else it / Factors.LITERS_PER_GALLON
        },
    )
}

/** Converts a typed distance between units, keeping one decimal. Blank input stays blank. */
fun convertDistance(distance: String, from: DistanceUnit, to: DistanceUnit): String {
    if (from == to) return distance
    val factor = if (to == DistanceUnit.MILES) Factors.MILES_PER_KM else Factors.KM_PER_MILE
    return distance.convertWith(decimals = 1) { it * factor }
}

private fun String.convertWith(decimals: Int = 2, transform: (Double) -> Double): String {
    val value = parseDecimal(this) ?: return this
    return formatForInput(transform(value).orZeroIfInvalid(), decimals)
}
