package com.example.homedasher_prod

import android.content.Context
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch
import androidx.compose.runtime.*
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.navigation.NavController

@Composable
fun UserCategoryScreen(context: Context, storeType: String, navController: NavController) {
    var merchants by remember { mutableStateOf<List<Merchant>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(storeType) {
        scope.launch {
            try {
                val allMerchants = getAllMerchants(context)
                merchants = allMerchants.filter { it.storeType == storeType }
            } catch (e: Exception) {
                errorMessage = "Failed to load merchants: ${e.message}"
            } finally {
                isLoading = false
            }
        }
    }

    when {
        isLoading -> {
            Text("Loading...", modifier = Modifier.fillMaxSize())
        }
        !errorMessage.isNullOrEmpty() -> {
            Text(errorMessage ?: "Unknown error", modifier = Modifier.fillMaxSize())
        }
        else -> {
            Column(modifier = Modifier.padding(16.dp)) {
                merchants.forEach { merchant ->
                    MerchantCard(merchant) {
                        navController.navigate("userMenu/${merchant.storeName}/${merchant._id}")
                    }
                }
            }
        }
    }
}

@Composable
fun MerchantCard(merchant: Merchant, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(merchant.storeName, fontSize = 18.sp, color = Color(0xFF0D47A1))
            Text("Address: ${merchant.address}", fontSize = 14.sp)
            Text("Contact: ${merchant.phoneNumber}", fontSize = 14.sp)
        }
    }
}