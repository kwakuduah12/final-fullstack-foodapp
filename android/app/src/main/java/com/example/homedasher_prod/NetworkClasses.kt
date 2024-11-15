package com.example.homedasher_prod

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json


object HttpClientProvider {
    val instance: HttpClient by lazy {
        HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
    }
}

val client = HttpClientProvider.instance

@Serializable
data class LoginRequest(val email: String, val password: String)

@Serializable
data class RegisterRequest(val email: String, val name: String, val password: String, val confirmPassword: String)

@Serializable
data class MerchantRegisterRequest(
    val email: String,
    val store_name: String,
    val address: String,
    val phone_number: String,
    val store_type: String,
    val password: String,
    val confirmPassword: String
)

@Serializable
data class MerchantResponse(
    val message: String,
    val data: List<Merchant>
)

@Serializable
data class Merchant(
    val _id: String,
    @SerialName("store_name") val storeName: String = "",
    val address: String,
    val email: String,
    @SerialName("phone_number") val phoneNumber: String = "",
    @SerialName("store_type") val storeType: String = "",
    val created_at: String,
    val updated_at: String
)

@Serializable
data class MerchantMenuItem(
    @SerialName("merchant_id") val merchantId: String,
    @SerialName("item_name") val itemName: String,
    val description: String? = null,
    val price: Double,
    val category: String,
    val available: Boolean,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("__v") val version: Int
)

@Serializable
data class MenuResponse(
    val data: List<MerchantMenuItem>
)

data class Cart(
    val user_id: String,
    val items: List<CartItem>,
    val total_price: Double = 0.0,
    val created_at: String = "",
    val updated_at: String = ""
)

data class CartItem(
    val menu_item_id: String,
    val quantity: Int = 1
)


@Serializable
data class LoginResponse(
    val message: String,
    val token: String
)
