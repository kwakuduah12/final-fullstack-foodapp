package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.*

class MerchantViewModel : ViewModel() {
    // State variables
    var merchants by mutableStateOf<List<Merchant>>(emptyList())
        private set
    var categories by mutableStateOf<List<String>>(emptyList())
        private set
    var isLoading by mutableStateOf(false)
        private set
    var promotions by mutableStateOf<List<CommonPromotion>>(emptyList()) // Cache promotions
        private set
    var merchantMap by mutableStateOf<Map<String, String>>(emptyMap()) // Cache merchantId -> storeName map
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set
    var merchantOrders by mutableStateOf<List<TransactionRecord>>(emptyList())
        private set
    var mostOrderedFoods by mutableStateOf<List<MostOrderedFood>>(emptyList())
        private set

    fun fetchMerchants(context: Context) {
        if (merchants.isNotEmpty()) return // Skip if already fetched

        viewModelScope.launch {
            isLoading = true
            try {
                merchants = getAllMerchants(context)
                if (merchants.isEmpty()) {
                    errorMessage = "No merchants available."
                } else {
                    categories = merchants.map { it.storeType }.distinct()
                }
            } catch (e: Exception) {
                errorMessage = e.message ?: "Failed to fetch merchants."
            } finally {
                isLoading = false
            }
        }
    }

    fun fetchMerchantOrders(context: Context) {
        if (merchantOrders.isNotEmpty()) return // Skip if already fetched

        viewModelScope.launch {
            isLoading = true
            try {
                val orders: List<TransactionRecord> = getMerchantOrders(context)
                if (orders.isEmpty()) {
                    errorMessage = "No orders found for this merchant."
                } else {
                    merchantOrders = orders
                }
            } catch (e: Exception) {
                errorMessage = e.message ?: "Failed to fetch merchant orders."
            } finally {
                isLoading = false
            }
        }
    }

    fun loadMostOrderedFoods(context: Context) {
        if (mostOrderedFoods.isNotEmpty()) return // Skip if already fetched

        viewModelScope.launch {
            isLoading = true
            try {
                val foods = fetchMostOrderedFoods(context) // Call the suspend function from the network file
                Log.d("MerchantViewModel", "Fetched foods: $foods")  // log fetched foods
                if (foods.isEmpty()) {
                    errorMessage = "No best sellers found."
                } else {
                    // Ensure storeName and merchantId are handled properly
                    mostOrderedFoods = foods.map { food ->
                        food.copy(storeName = food.storeName, merchantId = food.merchantId)
                    }
                }
            } catch (e: Exception) {
                errorMessage = e.message ?: "Failed to fetch most ordered items."
            } finally {
                isLoading = false
            }
        }
    }
    fun fetchPromotions(context: Context, merchantId: String?) {
        if (promotions.isNotEmpty()) return // Skip if already fetched

        viewModelScope.launch {
            isLoading = true
            try {
                promotions = if (merchantId != null) {
                    getMerchantPromotions(context, merchantId).map { it.toCommonPromotion() }
                } else {
                    getAllAvailablePromotions(context).map { it.toCommonPromotion() }
                }
            } catch (e: Exception) {
                errorMessage = e.message ?: "Failed to fetch promotions."
            } finally {
                isLoading = false
            }
        }
    }
}
