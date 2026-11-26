package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelUnit

/** Short unit names shown in fields and results. */
object UnitLabels {
    @Composable
    fun distance(unit: DistanceUnit): String = stringResource(
        if (unit == DistanceUnit.KILOMETERS) R.string.unit_km else R.string.unit_mi,
    )

    @Composable
    fun consumption(unit: FuelUnit): String = stringResource(
        if (unit == FuelUnit.LITERS_PER_100_KM) R.string.unit_l_per_100km else R.string.unit_mpg,
    )

    @Composable
    fun volume(unit: FuelUnit): String = stringResource(
        if (unit == FuelUnit.LITERS_PER_100_KM) R.string.unit_liter else R.string.unit_gallon,
    )

    /** What tapping the distance unit switches to. */
    @Composable
    fun distanceSwitch(current: DistanceUnit): String = stringResource(
        if (current == DistanceUnit.KILOMETERS) R.string.switch_to_miles else R.string.switch_to_kilometers,
    )

    /** What tapping a fuel unit switches to. */
    @Composable
    fun fuelSwitch(current: FuelUnit): String = stringResource(
        if (current == FuelUnit.LITERS_PER_100_KM) R.string.switch_to_us_units else R.string.switch_to_metric_units,
    )

    /** "kr/L", or "/L" when the phone has no region. */
    @Composable
    fun price(formats: Formats, unit: FuelUnit): String = "${formats.currencySymbol.orEmpty()}/${volume(unit)}"
}
