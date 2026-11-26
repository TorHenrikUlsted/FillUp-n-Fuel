package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelUnit

@Composable
fun fuelUnitLabel(unit: FuelUnit): String = stringResource(
    when (unit) {
        FuelUnit.LITERS_PER_100_KM -> R.string.unit_l_per_100km
        FuelUnit.MILES_PER_GALLON -> R.string.unit_mpg
    },
)

@Composable
fun distanceUnitName(unit: DistanceUnit): String = stringResource(
    when (unit) {
        DistanceUnit.KILOMETERS -> R.string.kilometers
        DistanceUnit.MILES -> R.string.miles
    },
)

/** "Fuel unit" with a toggle between L/100km and miles per gallon, in a light card. */
@Composable
fun FuelUnitPicker(selected: FuelUnit, onSelect: (FuelUnit) -> Unit, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(10.dp),
        color = Color(0xFFFAFAFA),
        border = BorderStroke(1.dp, Color(0xFFDEDEDE)),
    ) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(
                stringResource(R.string.fuel_unit),
                modifier = Modifier.weight(1f),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
            )
            UnitToggle(
                options = FuelUnit.entries.map { it to fuelUnitLabel(it) },
                selected = selected,
                onSelect = onSelect,
                modifier = Modifier.weight(1.4f),
            )
        }
    }
}

@Composable
fun DistanceUnitToggle(selected: DistanceUnit, onSelect: (DistanceUnit) -> Unit, modifier: Modifier = Modifier) {
    UnitToggle(
        options = DistanceUnit.entries.map { it to distanceUnitName(it) },
        selected = selected,
        onSelect = onSelect,
        modifier = modifier,
    )
}
