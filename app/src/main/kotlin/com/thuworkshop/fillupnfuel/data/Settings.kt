package com.thuworkshop.fillupnfuel.data

import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FillUpCost
import com.thuworkshop.fillupnfuel.core.FuelFigures
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.core.TripInput
import com.thuworkshop.fillupnfuel.core.calculateFillUp
import com.thuworkshop.fillupnfuel.core.parseDecimal

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

    /** The trip as numbers; blank or unreadable fields count as 0. */
    fun tripInput(): TripInput = TripInput(
        distance = distance.number(),
        distanceUnit = distanceUnit,
        consumption = consumption.number(),
        fuelUnit = fuelUnit,
        fuelPrice = fuelPrice.number(),
        tankSize = tankSize.number(),
        extraCost = extraCost.number(),
    )

    fun fillUpCost(): FillUpCost = calculateFillUp(tankSize.number(), fuelPrice.number(), fuelLevel)

    private fun String.number(): Double = parseDecimal(this) ?: 0.0
}
