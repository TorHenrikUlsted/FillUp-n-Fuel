package com.thuworkshop.fillupnfuel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FillUpCost
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.core.TripCost
import com.thuworkshop.fillupnfuel.core.TripInput
import com.thuworkshop.fillupnfuel.core.calculateFillUp
import com.thuworkshop.fillupnfuel.core.calculateTrip
import com.thuworkshop.fillupnfuel.core.convert
import com.thuworkshop.fillupnfuel.core.convertDistance
import com.thuworkshop.fillupnfuel.core.parseDecimal
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.data.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** Holds the inputs both calculators share, saves every change, and computes results. */
class CalculatorViewModel(private val repository: SettingsRepository) : ViewModel() {

    /** Null until the saved settings have loaded. */
    private val _settings = MutableStateFlow<Settings?>(null)
    val settings: StateFlow<Settings?> = _settings.asStateFlow()

    private val _tripCost = MutableStateFlow<TripCost?>(null)
    val tripCost: StateFlow<TripCost?> = _tripCost.asStateFlow()

    private val _fillUpCost = MutableStateFlow<FillUpCost?>(null)
    val fillUpCost: StateFlow<FillUpCost?> = _fillUpCost.asStateFlow()

    init {
        viewModelScope.launch { _settings.value = repository.load() }
    }

    fun update(transform: Settings.() -> Settings) {
        val current = _settings.value ?: return
        val next = current.transform()
        if (next == current) return
        _settings.value = next
        viewModelScope.launch { repository.save(next) }
    }

    fun setDistanceUnit(unit: DistanceUnit) = update {
        copy(distanceUnit = unit, distance = convertDistance(distance, distanceUnit, unit))
    }

    fun setFuelUnit(unit: FuelUnit) = update {
        withFuelFigures(fuelFigures.convert(fuelUnit, unit)).copy(fuelUnit = unit)
    }

    fun setFuelLevel(level: FuelLevel) = update { copy(fuelLevel = level) }

    fun calculateTrip() {
        val s = _settings.value ?: return
        _tripCost.value = calculateTrip(
            TripInput(
                distance = s.distance.number(),
                distanceUnit = s.distanceUnit,
                consumption = s.consumption.number(),
                fuelUnit = s.fuelUnit,
                fuelPrice = s.fuelPrice.number(),
                tankSize = s.tankSize.number(),
                extraCost = s.extraCost.number(),
            ),
        )
    }

    fun dismissTrip() {
        _tripCost.value = null
    }

    fun calculateFillUp() {
        val s = _settings.value ?: return
        _fillUpCost.value = calculateFillUp(s.tankSize.number(), s.fuelPrice.number(), s.fuelLevel)
    }

    fun dismissFillUp() {
        _fillUpCost.value = null
    }

    private fun String.number(): Double = parseDecimal(this) ?: 0.0
}
