package com.thuworkshop.fillupnfuel.ui.components

import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.os.LocaleListCompat
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.theme.AppColors

/** The bar above every screen, with the language switch on the right. */
@Composable
fun Header() {
    Column(Modifier.background(Color.White).statusBarsPadding()) {
        Row(
            modifier = Modifier.fillMaxWidth().height(50.dp).padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            LanguageSelector()
        }
        HorizontalDivider(color = AppColors.Divider)
    }
}

@Composable
private fun LanguageSelector() {
    val current = LocalConfiguration.current.locales[0].language
    val norwegian = current == "nb" || current == "no" || current == "nn"
    Row {
        LanguageChip(stringResource(R.string.language_norwegian), selected = norwegian, tag = "nb")
        LanguageChip(stringResource(R.string.language_english), selected = !norwegian, tag = "en")
    }
}

@Composable
private fun LanguageChip(label: String, selected: Boolean, tag: String) {
    val content = if (selected) Color.White else Color(0xFF666666)
    Surface(
        onClick = { AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(tag)) },
        shape = RoundedCornerShape(8.dp),
        color = if (selected) AppColors.Sage else Color.Transparent,
        modifier = Modifier.padding(horizontal = 5.dp),
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(Icons.Filled.Flag, contentDescription = null, tint = content, modifier = Modifier.size(20.dp))
            Text(label, color = content, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
    }
}
