package com.thuworkshop.fillupnfuel.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.components.PrimaryButton
import com.thuworkshop.fillupnfuel.ui.components.SwipeDirection
import com.thuworkshop.fillupnfuel.ui.components.onSwipe

/** Swipe left for distance, right for fill-up, up for info; or tap. */
@Composable
fun HomeScreen(onDistance: () -> Unit, onFillUp: () -> Unit, onInfo: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .onSwipe(allowed = { setOf(SwipeDirection.Left, SwipeDirection.Right, SwipeDirection.Up) }) {
                when (it) {
                    SwipeDirection.Left -> onDistance()
                    SwipeDirection.Right -> onFillUp()
                    else -> onInfo()
                }
            }
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp, Alignment.CenterVertically),
    ) {
        Image(
            painter = painterResource(R.drawable.app_logo),
            contentDescription = null,
            modifier = Modifier.sizeIn(maxWidth = 300.dp, maxHeight = 300.dp).fillMaxWidth(),
        )
        Text(stringResource(R.string.choose_mode), fontSize = 24.sp, fontWeight = FontWeight.Bold)
        PrimaryButton(stringResource(R.string.distance_calculator), onDistance)
        PrimaryButton(stringResource(R.string.fill_up_calculator), onFillUp)
        PrimaryButton(stringResource(R.string.info), onInfo)
    }
}
