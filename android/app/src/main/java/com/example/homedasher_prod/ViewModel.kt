package com.example.homedasher_prod

import android.content.Context
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.*


class MerchantViewModel : ViewModel() {
    var merchants by mutableStateOf<List<Merchant>>(emptyList())
        private set
    var isLoading by mutableStateOf(true)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set

    fun fetchMerchants(context: Context) {
        if (merchants.isNotEmpty()) return

        viewModelScope.launch {
            isLoading = true
            merchants = getAllMerchants(context)
            if (merchants.isEmpty()) {
                errorMessage = "Failed to fetch merchants."
            }
            isLoading = false
        }
    }
}
