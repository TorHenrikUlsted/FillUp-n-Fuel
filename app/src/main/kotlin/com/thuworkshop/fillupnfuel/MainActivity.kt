package com.thuworkshop.fillupnfuel

import android.graphics.Color
import android.os.Bundle
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.thuworkshop.fillupnfuel.data.LegacyStorage
import com.thuworkshop.fillupnfuel.ui.FillUpApp
import com.thuworkshop.fillupnfuel.ui.theme.FillUpTheme

// AppCompatActivity (not ComponentActivity) so the in-app language switch works on every Android version.
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
        )
        super.onCreate(savedInstanceState)
        // After super.onCreate: on Android 13+ AppCompat reaches the system language setting through this activity.
        LegacyStorage.applyLanguage(this)
        setContent {
            FillUpTheme {
                FillUpApp()
            }
        }
    }
}
