package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.navigation.NavHostController
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString

fun loginUser(email: String, password: String, role: String, context: Context, navController: NavHostController) {
    val request = LoginRequest(email, password)
    val endpoint = if (role == "Merchant") "merchant/login" else "user/login"

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val response: HttpResponse = client.post("http://10.0.2.2:4000/$endpoint") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }

            withContext(Dispatchers.Main) {
                if (response.status == HttpStatusCode.OK) {
                    val json = Json { ignoreUnknownKeys = true }
                    val loginResponse = json.decodeFromString<LoginResponse>(response.bodyAsText())
                    val jwt = loginResponse.token

                    jwt?.let {
                        saveJwtSecurely(it, role, context)
                        val homeDestination = if (role == "Merchant") "merchantHomeScreen" else "home"
                        Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                        navController.navigate(homeDestination) {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                } else {
                    Toast.makeText(context, "Login failed: ${response.status.description}", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

fun registerUser(email: String, name: String, password: String, confirmPassword: String, context: Context) {
    val request = RegisterRequest(email, name, password, confirmPassword)

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val response: HttpResponse = client.post("http://10.0.2.2:4000/user/signup") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }

            withContext(Dispatchers.Main) {
                if (response.status == HttpStatusCode.OK) {
                    Toast.makeText(context, "Registration successful!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Registration failed: ${response.status.description}", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

fun registerMerchant(
    email: String,
    store_name: String,
    address: String,
    phone_number: String,
    store_type: String,
    password: String,
    confirmPassword: String,
    context: Context
) {
    val request = MerchantRegisterRequest(email, store_name, address, phone_number, store_type, password, confirmPassword)

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val response: HttpResponse = client.post("http://10.0.2.2:4000/merchant/signup") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            withContext(Dispatchers.Main) {
                if (response.status == HttpStatusCode.OK) {
                    Toast.makeText(context, "Merchant registration successful!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Registration failed: ${response.status.description}", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

suspend fun getMenuItems(context: Context, merchantId: String): List<MerchantMenuItem> {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/menu/merchant/$merchantId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json {
                ignoreUnknownKeys = true
                isLenient = true
            }
            val menuResponse = json.decodeFromString<MenuResponse>(jsonResponse)
            menuResponse.data
        } else {
            emptyList()
        }
    } catch (e: Exception) {
        emptyList()
    } finally {
        client.close()
    }
}

suspend fun getAllMerchants(context: Context): List<Merchant> {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/merchant/all-merchants") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json { ignoreUnknownKeys = true }
            val merchantResponse = json.decodeFromString<MerchantResponse>(jsonResponse)
            merchantResponse.data
        } else {
            emptyList()
        }
    } catch (e: Exception) {
        emptyList()
    } finally {
        client.close()
    }
}

suspend fun getCart(context: Context, userId: String): CartData? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/cart/$userId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            Log.d("getCart", "Response received: $jsonResponse")
            val json = Json {
                ignoreUnknownKeys = true
                isLenient = true
            }
            val cartResponse = json.decodeFromString<CartResponse>(jsonResponse)
            cartResponse.data
        } else {
            Log.e("getCart", "Failed to fetch cart. Status: ${response.status}")
            null
        }
    } catch (e: Exception) {
        Log.e("getCart", "Error fetching cart", e)
        null
    } finally {
        client.close()
        Log.d("getCart", "HTTP client closed")
    }
}

suspend fun postToCart(context: Context, userId: String, menuItemId: String, quantity: Int): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val requestBody = json.encodeToString(AddToCartRequest(user_id = userId, menu_item_id = menuItemId, quantity = quantity))

        val response: HttpResponse = client.post("http://10.0.2.2:4000/cart/add") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(requestBody)
        }

        response.status == HttpStatusCode.OK
    } catch (e: Exception) {
        false
    } finally {
        client.close()
    }
}

suspend fun placeOrder(context: Context, merchantId: String, cartData: CartData): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val items = cartData.items.map { OrderItem(menu_item_id = it.menuItem?._id ?: "", quantity = it.quantity) }
        val requestBody = json.encodeToString(OrderRequest(merchant_id = merchantId, items = items))

        val response: HttpResponse = client.post("http://10.0.2.2:4000/order/create") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(requestBody)
        }

        response.status == HttpStatusCode.Created
    } catch (e: Exception) {
        false
    } finally {
        client.close()
    }
}

suspend fun deleteCartItem(context: Context, userId: String, cartItem: CartItem): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val menuItemId = cartItem.menuItem?._id ?: return false
        val requestBody = json.encodeToString(RemoveItemRequest(menu_item_id = menuItemId))

        val response: HttpResponse = client.delete("http://10.0.2.2:4000/cart/remove") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(requestBody)
        }

        response.status == HttpStatusCode.OK
    } catch (e: Exception) {
        false
    } finally {
        client.close()
    }
}