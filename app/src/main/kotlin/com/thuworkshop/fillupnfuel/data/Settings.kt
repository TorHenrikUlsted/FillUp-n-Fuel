package com.thuworkshop.fillupnfuel.data

import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelFigures
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit

/** Everything the user has typed or chosen, kept between launches. Numbers stay as typed. */
data class Settings(
    val distanceUnit: DistanceUnit = DistanceUnit.KILOMETERS,
    val distance: String = "",
    val fuelUnit: FuelUnit = FuelUnit.LITERS_PER_100_KM,
    val consumption: String = "",
    val tankSize: String = "",
    val fuelPrice: String = "",
    val extraCost: String = "",
    val fuelLevel: FuelLevel = FuelLevel.HALF,
) {
    val fuelFigures: FuelFigures get() = FuelFigures(consumption, tankSize, fuelPrice)

    fun withFuelFigures(figures: FuelFigures): Settings =
        copy(consumption = figures.consumption, tankSize = figures.tankSize, fuelPrice = figures.fuelPrice)
}
