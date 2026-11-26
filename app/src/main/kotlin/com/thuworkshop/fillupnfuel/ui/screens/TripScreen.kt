package com.thuworkshop.fillupnfuel.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.outlined.LocalGasStation
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material.icons.outlined.SyncAlt
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import kotlin.math.roundToLong
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.core.calculateTrip
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.ui.components.CarHeader
import com.thuworkshop.fillupnfuel.ui.components.NumberField
import com.thuworkshop.fillupnfuel.ui.components.ResultCard
import com.thuworkshop.fillupnfuel.ui.components.ResultChip
import com.thuworkshop.fillupnfuel.ui.components.UnitLabels
import com.thuworkshop.fillupnfuel.ui.components.UnitChoice
import com.thuworkshop.fillupnfuel.ui.components.rememberFormats

/** What a trip costs, updated as you type. */
@Composable
fun TripScreen(
    settings: Settings,
    onChange: (Settings.() -> Settings) -> Unit,
    onDistanceUnit: (DistanceUnit) -> Unit,
    onFuelUnit: (FuelUnit) -> Unit,
) {
    val formats = rememberFormats()
    val cost = remember(settings) { calculateTrip(settings.tripInput()) }
    val distanceUnit = UnitLabels.distance(settings.distanceUnit)

    Column(
        modifier = Modifier.verticalScroll(rememberScrollState()).padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        ResultCard(stringResource(R.string.one_way), formats.money(cost.costOneWay)) {
            // Twice the shown one-way amount, so the two never disagree by a rounding step.
            ResultChip(Icons.Outlined.SyncAlt, stringResource(R.string.return_trip, formats.money(cost.costOneWay.roundToLong() * 2.0)))
            val range = cost.rangePerTank
            val stops = cost.refuelStops
            if (range != null && stops != null) {
                ResultChip(Icons.Outlined.Speed, stringResource(R.string.range_per_tank, "${formats.number(range)} $distanceUnit"))
                if (stops == 0) {
                    ResultChip(Icons.Filled.Check, stringResource(R.string.no_refuel_stop))
                } else {
                    ResultChip(Icons.Outlined.LocalGasStation, pluralStringResource(R.plurals.refuel_stops, stops, stops), attention = true)
                }
            } else {
                ResultChip(Icons.Filled.Add, stringResource(R.string.add_tank_for_range), attention = true)
            }
        }

        NumberField(
            label = stringResource(R.string.distance),
            value = settings.distance,
            onValueChange = { onChange { copy(distance = it) } },
            unitKey = settings.distanceUnit,
            large = true,
            unitSwitch = UnitChoice(distanceUnit, UnitLabels.distanceSwitch(settings.distanceUnit)) {
                onDistanceUnit(settings.distanceUnit.other())
            },
        )

        CarHeader()
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            NumberField(
                label = stringResource(R.string.consumption),
                value = settings.consumption,
                onValueChange = { onChange { copy(consumption = it) } },
                unitKey = settings.fuelUnit,
                modifier = Modifier.weight(1f),
                unitSwitch = UnitChoice(UnitLabels.consumption(settings.fuelUnit), UnitLabels.fuelSwitch(settings.fuelUnit)) {
                    onFuelUnit(settings.fuelUnit.other())
                },
            )
            NumberField(
                label = stringResource(R.string.tank),
                value = settings.tankSize,
                onValueChange = { onChange { copy(tankSize = it) } },
                unitKey = settings.fuelUnit,
                modifier = Modifier.weight(1f),
                unit = UnitLabels.volume(settings.fuelUnit),
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            NumberField(
                label = stringResource(R.string.fuel_price),
                value = settings.fuelPrice,
                onValueChange = { onChange { copy(fuelPrice = it) } },
                unitKey = settings.fuelUnit,
                modifier = Modifier.weight(1f),
                unit = UnitLabels.price(formats, settings.fuelUnit),
            )
            NumberField(
                label = stringResource(R.string.tolls_and_extras),
                value = settings.extraCost,
                onValueChange = { onChange { copy(extraCost = it) } },
                unitKey = null,
                modifier = Modifier.weight(1f),
                unit = formats.currencySymbol,
            )
        }
    }
}

private fun DistanceUnit.other() = if (this == DistanceUnit.KILOMETERS) DistanceUnit.MILES else DistanceUnit.KILOMETERS

internal fun FuelUnit.other() =
    if (this == FuelUnit.LITERS_PER_100_KM) FuelUnit.MILES_PER_GALLON else FuelUnit.LITERS_PER_100_KM
