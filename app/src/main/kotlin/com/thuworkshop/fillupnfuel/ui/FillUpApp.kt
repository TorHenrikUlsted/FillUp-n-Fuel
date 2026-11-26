package com.thuworkshop.fillupnfuel.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.Crossfade
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.isImeVisible
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.thuworkshop.fillupnfuel.CalculatorViewModel
import com.thuworkshop.fillupnfuel.data.SettingsRepository
import com.thuworkshop.fillupnfuel.ui.components.AppNavigationBar
import com.thuworkshop.fillupnfuel.ui.components.AppTopBar
import com.thuworkshop.fillupnfuel.ui.components.Tab
import com.thuworkshop.fillupnfuel.ui.screens.FillUpScreen
import com.thuworkshop.fillupnfuel.ui.screens.InfoSheet
import com.thuworkshop.fillupnfuel.ui.screens.TripScreen
import com.thuworkshop.fillupnfuel.ui.theme.AppColors

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FillUpApp() {
    val context = LocalContext.current
    val viewModel: CalculatorViewModel = viewModel { CalculatorViewModel(SettingsRepository(context)) }
    val settings by viewModel.settings.collectAsStateWithLifecycle()

    var tab by rememberSaveable { mutableStateOf(Tab.Trip) }
    var showInfo by rememberSaveable { mutableStateOf(false) }

    // Back from Fill up goes to Trip, as with any bottom navigation.
    BackHandler(enabled = tab != Tab.Trip) { tab = Tab.Trip }

    Scaffold(
        containerColor = AppColors.Ground,
        topBar = { AppTopBar(onInfo = { showInfo = true }) },
        bottomBar = {
            // Hidden while typing so the fields keep the room.
            AnimatedVisibility(!WindowInsets.isImeVisible, enter = expandVertically(), exit = shrinkVertically()) {
                AppNavigationBar(selected = tab, onSelect = { tab = it })
            }
        },
    ) { padding ->
        val current = settings ?: return@Scaffold
        Crossfade(
            targetState = tab,
            modifier = Modifier.fillMaxSize().padding(padding).consumeWindowInsets(padding).imePadding(),
            label = "tab",
        ) { shown ->
            when (shown) {
                Tab.Trip -> TripScreen(
                    settings = current,
                    onChange = viewModel::update,
                    onDistanceUnit = viewModel::setDistanceUnit,
                    onFuelUnit = viewModel::setFuelUnit,
                )
                Tab.FillUp -> FillUpScreen(
                    settings = current,
                    onChange = viewModel::update,
                    onFuelUnit = viewModel::setFuelUnit,
                    onFuelLevel = viewModel::setFuelLevel,
                )
            }
        }
    }

    if (showInfo) InfoSheet(onDismiss = { showInfo = false })
}

