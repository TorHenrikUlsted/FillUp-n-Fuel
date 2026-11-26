package com.thuworkshop.fillupnfuel.core

import kotlin.math.ceil

data class TripInput(
    val distance: Double,
    val distanceUnit: DistanceUnit,
    val consumption: Double,
    val fuelUnit: FuelUnit,
    val fuelPrice: Double,
    val tankSize: Double,
    val extraCost: Double,
)

data class TripCost(
    /** How far a full tank goes, in the trip's distance unit; null without tank size and consumption. */
    val rangePerTank: Double?,
    /** Fuel cost per kilometre or mile, whichever the trip uses. */
    val costPerDistanceUnit: Double,
    val costOneWay: Double,
    val costBothWays: Double,
    /** Stops to refuel on the way, starting with a full tank; null without a range. */
    val refuelStops: Int?,
)

/** What a trip costs in fuel (plus extra fees), and whether a full tank lasts it. */
fun calculateTrip(input: TripInput): TripCost = with(input) {
    // Fuel used per unit of trip distance, in the fuel unit's volume (litres or gallons).
    val fuelPerDistanceUnit = when (fuelUnit) {
        FuelUnit.LITERS_PER_100_KM -> {
            val litersPerKm = consumption / 100
            if (distanceUnit == DistanceUnit.KILOMETERS) litersPerKm else litersPerKm * Factors.KM_PER_MILE
        }
        FuelUnit.MILES_PER_GALLON -> {
            val distancePerGallon =
                if (distanceUnit == DistanceUnit.KILOMETERS) consumption * Factors.KM_PER_MILE else consumption
            if (distancePerGallon > 0) 1 / distancePerGallon else 0.0
        }
    }

    val hasRange = tankSize > 0 && consumption > 0 && fuelPerDistanceUnit > 0
    val range = if (hasRange) tankSize / fuelPerDistanceUnit else null
    val costPerUnit = (fuelPrice * fuelPerDistanceUnit).orZeroIfInvalid()
    val oneWay = (distance * costPerUnit + extraCost).orZeroIfInvalid()

    TripCost(
        rangePerTank = range,
        costPerDistanceUnit = costPerUnit,
        costOneWay = oneWay,
        costBothWays = oneWay * 2,
        refuelStops = range?.let { (ceil(distance / it).toInt() - 1).coerceAtLeast(0) },
    )
}
