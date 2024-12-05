package com.example.homedasher_prod

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.navigation.NavController
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState


@Composable
fun MerchantMapScreen(
    apiKey: String,
    merchants: List<Merchant>,
    navController: NavController,
    userId: String
) {
    if (merchants.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        return
    }

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(LatLng(29.0044024, -81.300), 13f)
    }

    var merchantLocations by remember { mutableStateOf<List<Pair<Merchant, LatLng>>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(merchants) {
        merchantLocations = merchants.mapNotNull { merchant ->
            val coordinates = getCoordinatesUsingOkHttp(merchant.address, apiKey)
            if (coordinates != null) {
                merchant to coordinates
            } else {
                Log.e("MerchantMapScreen", "Failed to geocode address: ${merchant.address}")
                null
            }
        }
        isLoading = false
    }

    if (isLoading) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
    } else {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState
        ) {
            merchantLocations.forEach { (merchant, location) ->
                Marker(
                    state = MarkerState(position = location),
                    title = merchant.storeName,
                    snippet = merchant.address,
                    onInfoWindowClick = {
                        navController.navigate("userMenu/${merchant.storeName}/${merchant.id}/$userId")
                    }
                )
            }
        }
    }
}




