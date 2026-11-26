package com.thuworkshop.fillupnfuel.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.MutablePreferences
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import kotlinx.coroutines.flow.first

private val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(
    name = "settings",
    produceMigrations = { context -> listOf(LegacyStorageMigration(context)) },
)

class SettingsRepository(private val dataStore: DataStore<Preferences>) {
    constructor(context: Context) : this(context.applicationContext.settingsDataStore)

    suspend fun load(): Settings = dataStore.data.first().toSettings()

    suspend fun save(settings: Settings) {
        dataStore.edit { it.write(settings) }
    }

    internal object Keys {
        val distanceUnit = stringPreferencesKey("distance_unit")
        val distance = stringPreferencesKey("distance")
        val fuelUnit = stringPreferencesKey("fuel_unit")
        val consumption = stringPreferencesKey("consumption")
        val tankSize = stringPreferencesKey("tank_size")
        val fuelPrice = stringPreferencesKey("fuel_price")
        val extraCost = stringPreferencesKey("extra_cost")
        val fuelLevel = intPreferencesKey("fuel_level_step")
    }
}

private fun Preferences.toSettings() = Settings(
    distanceUnit = DistanceUnit.fromKey(this[SettingsRepository.Keys.distanceUnit]),
    distance = this[SettingsRepository.Keys.distance].orEmpty(),
    fuelUnit = FuelUnit.fromKey(this[SettingsRepository.Keys.fuelUnit]),
    consumption = this[SettingsRepository.Keys.consumption].orEmpty(),
    tankSize = this[SettingsRepository.Keys.tankSize].orEmpty(),
    fuelPrice = this[SettingsRepository.Keys.fuelPrice].orEmpty(),
    extraCost = this[SettingsRepository.Keys.extraCost].orEmpty(),
    fuelLevel = FuelLevel.fromStep(this[SettingsRepository.Keys.fuelLevel]),
)

internal fun MutablePreferences.write(settings: Settings) {
    this[SettingsRepository.Keys.distanceUnit] = settings.distanceUnit.key
    this[SettingsRepository.Keys.distance] = settings.distance
    this[SettingsRepository.Keys.fuelUnit] = settings.fuelUnit.key
    this[SettingsRepository.Keys.consumption] = settings.consumption
    this[SettingsRepository.Keys.tankSize] = settings.tankSize
    this[SettingsRepository.Keys.fuelPrice] = settings.fuelPrice
    this[SettingsRepository.Keys.extraCost] = settings.extraCost
    this[SettingsRepository.Keys.fuelLevel] = settings.fuelLevel.step
}
