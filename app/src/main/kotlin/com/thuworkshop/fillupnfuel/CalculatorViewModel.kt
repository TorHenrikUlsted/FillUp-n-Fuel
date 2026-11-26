package com.thuworkshop.fillupnfuel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import com.thuworkshop.fillupnfuel.core.convert
import com.thuworkshop.fillupnfuel.core.convertDistance
import com.thuworkshop.fillupnfuel.data.Settings
import com.thuworkshop.fillupnfuel.data.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** Holds the inputs both calculators share and saves every change. Results are computed from them. */
class CalculatorViewModel(private val repository: SettingsRepository) : ViewModel() {

    /** Null until the saved settings have loaded. */
    private val _settings = MutableStateFlow<Settings?>(null)
    val settings: StateFlow<Settings?> = _settings.asStateFlow()

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
}
