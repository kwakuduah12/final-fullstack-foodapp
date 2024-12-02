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
    val _id: String,
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
@Serializable
data class CartResponse(
    val message: String,
    val data: CartData
)

@Serializable
data class CartData(
    val _id: String,
    val user_id: String,
    val items: List<CartItem>,
    val total_price: Double,
    val created_at: String,
    val updated_at: String,
    val __v: Int
)

@Serializable
data class CartItem(
    @SerialName("menu_item_id") val menuItem: MenuItem? = null,
    val quantity: Int,
    val _id: String
)

@Serializable
data class MenuItem(
    val _id: String,
    val merchant_id: String,
    val item_name: String,
    val description: String,
    val price: Double,
    val category: String,
    val available: Boolean,
    val created_at: String,
    val updated_at: String,
    val __v: Int
)

@Serializable
data class AddToCartRequest(
    val user_id: String,
    val menu_item_id: String,
    val quantity: Int
)

@Serializable
data class LoginResponse(
    val message: String,
    val token: String
)

@Serializable
data class OrderRequest(
    val merchant_id: String,
    val items: List<OrderItem>
)

@Serializable
data class OrderItem(
    val menu_item_id: String,
    val quantity: Int
)


@Serializable
data class RemoveItemRequest(
    val menu_item_id: String
)