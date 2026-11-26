package com.thuworkshop.fillupnfuel.ui.screens

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.PrivacyTip
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.SheetValue
import androidx.compose.material3.rememberBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.net.toUri
import androidx.core.os.LocaleListCompat
import com.thuworkshop.fillupnfuel.BuildConfig
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.theme.AppColors
import com.thuworkshop.fillupnfuel.ui.theme.SpaceGrotesk

private const val REPOSITORY = "https://github.com/ThuWorks/FillUp-n-Fuel"

/** About the app, its links, and the language choice. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InfoSheet(onDismiss: () -> Unit) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        // Opens fully; no half-open stop.
        sheetState = rememberBottomSheetState(SheetValue.Hidden, setOf(SheetValue.Hidden, SheetValue.Expanded)),
        containerColor = AppColors.Surface,
        contentColor = AppColors.Ink,
    ) {
        Column(
            modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                Image(painterResource(R.drawable.app_logo), contentDescription = null, modifier = Modifier.size(56.dp))
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(
                        stringResource(R.string.app_name),
                        fontFamily = SpaceGrotesk,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                    )
                    Text(
                        stringResource(R.string.version_line, BuildConfig.VERSION_NAME),
                        fontSize = 13.sp,
                        color = AppColors.Muted,
                    )
                }
                FilledTonalIconButton(
                    onClick = onDismiss,
                    colors = IconButtonDefaults.filledTonalIconButtonColors(containerColor = AppColors.Track, contentColor = AppColors.Ink),
                ) {
                    Icon(Icons.Filled.Close, contentDescription = stringResource(R.string.close))
                }
            }
            LanguagePicker()
            Links()
        }
    }
}

private enum class Language(val tag: String?) { Phone(null), Norwegian("nb"), English("en") }

/** Phone (follow the system), Norsk or English. */
@Composable
private fun LanguagePicker() {
    var selected by remember { mutableStateOf(currentLanguage()) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(AppColors.Track)
            .padding(4.dp)
            .selectableGroup(),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Language.entries.forEach { language ->
            val isSelected = language == selected
            Row(
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .then(if (isSelected) Modifier.shadow(1.dp, RoundedCornerShape(12.dp)) else Modifier)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isSelected) AppColors.Surface else Color.Transparent)
                    .selectable(selected = isSelected, role = Role.RadioButton) {
                        selected = language
                        AppCompatDelegate.setApplicationLocales(
                            language.tag?.let { LocaleListCompat.forLanguageTags(it) } ?: LocaleListCompat.getEmptyLocaleList(),
                        )
                    },
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                val color = if (isSelected) AppColors.Ink else AppColors.Muted
                if (language == Language.Phone) {
                    Icon(Icons.Outlined.Language, contentDescription = null, tint = color, modifier = Modifier.size(16.dp))
                }
                Text(
                    text = when (language) {
                        Language.Phone -> stringResource(R.string.language_phone)
                        Language.Norwegian -> stringResource(R.string.language_norwegian)
                        Language.English -> stringResource(R.string.language_english)
                    },
                    color = color,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(start = if (language == Language.Phone) 6.dp else 0.dp),
                )
            }
        }
    }
}

private fun currentLanguage(): Language {
    val locales = AppCompatDelegate.getApplicationLocales()
    if (locales.isEmpty) return Language.Phone
    return when (locales[0]?.language) {
        "nb", "no", "nn" -> Language.Norwegian
        else -> Language.English
    }
}

private data class Link(val icon: ImageVector, val label: Int, val uri: String)

private val links = listOf(
    Link(Icons.Outlined.Code, R.string.github, REPOSITORY),
    Link(Icons.Outlined.Email, R.string.email, "mailto:tor.henrik@thuworks.com"),
    Link(Icons.Outlined.Description, R.string.license, "$REPOSITORY/blob/main/LICENSE"),
    Link(Icons.Outlined.PrivacyTip, R.string.privacy, "$REPOSITORY/blob/main/privacyPolicy.md"),
)

@Composable
private fun Links() {
    val context = LocalContext.current
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        links.forEach { link ->
            Surface(
                onClick = { context.open(link.uri) },
                shape = RoundedCornerShape(16.dp),
                color = AppColors.Surface,
                modifier = Modifier.weight(1f).height(76.dp),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterVertically),
                ) {
                    Icon(link.icon, contentDescription = null, modifier = Modifier.size(24.dp))
                    Text(stringResource(link.label), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

private fun Context.open(uri: String) {
    try {
        startActivity(Intent(Intent.ACTION_VIEW, uri.toUri()))
    } catch (_: ActivityNotFoundException) {
        // No browser or mail app to open it with.
    }
}
