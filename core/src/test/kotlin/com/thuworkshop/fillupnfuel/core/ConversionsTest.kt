package com.thuworkshop.fillupnfuel.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ConversionsTest {
    @Test
    fun `litres per 100 km to miles per gallon and back`() {
        val metric = FuelFigures(consumption = "6", tankSize = "50", fuelPrice = "20")
        val imperial = metric.convert(FuelUnit.LITERS_PER_100_KM, FuelUnit.MILES_PER_GALLON)
        assertEquals(FuelFigures(consumption = "39.2", tankSize = "13.21", fuelPrice = "75.71"), imperial)

        val back = imperial.convert(FuelUnit.MILES_PER_GALLON, FuelUnit.LITERS_PER_100_KM)
        assertEquals(FuelFigures(consumption = "6", tankSize = "50", fuelPrice = "20"), back)
    }

    @Test
    fun `blank fields stay blank`() {
        val figures = FuelFigures(consumption = "", tankSize = "", fuelPrice = "")
        assertEquals(figures, figures.convert(FuelUnit.LITERS_PER_100_KM, FuelUnit.MILES_PER_GALLON))
        assertEquals("", convertDistance("", DistanceUnit.KILOMETERS, DistanceUnit.MILES))
    }

    @Test
    fun `distance keeps one decimal`() {
        assertEquals("62.1", convertDistance("100", DistanceUnit.KILOMETERS, DistanceUnit.MILES))
        assertEquals("160.9", convertDistance("100", DistanceUnit.MILES, DistanceUnit.KILOMETERS))
    }

    @Test
    fun `decimal comma and point are both read`() {
        assertEquals(12.5, parseDecimal("12,5")!!, 0.0)
        assertEquals(12.5, parseDecimal(" 12.5 ")!!, 0.0)
        assertNull(parseDecimal(""))
        assertNull(parseDecimal("abc"))
        assertTrue(isDecimalInput("12,5"))
        assertFalse(isDecimalInput("1.2.3"))
        assertFalse(isDecimalInput("12a"))
    }
}
