package com.thuworkshop.fillupnfuel.ui.components

import android.content.Context
import android.telephony.TelephonyManager
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.core.app.LocaleManagerCompat
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

/**
 * Formats results in the app's language, with the currency of the country the phone
 * is in: a phone in Norway shows kroner whatever language it or the app uses.
 */
class Formats private constructor(private val locale: Locale, currency: Currency?) {

    /** The symbol for price fields ("kr"); null when the phone has no region. */
    val currencySymbol: String? = currency?.getSymbol(locale)

    private val moneyFormat: NumberFormat = if (currency != null) {
        NumberFormat.getCurrencyInstance(locale).apply {
            this.currency = currency
            maximumFractionDigits = 0
            minimumFractionDigits = 0
        }
    } else {
        NumberFormat.getIntegerInstance(locale)
    }

    /** A whole amount of money, such as "kr 620". */
    fun money(value: Double): String = moneyFormat.format(value)

    /** A number with up to [maxDecimals] decimals, grouped as the language does. */
    fun number(value: Double, maxDecimals: Int = 0): String =
        NumberFormat.getNumberInstance(locale).apply {
            maximumFractionDigits = maxDecimals
        }.format(value)

    companion object {
        fun of(context: Context, appLocale: Locale): Formats {
            val region = country(context)
            val locale = runCatching { Locale.Builder().setLanguage(appLocale.language).setRegion(region).build() }
                .getOrDefault(appLocale)
            val currency = region.takeIf { it.isNotBlank() }?.let { runCatching { Currency.getInstance(locale) }.getOrNull() }
            return Formats(locale, currency)
        }
    }
}

/**
 * Where the phone is, for the currency: the mobile network's country, else the SIM's,
 * else the region of the phone's language (a tablet without SIM). Needs no permission.
 */
private fun country(context: Context): String {
    val telephony = context.getSystemService(TelephonyManager::class.java)
    return listOfNotNull(telephony?.networkCountryIso, telephony?.simCountryIso)
        .firstOrNull { it.length == 2 }
        ?.uppercase(Locale.ROOT)
        ?: LocaleManagerCompat.getSystemLocales(context)[0]?.country.orEmpty()
}

@Composable
fun rememberFormats(): Formats {
    val context = LocalContext.current
    val locale = LocalConfiguration.current.locales[0]
    return remember(locale) { Formats.of(context, locale) }
}
