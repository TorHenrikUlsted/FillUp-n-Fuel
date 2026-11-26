package com.thuworkshop.fillupnfuel.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.FillUpCost
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.ui.components.FuelGauge
import com.thuworkshop.fillupnfuel.ui.components.FuelUnitPicker
import com.thuworkshop.fillupnfuel.ui.components.NumberField
import com.thuworkshop.fillupnfuel.ui.components.PrimaryButton
import com.thuworkshop.fillupnfuel.ui.components.ResultDialog
import com.thuworkshop.fillupnfuel.ui.components.ResultLine
import com.thuworkshop.fillupnfuel.ui.components.ResultSection
import com.thuworkshop.fillupnfuel.ui.components.SwipeDirection
import com.thuworkshop.fillupnfuel.ui.components.formatAmount
import com.thuworkshop.fillupnfuel.ui.components.onSwipe

/** What filling the tank costs from the gauge's level. Swipe left to go back. */
@Composable
fun FillUpScreen(
    settings: Settings,
    result: FillUpCost?,
    onChange: (Settings.() -> Settings) -> Unit,
    onFuelUnit: (FuelUnit) -> Unit,
    onFuelLevel: (FuelLevel) -> Unit,
    onCalculate: () -> Unit,
    onDismissResult: () -> Unit,
    onBack: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .onSwipe(allowed = { setOf(SwipeDirection.Left) }) { onBack() }
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(28.dp),
    ) {
        FuelUnitPicker(settings.fuelUnit, onFuelUnit)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            NumberField(
                value = settings.tankSize,
                onValueChange = { onChange { copy(tankSize = it) } },
                placeholder = stringResource(R.string.enter_tank_size),
                label = stringResource(R.string.tank_size),
                modifier = Modifier.weight(1f),
            )
            NumberField(
                value = settings.fuelPrice,
                onValueChange = { onChange { copy(fuelPrice = it) } },
                placeholder = stringResource(R.string.enter_fuel_price),
                label = stringResource(R.string.fuel_price),
                modifier = Modifier.weight(1f),
            )
        }
        FuelGauge(settings.fuelLevel, onFuelLevel)
        PrimaryButton(stringResource(R.string.calculate), onCalculate, height = 70.dp)
    }

    if (result != null) {
        val volume = when (settings.fuelUnit) {
            FuelUnit.LITERS_PER_100_KM -> R.string.liters
            FuelUnit.MILES_PER_GALLON -> R.string.gallons
        }
        ResultDialog(onDismissResult) {
            ResultSection(stringResource(R.string.cost)) { ResultLine(formatAmount(result.cost)) }
            ResultSection(stringResource(R.string.you_need_to_fill)) {
                ResultLine(formatAmount(result.fuelNeeded), stringResource(volume))
            }
        }
    }
}
