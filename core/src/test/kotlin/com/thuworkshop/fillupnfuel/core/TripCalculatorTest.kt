package com.thuworkshop.fillupnfuel.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class TripCalculatorTest {
    private val base = TripInput(
        distance = 300.0,
        distanceUnit = DistanceUnit.KILOMETERS,
        consumption = 6.0,
        fuelUnit = FuelUnit.LITERS_PER_100_KM,
        fuelPrice = 20.0,
        tankSize = 50.0,
        extraCost = 15.0,
    )

    @Test
    fun `kilometres with litres per 100 km`() {
        val cost = calculateTrip(base)
        assertEquals(1.2, cost.costPerDistanceUnit, 1e-9)
        assertEquals(375.0, cost.costOneWay, 1e-9)
        assertEquals(750.0, cost.costBothWays, 1e-9)
        assertEquals(833.333, cost.rangePerTank!!, 1e-3)
        assertEquals(RefillAdvice.NO_REFILL, cost.refill)
    }

    @Test
    fun `miles with miles per gallon`() {
        val cost = calculateTrip(
            base.copy(distance = 400.0, distanceUnit = DistanceUnit.MILES, consumption = 40.0,
                fuelUnit = FuelUnit.MILES_PER_GALLON, fuelPrice = 3.0, tankSize = 12.0, extraCost = 0.0),
        )
        assertEquals(0.075, cost.costPerDistanceUnit, 1e-9)
        assertEquals(30.0, cost.costOneWay, 1e-9)
        assertEquals(480.0, cost.rangePerTank!!, 1e-9)
        assertEquals(RefillAdvice.NO_REFILL, cost.refill)
    }

    @Test
    fun `kilometres with miles per gallon`() {
        val cost = calculateTrip(base.copy(consumption = 40.0, fuelUnit = FuelUnit.MILES_PER_GALLON, tankSize = 12.0))
        val kmPerGallon = 40 * 1.60934
        assertEquals(20.0 / kmPerGallon, cost.costPerDistanceUnit, 1e-9)
        assertEquals(12 * kmPerGallon, cost.rangePerTank!!, 1e-9)
    }

    @Test
    fun `miles with litres per 100 km`() {
        val cost = calculateTrip(base.copy(distanceUnit = DistanceUnit.MILES))
        val litersPerMile = 0.06 * 1.60934
        assertEquals(20 * litersPerMile, cost.costPerDistanceUnit, 1e-9)
        assertEquals(50 / litersPerMile, cost.rangePerTank!!, 1e-9)
    }

    @Test
    fun `a trip longer than a tank needs a refill`() {
        assertEquals(RefillAdvice.REFILL_ON_THE_WAY, calculateTrip(base.copy(distance = 900.0)).refill)
    }

    @Test
    fun `without tank size there is no range`() {
        val cost = calculateTrip(base.copy(tankSize = 0.0))
        assertNull(cost.rangePerTank)
        assertEquals(RefillAdvice.NEEDS_TANK_SIZE, cost.refill)
        assertEquals(375.0, cost.costOneWay, 1e-9)
    }

    @Test
    fun `zero consumption gives zero cost and no range`() {
        val cost = calculateTrip(base.copy(consumption = 0.0, fuelUnit = FuelUnit.MILES_PER_GALLON, extraCost = 0.0))
        assertEquals(0.0, cost.costOneWay, 0.0)
        assertNull(cost.rangePerTank)
    }
}
