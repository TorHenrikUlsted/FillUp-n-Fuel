package com.thuworkshop.fillupnfuel.ui.screens

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import androidx.core.net.toUri
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.PrivacyTip
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.Row
import com.thuworkshop.fillupnfuel.BuildConfig
import com.thuworkshop.fillupnfuel.R
import com.thuworkshop.fillupnfuel.ui.components.SwipeDirection
import com.thuworkshop.fillupnfuel.ui.components.onSwipe
import com.thuworkshop.fillupnfuel.ui.theme.AppColors

private const val REPOSITORY = "https://github.com/ThuWorks/FillUp-n-Fuel"

private data class InfoLink(val icon: ImageVector, val label: Int, val uri: String)

private val links = listOf(
    InfoLink(Icons.Filled.Code, R.string.github, REPOSITORY),
    InfoLink(Icons.Filled.Email, R.string.email, "mailto:tor.henrik@thuworks.com"),
    InfoLink(Icons.Filled.Description, R.string.license, "$REPOSITORY/blob/main/LICENSE"),
    InfoLink(Icons.Filled.PrivacyTip, R.string.privacy_policy, "$REPOSITORY/blob/main/privacyPolicy.md"),
)

/** About the app, with links. Swipe down from the top to go back. */
@Composable
fun InfoScreen(onBack: () -> Unit) {
    val scroll = rememberScrollState()
    val context = LocalContext.current
    Column(
        modifier = Modifier
            .fillMaxSize()
            .onSwipe(allowed = { if (scroll.value == 0) setOf(SwipeDirection.Down) else emptySet() }) { onBack() }
            .verticalScroll(scroll)
            .padding(horizontal = 36.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(stringResource(R.string.info_title), fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Image(painterResource(R.drawable.app_logo), contentDescription = null, modifier = Modifier.size(200.dp))
        Text(stringResource(R.string.version, BuildConfig.VERSION_NAME), modifier = Modifier.padding(bottom = 25.dp))

        InfoText(stringResource(R.string.app_description_head), stringResource(R.string.app_description_body))
        InfoText(stringResource(R.string.usage_head), stringResource(R.string.usage_body))

        Surface(color = AppColors.Sage, shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(vertical = 12.dp)) {
                links.chunked(2).forEach { row ->
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                        row.forEach { link -> LinkButton(link) { context.open(link.uri) } }
                    }
                }
            }
        }
    }
}

@Composable
private fun InfoText(head: String, body: String) {
    Text(head, fontSize = 24.sp, fontWeight = FontWeight.Bold)
    Text(body, fontSize = 16.sp, textAlign = TextAlign.Justify, modifier = Modifier.padding(bottom = 20.dp))
}

@Composable
private fun LinkButton(link: InfoLink, onClick: () -> Unit) {
    Surface(onClick = onClick, color = Color.Transparent, shape = RoundedCornerShape(12.dp), modifier = Modifier.widthIn(min = 120.dp)) {
        Column(Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(link.icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(50.dp))
            Text(stringResource(link.label), color = Color.White, fontSize = 15.sp, modifier = Modifier.padding(top = 5.dp))
        }
    }
}

private fun Context.open(uri: String) {
    try {
        startActivity(Intent(Intent.ACTION_VIEW, uri.toUri()))
    } catch (_: ActivityNotFoundException) {
        // No browser or mail app; nothing to open it with.
    }
}
