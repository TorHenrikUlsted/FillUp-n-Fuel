package com.thuworkshop.fillupnfuel.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.core.RefillAdvice
import com.thuworkshop.fillupnfuel.core.TripCost
import com.thuworkshop.fillupnfuel.core.parseDecimal
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.ui.components.DistanceUnitToggle
import com.thuworkshop.fillupnfuel.ui.components.FuelUnitPicker
import com.thuworkshop.fillupnfuel.ui.components.NumberField
import com.thuworkshop.fillupnfuel.ui.components.PrimaryButton
import com.thuworkshop.fillupnfuel.ui.components.ResultDialog
import com.thuworkshop.fillupnfuel.ui.components.ResultLine
import com.thuworkshop.fillupnfuel.ui.components.ResultMessage
import com.thuworkshop.fillupnfuel.ui.components.ResultSection
import com.thuworkshop.fillupnfuel.ui.components.SwipeDirection
import com.thuworkshop.fillupnfuel.ui.components.distanceUnitName
import com.thuworkshop.fillupnfuel.ui.components.formatAmount
import com.thuworkshop.fillupnfuel.ui.components.fuelUnitLabel
import com.thuworkshop.fillupnfuel.ui.components.onSwipe

/** What a trip costs. Swipe right to go back. */
@Composable
fun DistanceScreen(
    settings: Settings,
    result: TripCost?,
    onChange: (Settings.() -> Settings) -> Unit,
    onDistanceUnit: (DistanceUnit) -> Unit,
    onFuelUnit: (FuelUnit) -> Unit,
    onCalculate: () -> Unit,
    onDismissResult: () -> Unit,
    onBack: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .onSwipe(allowed = { setOf(SwipeDirection.Right) }) { onBack() }
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        Text(stringResource(R.string.type_in), fontSize = 20.sp, fontWeight = FontWeight.Bold)
        DistanceUnitToggle(settings.distanceUnit, onDistanceUnit, Modifier.fillMaxWidth())
        NumberField(
            value = settings.distance,
            onValueChange = { onChange { copy(distance = it) } },
            placeholder = stringResource(R.string.enter_distance, settings.distanceUnit.key),
        )
        PrimaryButton(stringResource(R.string.calculate), onCalculate, height = 70.dp)
        FuelUnitPicker(settings.fuelUnit, onFuelUnit, Modifier.padding(top = 12.dp))

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
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            NumberField(
                value = settings.consumption,
                onValueChange = { onChange { copy(consumption = it) } },
                placeholder = stringResource(R.string.enter_fuel_efficiency),
                label = fuelUnitLabel(settings.fuelUnit),
                modifier = Modifier.weight(1f),
            )
            NumberField(
                value = settings.extraCost,
                onValueChange = { onChange { copy(extraCost = it) } },
                placeholder = stringResource(R.string.enter_extra_fees),
                label = stringResource(R.string.extra),
                modifier = Modifier.weight(1f),
            )
        }
    }

    if (result != null) {
        TripResultDialog(result, settings, onDismissResult)
    }
}

@Composable
private fun TripResultDialog(result: TripCost, settings: Settings, onDismiss: () -> Unit) {
    val unitName = distanceUnitName(settings.distanceUnit)
    val distance = formatAmount(parseDecimal(settings.distance) ?: 0.0)
    ResultDialog(onDismiss) {
        Text(
            stringResource(R.string.trip_for, "$distance $unitName"),
            fontSize = 26.sp,
            textAlign = TextAlign.Center,
        )
        ResultSection(stringResource(R.string.you_can_travel)) {
            val range = result.rangePerTank
            if (range != null) {
                ResultLine(formatAmount(range), unitName)
            } else {
                ResultMessage(stringResource(R.string.tank_size_required_for_estimate), warning = true)
            }
        }
        ResultSection(stringResource(R.string.it_will_cost)) {
            val perUnit = when (settings.distanceUnit) {
                DistanceUnit.KILOMETERS -> R.string.per_kilometer
                DistanceUnit.MILES -> R.string.per_mile
            }
            ResultLine(formatAmount(result.costPerDistanceUnit), stringResource(perUnit))
            ResultLine(formatAmount(result.costOneWay), stringResource(R.string.for_one_way))
            ResultLine(formatAmount(result.costBothWays), stringResource(R.string.for_both_ways))
        }
        ResultSection(stringResource(R.string.refill)) {
            when (result.refill) {
                RefillAdvice.REFILL_ON_THE_WAY -> ResultMessage(stringResource(R.string.refill_on_the_way))
                RefillAdvice.NO_REFILL -> ResultMessage(stringResource(R.string.no_refill_on_the_way))
                RefillAdvice.NEEDS_TANK_SIZE -> ResultMessage(stringResource(R.string.tank_size_required), warning = true)
            }
        }
    }
}
