package com.thuworkshop.fillupnfuel.data

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import androidx.datastore.core.DataMigration
import androidx.datastore.preferences.core.Preferences
import com.thuworkshop.fillupnfuel.core.DistanceUnit
import com.thuworkshop.fillupnfuel.core.FuelLevel
import com.thuworkshop.fillupnfuel.core.FuelUnit
import org.json.JSONArray

/**
 * Reads what the React Native (Expo) versions of the app saved: AsyncStorage's
 * SQLite database, with each value stored as JSON.
 */
internal object LegacyStorage {
    private const val DATABASE = "RKStorage"
    private const val TAG = "LegacyStorage"

    fun exists(context: Context): Boolean = context.getDatabasePath(DATABASE).exists()

    fun read(context: Context): Map<String, Any?> {
        if (!exists(context)) return emptyMap()
        return try {
            SQLiteDatabase.openDatabase(
                context.getDatabasePath(DATABASE).path, null, SQLiteDatabase.OPEN_READONLY,
            ).use { db ->
                db.rawQuery("SELECT key, value FROM catalystLocalStorage", null).use { cursor ->
                    buildMap {
                        while (cursor.moveToNext()) {
                            put(cursor.getString(0), parseJson(cursor.getString(1)))
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Could not read the old app's saved values", e)
            emptyMap()
        }
    }

    fun delete(context: Context) {
        context.deleteDatabase(DATABASE)
    }

    /**
     * Applies the language picked in the old app, once. Runs before the settings
     * migration deletes the old database; a language chosen since then wins.
     */
    fun applyLanguage(context: Context) {
        if (!exists(context) || !AppCompatDelegate.getApplicationLocales().isEmpty) return
        val tag = when (read(context)["language"]) {
            "no" -> "nb"
            "en" -> "en"
            else -> return
        }
        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(tag))
    }

    private fun parseJson(value: String?): Any? =
        value?.let { runCatching { JSONArray("[$it]").get(0) }.getOrNull() }
}

/** Moves the old app's saved values into the settings DataStore, then deletes them. */
internal class LegacyStorageMigration(private val context: Context) : DataMigration<Preferences> {
    override suspend fun shouldMigrate(currentData: Preferences): Boolean = LegacyStorage.exists(context)

    override suspend fun migrate(currentData: Preferences): Preferences {
        val old = LegacyStorage.read(context)
        if (old.isEmpty()) return currentData

        fun text(key: String): String = when (val value = old[key]) {
            is String -> value
            is Number -> value.toString()
            else -> ""
        }

        val settings = Settings(
            distanceUnit = DistanceUnit.fromKey(text("distanceUnit")),
            distance = text("distanceNumber"),
            fuelUnit = FuelUnit.fromKey(text("fuelUnit")),
            consumption = text("fuelMilage"),
            tankSize = text("tankSize"),
            fuelPrice = text("fuelPrice"),
            extraCost = text("DistanceExtra"),
            fuelLevel = legacyFuelLevel(old["currentFuelLevel"]),
        )
        return currentData.toMutablePreferences().apply { write(settings) }
    }

    override suspend fun cleanUp() {
        LegacyStorage.delete(context)
    }

    /** The old app saved the gauge as [numerator, "/", denominator]. */
    private fun legacyFuelLevel(value: Any?): FuelLevel {
        val parts = value as? JSONArray ?: return FuelLevel.HALF
        val numerator = parts.optInt(0)
        val denominator = parts.optInt(2)
        if (denominator <= 0) return FuelLevel.EMPTY
        return FuelLevel.fromStep(numerator * FuelLevel.STEPS / denominator)
    }
}
