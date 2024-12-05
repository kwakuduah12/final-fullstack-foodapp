package com.example.homedasher_prod

import android.content.Context
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.ui.Alignment
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavController

@Composable
fun UserCategoryScreen(context: Context, storeType: String, navController: NavController, userId: String) {
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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8F9FA)) // Light gray background for professionalism
    ) {
        TopBarWithBackButton(title = "Merchants", navController = navController)

        when {
            isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            !errorMessage.isNullOrEmpty() -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = errorMessage ?: "Unknown error",
                        color = Color.Red,
                        style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold)
                    )
                }
            }
            else -> {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp) // Spacing between cards
                ) {
                    merchants.forEach { merchant ->
                        MerchantCard(merchant) {
                            navController.navigate("userMenu/${merchant.storeName}/${merchant.id}/$userId")
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBarWithBackButton(title: String, navController: NavController) {
    TopAppBar(
        title = {
            Text(
                text = title,
                style = MaterialTheme.typography.headlineSmall.copy(color = Color.White),
                modifier = Modifier.padding(start = 16.dp)
            )
        },
        navigationIcon = {
            IconButton(onClick = { navController.navigateUp() }) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        },
        colors = TopAppBarDefaults.mediumTopAppBarColors(containerColor = MaterialTheme.colorScheme.primary)
    )
}

@Composable
fun MerchantCard(merchant: Merchant, onClick: () -> Unit) {
    var averageRating by remember { mutableStateOf<Double?>(null) }
    var hasReviews by remember { mutableStateOf(false) }
    val context = LocalContext.current

    LaunchedEffect(merchant.id) {
        val reviewsResponse = getMerchantReviews(context, merchant.id)
        averageRating = reviewsResponse?.averageRating
        hasReviews = reviewsResponse?.data?.isNotEmpty() == true
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(5.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = merchant.storeName,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF212121)
                ),
                modifier = Modifier.padding(bottom = 4.dp)
            )
            Text(
                text = "Address: ${merchant.address}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray),
                modifier = Modifier.padding(bottom = 2.dp)
            )
            Text(
                text = "Contact: ${merchant.phoneNumber}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (hasReviews) {
                    // Determine star count using floor for <0.5 and ceiling for >=0.5
                    val starCount = averageRating?.let { rating ->
                        if (rating % 1 >= 0.5) Math.ceil(rating).toInt()
                        else Math.floor(rating).toInt()
                    } ?: 0

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        repeat(5) { index ->
                            val isStarFilled = index < starCount
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = if (isStarFilled) Color(0xFFFFD700) else Color.Gray,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = String.format("%.1f", averageRating ?: 0.0),
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFFFD700)
                            )
                        )
                    }
                } else {
                    Text(
                        text = "Not yet reviewed",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
                    )
                }
            }
        }
    }
}
