package com.thuworkshop.fillupnfuel.core

import org.junit.Assert.assertEquals
import org.junit.Test

class FillUpCalculatorTest {
    @Test
    fun `fills the rest of the tank`() {
        val cost = calculateFillUp(tankSize = 60.0, fuelPrice = 20.0, level = FuelLevel(4))
        assertEquals(45.0, cost.fuelNeeded, 1e-9)
        assertEquals(900.0, cost.cost, 1e-9)
    }

    @Test
    fun `empty and full tanks`() {
        assertEquals(60.0, calculateFillUp(60.0, 1.0, FuelLevel.EMPTY).fuelNeeded, 0.0)
        assertEquals(0.0, calculateFillUp(60.0, 1.0, FuelLevel.FULL).fuelNeeded, 0.0)
    }

    @Test
    fun `labels are reduced fractions`() {
        assertEquals("0", FuelLevel.EMPTY.label)
        assertEquals("1/16", FuelLevel(1).label)
        assertEquals("3/8", FuelLevel(6).label)
        assertEquals("1/2", FuelLevel.HALF.label)
        assertEquals("1/1", FuelLevel.FULL.label)
    }

    @Test
    fun `level stays within the gauge`() {
        assertEquals(FuelLevel.EMPTY, FuelLevel.EMPTY.lower())
        assertEquals(FuelLevel.FULL, FuelLevel.FULL.higher())
        assertEquals(FuelLevel.HALF, FuelLevel.fromStep(42))
    }
}
