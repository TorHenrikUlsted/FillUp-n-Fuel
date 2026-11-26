package com.thuworkshop.fillupnfuel.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.isImeVisible
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.thuworkshop.fillupnfuel.CalculatorViewModel
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.data.SettingsRepository
import com.thuworkshop.fillupnfuel.ui.components.BackBar
import com.thuworkshop.fillupnfuel.ui.components.Header
import com.thuworkshop.fillupnfuel.ui.screens.DistanceScreen
import com.thuworkshop.fillupnfuel.ui.screens.FillUpScreen
import com.thuworkshop.fillupnfuel.ui.screens.HomeScreen
import com.thuworkshop.fillupnfuel.ui.screens.InfoScreen

private object Routes {
    const val HOME = "home"
    const val DISTANCE = "distance"
    const val FILL_UP = "fill_up"
    const val INFO = "info"
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FillUpApp() {
    val context = LocalContext.current
    val viewModel: CalculatorViewModel = viewModel { CalculatorViewModel(SettingsRepository(context)) }
    val settings by viewModel.settings.collectAsStateWithLifecycle()
    val tripCost by viewModel.tripCost.collectAsStateWithLifecycle()
    val fillUpCost by viewModel.fillUpCost.collectAsStateWithLifecycle()

    val nav = rememberNavController()
    val entry by nav.currentBackStackEntryAsState()
    val onHome = entry?.destination?.route.let { it == null || it == Routes.HOME }
    val goHome = { nav.popBackStack(Routes.HOME, inclusive = false); Unit }

    Scaffold(
        containerColor = Color.White,
        topBar = { Header() },
        bottomBar = {
            AnimatedVisibility(
                visible = !onHome && !WindowInsets.isImeVisible,
                enter = slideInVertically { it },
                exit = slideOutVertically { it },
            ) {
                BackBar(stringResource(R.string.back), goHome)
            }
        },
    ) { padding ->
        NavHost(
            navController = nav,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(padding).consumeWindowInsets(padding).imePadding(),
        ) {
            composable(
                Routes.HOME,
                exitTransition = { ExitTransition.KeepUntilTransitionsFinished },
                popEnterTransition = { EnterTransition.None },
            ) {
                HomeScreen(
                    onDistance = { nav.openFromHome(Routes.DISTANCE) },
                    onFillUp = { nav.openFromHome(Routes.FILL_UP) },
                    onInfo = { nav.openFromHome(Routes.INFO) },
                )
            }
            composable(
                Routes.DISTANCE,
                enterTransition = { slideInHorizontally { it } },
                popExitTransition = { slideOutHorizontally { it } },
            ) {
                settings?.let {
                    DistanceScreen(
                        settings = it,
                        result = tripCost,
                        onChange = viewModel::update,
                        onDistanceUnit = viewModel::setDistanceUnit,
                        onFuelUnit = viewModel::setFuelUnit,
                        onCalculate = viewModel::calculateTrip,
                        onDismissResult = viewModel::dismissTrip,
                        onBack = goHome,
                    )
                }
            }
            composable(
                Routes.FILL_UP,
                enterTransition = { slideInHorizontally { -it } },
                popExitTransition = { slideOutHorizontally { -it } },
            ) {
                settings?.let {
                    FillUpScreen(
                        settings = it,
                        result = fillUpCost,
                        onChange = viewModel::update,
                        onFuelUnit = viewModel::setFuelUnit,
                        onFuelLevel = viewModel::setFuelLevel,
                        onCalculate = viewModel::calculateFillUp,
                        onDismissResult = viewModel::dismissFillUp,
                        onBack = goHome,
                    )
                }
            }
            composable(
                Routes.INFO,
                enterTransition = { slideInVertically { it } },
                popExitTransition = { slideOutVertically { it } },
            ) {
                InfoScreen(onBack = goHome)
            }
        }
    }
}

/** Opens a screen only from Home, so a double tap or swipe can't stack two screens. */
private fun NavHostController.openFromHome(route: String) {
    if (currentDestination?.route == Routes.HOME) navigate(route)
}
