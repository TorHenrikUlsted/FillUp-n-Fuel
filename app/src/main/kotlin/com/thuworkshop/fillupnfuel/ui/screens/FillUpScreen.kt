package com.thuworkshop.fillupnfuel.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.WaterDrop
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.ui.components.CarHeader
import com.thuworkshop.fillupnfuel.ui.components.FuelGauge
import com.thuworkshop.fillupnfuel.ui.components.NumberField
import com.thuworkshop.fillupnfuel.ui.components.ResultCard
import com.thuworkshop.fillupnfuel.ui.components.ResultChip
import com.thuworkshop.fillupnfuel.ui.components.UnitLabels
import com.thuworkshop.fillupnfuel.ui.components.UnitChoice
import com.thuworkshop.fillupnfuel.ui.components.rememberFormats

/** What filling the tank costs from the gauge's level, updated as you change it. */
@Composable
fun FillUpScreen(
    settings: Settings,
    onChange: (Settings.() -> Settings) -> Unit,
    onFuelUnit: (FuelUnit) -> Unit,
    onFuelLevel: (FuelLevel) -> Unit,
) {
    val formats = rememberFormats()
    val cost = remember(settings) { settings.fillUpCost() }
    val volume = UnitLabels.volume(settings.fuelUnit)

    Column(
        modifier = Modifier.verticalScroll(rememberScrollState()).padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        ResultCard(stringResource(R.string.to_fill_up), formats.money(cost.cost)) {
            ResultChip(Icons.Outlined.WaterDrop, "${formats.number(cost.fuelNeeded, maxDecimals = 1)} $volume")
        }

        FuelGauge(settings.fuelLevel, onFuelLevel)

        CarHeader()
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            NumberField(
                label = stringResource(R.string.tank),
                value = settings.tankSize,
                onValueChange = { onChange { copy(tankSize = it) } },
                unitKey = settings.fuelUnit,
                modifier = Modifier.weight(1f),
                unitSwitch = UnitChoice(volume, UnitLabels.fuelSwitch(settings.fuelUnit)) {
                    onFuelUnit(settings.fuelUnit.other())
                },
            )
            NumberField(
                label = stringResource(R.string.fuel_price),
                value = settings.fuelPrice,
                onValueChange = { onChange { copy(fuelPrice = it) } },
                unitKey = settings.fuelUnit,
                modifier = Modifier.weight(1f),
                unit = UnitLabels.price(formats, settings.fuelUnit),
            )
        }
    }
}
