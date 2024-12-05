package com.example.homedasher_prod

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(context: Context, profileId: String) {
    val coroutineScope = rememberCoroutineScope()
    var profile by remember { mutableStateOf<Any?>(null) }

    LaunchedEffect(profileId) {
        coroutineScope.launch {
            profile = getProfile(context)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.Start
    ) {
        val currentProfile = profile
        if (currentProfile != null) {
            when (currentProfile) {
                is MerchantProfile -> ProfileSurface(currentProfile)
                is UserProfile -> ProfileSurface(currentProfile)
                else -> Text("Profile not found")
            }
        } else {
            Text("Loading...", style = MaterialTheme.typography.headlineSmall)
        }
    }
}

@Composable
fun ProfileSurface(profile: Any) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        shadowElevation = 12.dp,
        color = Color.White,
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Column(
            modifier = Modifier
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFFA5D6A7),
                            Color(0xFF81C784)
                        )
                    )
                )
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Filled.AccountCircle,
                    contentDescription = "Profile Icon",
                    modifier = Modifier
                        .size(64.dp)
                        .background(Color(0xFF388E3C), CircleShape)
                        .padding(8.dp),
                    tint = Color.White
                )

                Spacer(modifier = Modifier.width(16.dp))

                Column(
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                    horizontalAlignment = Alignment.Start
                ) {
                    when (profile) {
                        is MerchantProfile -> {
                            Text(
                                text = profile.store_name,
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color(0xFF2E7D32)
                            )
                            Text("Address: ${profile.address}", fontSize = 14.sp, color = Color(0xFF424242))
                            Text("Email: ${profile.email}", fontSize = 14.sp, color = Color(0xFF424242))
                            Text("Phone: ${profile.phone_number}", fontSize = 14.sp, color = Color(0xFF424242))
                            Text("Store Type: ${profile.store_type}", fontSize = 14.sp, color = Color(0xFF424242))
                        }
                        is UserProfile -> {
                            Text(
                                text = profile.name,
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color(0xFF2E7D32)
                            )
                            Text("Email: ${profile.email}", fontSize = 14.sp, color = Color(0xFF424242))
                        }
                    }
                }
            }
        }
    }
}