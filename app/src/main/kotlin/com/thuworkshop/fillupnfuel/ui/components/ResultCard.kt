package com.thuworkshop.fillupnfuel.ui.components

import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.FlowRowScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.thuworkshop.fillupnfuel.ui.theme.AppColors
import com.thuworkshop.fillupnfuel.ui.theme.AppText

/** The result at the top of a calculator: a label, one big amount, and chips with the rest. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ResultCard(label: String, value: String, chips: @Composable FlowRowScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(AppColors.Forest)
            .padding(start = 20.dp, end = 20.dp, top = 20.dp, bottom = 18.dp)
            .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Text(label, style = AppText.Chip, color = AppColors.OnForestMuted)
        Text(value, style = AppText.Display, color = Color.White, maxLines = 1)
        FlowRow(
            modifier = Modifier.padding(top = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            content = chips,
        )
    }
}

/** A small fact on the result card; [attention] makes it yellow. */
@Composable
fun ResultChip(icon: ImageVector, text: String, attention: Boolean = false) {
    val background = if (attention) AppColors.Sun else AppColors.ForestChip
    val content = if (attention) AppColors.OnSun else Color.White
    Row(
        modifier = Modifier.height(32.dp).clip(RoundedCornerShape(16.dp)).background(background).padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(icon, contentDescription = null, tint = content, modifier = Modifier.size(16.dp))
        Text(
            text,
            style = AppText.Chip,
            color = content,
            fontWeight = if (attention) FontWeight.SemiBold else FontWeight.Medium,
        )
    }
}
