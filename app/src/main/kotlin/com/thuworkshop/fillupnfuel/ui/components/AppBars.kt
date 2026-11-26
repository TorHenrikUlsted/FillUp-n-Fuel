package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocalGasStation
import androidx.compose.material.icons.outlined.Route
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.theme.AppColors
import com.thuworkshop.fillupnfuel.ui.theme.AppText

/** Logo and name on the left, ⓘ (about and language) on the right. */
@Composable
fun AppTopBar(onInfo: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().statusBarsPadding().height(64.dp).padding(start = 20.dp, end = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Image(painterResource(R.drawable.app_logo), contentDescription = null, modifier = Modifier.size(32.dp))
        Text(stringResource(R.string.app_name), style = AppText.Title, color = AppColors.Ink, modifier = Modifier.weight(1f))
        IconButton(onClick = onInfo) {
            Icon(Icons.Outlined.Info, contentDescription = stringResource(R.string.about_and_language))
        }
    }
}

enum class Tab(val icon: ImageVector, val label: Int) {
    Trip(Icons.Outlined.Route, R.string.tab_trip),
    FillUp(Icons.Outlined.LocalGasStation, R.string.tab_fill_up),
}

/** Switches between the two calculators. */
@Composable
fun AppNavigationBar(selected: Tab, onSelect: (Tab) -> Unit) {
    Column {
        HorizontalDivider(color = AppColors.Line)
        NavigationBar(containerColor = AppColors.Surface, tonalElevation = 0.dp) {
            Tab.entries.forEach { tab ->
                val isSelected = tab == selected
                NavigationBarItem(
                    selected = isSelected,
                    onClick = { onSelect(tab) },
                    icon = { Icon(tab.icon, contentDescription = null) },
                    label = {
                        Text(
                            stringResource(tab.label),
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AppColors.OnMint,
                        selectedTextColor = AppColors.Ink,
                        indicatorColor = AppColors.Mint,
                        unselectedIconColor = AppColors.Muted,
                        unselectedTextColor = AppColors.Muted,
                    ),
                )
            }
        }
    }
}
