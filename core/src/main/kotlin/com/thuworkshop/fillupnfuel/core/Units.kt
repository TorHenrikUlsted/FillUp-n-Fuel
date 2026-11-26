package com.thuworkshop.fillupnfuel.core

/** The unit a trip distance is entered in. [key] is the value stored on disk. */
enum class DistanceUnit(val key: String) {
    KILOMETERS("km"),
    MILES("mi");

    companion object {
        fun fromKey(key: String?): DistanceUnit = entries.firstOrNull { it.key == key } ?: KILOMETERS
    }
}

/**
 * The unit fuel figures are entered in. It decides how consumption, tank size and
 * price are read: L/100 km with litres and price per litre, or miles per US gallon
 * with gallons and price per gallon. [key] is the value stored on disk.
 */
enum class FuelUnit(val key: String) {
    LITERS_PER_100_KM("lpk"),
    MILES_PER_GALLON("mpg");

    companion object {
        fun fromKey(key: String?): FuelUnit = entries.firstOrNull { it.key == key } ?: LITERS_PER_100_KM
    }
}

internal object Factors {
    const val KM_PER_MILE = 1.60934
    const val MILES_PER_KM = 0.621371
    const val LITERS_PER_GALLON = 3.785411784
    const val GALLONS_PER_LITER = 0.264172

    /** L/100 km × mpg = this constant, so each converts to the other the same way. */
    const val L100KM_TIMES_MPG = 235.215
}
