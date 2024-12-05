package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.navigation.NavHostController
import com.google.android.gms.maps.model.LatLng
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.decodeFromJsonElement


val json = Json {
    ignoreUnknownKeys = true
    isLenient = true
}


fun loginUser(email: String, password: String, role: String, context: Context, navController: NavHostController) {
    val request = LoginRequest(email, password)
    val endpoint = if (role == "Merchant") "merchant/login" else "user/login"
    val merchantId = getIdFromJwt(context)

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
                        val homeDestination = if (role == "Merchant") "merchantHomeScreen/$merchantId" else "home"
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
            Log.d("getMenuItems", "Menu Response: $menuResponse")
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

suspend fun getCart(context: Context, userId: String?): CartData? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        Log.d("getCart", "JWT: $jwt, UserID: $userId")

        val response: HttpResponse = client.get("http://10.0.2.2:4000/cart/${userId ?: ""}") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        Log.d("getCart", "Response: ${response.bodyAsText()}")

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json {
                ignoreUnknownKeys = true
                isLenient = true
            }
            val cartResponse = json.decodeFromString<CartResponse>(jsonResponse)
            Log.d("getCart", "Parsed Cart: $cartResponse")
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

        val items = cartData.items.mapNotNull { cartItem ->
            cartItem.menuItem?.let { menuItem ->
                OrderItem(menu_item_id = menuItem.id, quantity = cartItem.quantity, price = menuItem.price)
            }
        }

        if (items.isEmpty()) {
            Log.e("placeOrder", "No valid items in cart to place order")
            return false
        }

        // Encode order request
        val requestBody = Json.encodeToString(OrderRequest(merchant_id = merchantId, items = items))
        val response: HttpResponse = client.post("http://10.0.2.2:4000/order/create") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(requestBody)
        }

        if (response.status == HttpStatusCode.Created) {
            val jsonResponse = response.bodyAsText()
            Log.d("placeOrder", "Order created successfully: $jsonResponse")

            val orderResponse = json.decodeFromString<OrderResponse>(jsonResponse)
            val order = orderResponse.data

            // Process payment
            val paymentStatus = makePayment(context, order.id, cartData.user_id, merchantId, order.totalPrice)
            if (paymentStatus != "Completed") {
                Log.e("placeOrder", "Payment failed for order: ${order.id}")
                return false
            }

            // Clear cart after successful payment
            val cartCleared = clearCart(context)
            if (!cartCleared) {
                Log.e("placeOrder", "Failed to clear cart after order placement")
            }

            return true
        } else {
            Log.e("placeOrder", "Failed to place order: ${response.status.description}")
            return false
        }
    } catch (e: Exception) {
        Log.e("placeOrder", "Error placing order: ${e.message}", e)
        return false
    } finally {
        client.close()
    }
}



suspend fun updateCartStatus(context: Context, userId: String, onUpdate: (Boolean) -> Unit) {
    try {
        val cart = getCart(context, userId)
        onUpdate(cart?.items?.isNotEmpty() == true)
    } catch (e: Exception) {
        onUpdate(false)
    }
}


suspend fun clearCart(context: Context): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.delete("http://10.0.2.2:4000/cart/clear") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            Log.d("clearCart", "Cart cleared successfully")
            true
        } else {
            Log.e("clearCart", "Failed to clear cart: ${response.status.description}")
            false
        }
    } catch (e: Exception) {
        Log.e("clearCart", "Error clearing cart: ${e.message}", e)
        false
    } finally {
        client.close()
    }
}


suspend fun deleteCartItem(context: Context, menuItemId: String): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val requestBody = RemoveItemRequest(menu_item_id = menuItemId) // Use the data class

        val response: HttpResponse = client.delete("http://10.0.2.2:4000/cart/remove") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(Json.encodeToString(requestBody)) // Serialize the data class to JSON
        }

        if (response.status == HttpStatusCode.OK) {
            Log.d("deleteCartItem", "Item removed successfully")
            true
        } else {
            Log.e("deleteCartItem", "Failed to remove item: ${response.status.description}")
            false
        }
    } catch (e: Exception) {
        Log.e("deleteCartItem", "Error during delete operation: ${e.message}", e)
        false
    } finally {
        client.close()
    }
}


suspend fun getProfile(context: Context): Any? {
    val client = provideHttpClient(context)
    val role = getStoredRole(context) ?: return null
    val endpoint = if (role == "Merchant") "merchant/profile" else "user/profile"

    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/$endpoint") {
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
            val profileData = json.decodeFromString<ProfileResponse>(jsonResponse)

            if (role == "Merchant") {
                json.decodeFromJsonElement<MerchantProfile>(profileData.data)
            } else {
                json.decodeFromJsonElement<UserProfile>(profileData.data)
            }
        } else {
            null
        }
    } catch (e: Exception) {
        Log.e("getProfile", "Error fetching profile", e)
        null
    } finally {
        client.close()
    }
}

suspend fun deleteMenuItem(context: Context, menuItemId: String): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.delete("http://10.0.2.2:4000/menu/$menuItemId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        response.status == HttpStatusCode.OK
    } catch (e: Exception) {
        Log.e("deleteMenuItem", "Error deleting menu item: ${e.message}", e)
        false
    } finally {
        client.close()
    }
}

suspend fun createMenuItem(
    context: Context,
    itemName: String,
    description: String,
    price: Double,
    category: String,
    available: Boolean
): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val requestBody = CreateMenuItemRequest(
            item_name = itemName,
            description = description,
            price = price,
            category = category,
            available = available
        )

        val response: HttpResponse = client.post("http://10.0.2.2:4000/menu/create") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(Json.encodeToString(requestBody)) // Serialize the data class
        }

        response.status == HttpStatusCode.Created
    } catch (e: Exception) {
        Log.e("createMenuItem", "Error creating menu item: ${e.message}", e)
        false
    } finally {
        client.close()
    }
}

suspend fun updateMenuItem(
    context: Context,
    menuItemId: String,
    request: UpdateMenuItemRequest
): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val requestBody = json.encodeToString(request)

        val response: HttpResponse = client.put("http://10.0.2.2:4000/menu/$menuItemId") {
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
        Log.e("updateMenuItem", "Error updating menu item: ${e.message}")
        false
    } finally {
        client.close()
    }
}

suspend fun getMerchantOrders(context: Context): List<TransactionRecord> {
    val client = HttpClientProvider.instance
    return try {
        Log.d("getMerchantOrders", "Starting function")
        val jwt = getStoredJwt(context)
        Log.d("getMerchantOrders", "JWT: $jwt")

        val response: HttpResponse = client.get("http://10.0.2.2:4000/order/merchant-orders") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }
        Log.d("getMerchantOrders", "HTTP Status: ${response.status}")

        val jsonResponse = response.bodyAsText()
        Log.d("getMerchantOrders", "Raw Response: $jsonResponse")

        if (response.status == HttpStatusCode.OK) {
            val ordersPayload = json.decodeFromString<OrderResponsePayload>(jsonResponse)
            Log.d("getMerchantOrders", "Decoded Orders: ${ordersPayload.ordersList}")
            ordersPayload.ordersList // Extract and return the orders list
        } else {
            Log.d("getMerchantOrders", "Empty list returned")
            emptyList()
        }
    } catch (e: Exception) {
        Log.e("getMerchantOrders", "Error: ${e.message}")
        emptyList()
    }
}





suspend fun getRecentUserOrders(context: Context, userId: String): List<UserOrder>? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        Log.d("getRecentUserOrders", "JWT Token: $jwt")

        val response: HttpResponse = client.get("http://10.0.2.2:4000/order/user-orders/$userId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
        }

        Log.d("getRecentUserOrders", "Response: ${response.bodyAsText()}")

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json { ignoreUnknownKeys = true }
            val ordersResponse = json.decodeFromString<UserOrderResponse>(jsonResponse)
            ordersResponse.data // Return the list of orders
        } else {
            Log.d("getRecentUserOrders", "No orders found. Status: ${response.status}")
            null
        }
    } catch (e: Exception) {
        Log.e("getRecentUserOrders", "Error fetching user orders", e)
        null
    } finally {
        client.close()
    }
}



suspend fun getCoordinatesUsingOkHttp(address: String, apiKey: String): LatLng? {
    return withContext(Dispatchers.IO) {
        val client = OkHttpClient()
        val encodedAddress = java.net.URLEncoder.encode(address, "UTF-8")
        val url = "https://maps.googleapis.com/maps/api/geocode/json?address=$encodedAddress&key=$apiKey"

        val request = Request.Builder()
            .url(url)
            .build()

        try {
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
            Log.d("Geocoding", "Response: $responseBody") // Log the full response

            if (response.isSuccessful && responseBody != null) {
                val json = JSONObject(responseBody)
                when (json.getString("status")) {
                    "OK" -> {
                        val location = json
                            .getJSONArray("results")
                            .getJSONObject(0)
                            .getJSONObject("geometry")
                            .getJSONObject("location")
                        val lat = location.getDouble("lat")
                        val lng = location.getDouble("lng")
                        LatLng(lat, lng)
                    }
                    "ZERO_RESULTS" -> {
                        Log.e("Geocoding", "No results for address: $address")
                        null
                    }
                    "REQUEST_DENIED" -> {
                        Log.e("Geocoding", "Request denied: ${json.getString("error_message")}")
                        null
                    }
                    "INVALID_REQUEST" -> {
                        Log.e("Geocoding", "Invalid request: $address")
                        null
                    }
                    else -> {
                        Log.e("Geocoding", "Unexpected status: ${json.getString("status")}")
                        null
                    }
                }
            } else {
                Log.e("Geocoding", "Failed response: ${response.code}")
                null
            }
        } catch (e: Exception) {
            Log.e("Geocoding", "Error fetching location: ${e.message}", e)
            null
        }
    }
}

suspend fun makePayment(
    context: Context,
    orderId: String,
    userId: String,
    merchantId: String,
    amount: Double
): String {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        Log.d("makePayment", "Sending amount to backend: $amount") // Debug the value here
        val paymentRequest = PaymentRequest(orderId = orderId, userId = userId, merchantId = merchantId, amount = amount)

        val requestBody = json.encodeToString(paymentRequest)

        val response: HttpResponse = client.post("http://10.0.2.2:4000/payment/purchase") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
            setBody(requestBody)
        }

        val jsonResponse = response.bodyAsText()
        if (response.status == HttpStatusCode.OK || response.status == HttpStatusCode.Created) {
            val paymentResponse = json.decodeFromString<PaymentResponse>(jsonResponse)
            paymentResponse.paymentStatus
        } else {
            Log.e("makePayment", "Payment failed with status: ${response.status.description}")
            "Failed"
        }
    } catch (e: Exception) {
        Log.e("makePayment", "Error making payment: ${e.message}", e)
        "Failed"
    } finally {
        client.close()
    }
}



suspend fun getBalance(context: Context): Double? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context) // Retrieve the JWT for authorization
        val response: HttpResponse = client.get("http://10.0.2.2:4000/user/balance") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val balanceResponse = json.decodeFromString<UserBalanceResponse>(jsonResponse)
            balanceResponse.balance
        } else {
            null // Return null if the status is not OK
        }
    } catch (e: Exception) {
        e.printStackTrace()
        null // Return null in case of an error
    } finally {
        client.close() // Close the HTTP client
    }
}

suspend fun topUpBalance(context: Context, amount: Double): Boolean {
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.post("http://10.0.2.2:4000/payment/top-up") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(mapOf("amount" to amount))
        }
        response.status == HttpStatusCode.OK
    } catch (e: Exception) {
        Log.e("TopUpBalance", "Error during top-up: ${e.message}")
        false
    }
}

suspend fun deductBalance(context: Context, amount: Double): Boolean {
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.post("http://10.0.2.2:4000/payment/deduct-balance") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
            }
            setBody(mapOf("amount" to amount))
        }
        response.status == HttpStatusCode.OK
    } catch (e: Exception) {
        Log.e("DeductBalance", "Error deducting balance: ${e.message}")
        false
    }
}

suspend fun getUserById(context: Context, userId: String): UserProfile {
    val client = provideHttpClient(context)
    return client.get("http://10.0.2.2:4000/user/$userId").body()
}

suspend fun getMenuItemById(context: Context, menuItemId: String): MenuItem? {
    val client = provideHttpClient(context)
    return try {
        client.get("http://10.0.2.2:4000/menu/$menuItemId").body()
    } catch (e: Exception) {
        Log.e("getMenuItemById", "Error fetching menu item: ${e.message}")
        null
    }
}


suspend fun fetchMostOrderedFoods(context: Context): List<MostOrderedFood> {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context) // Fetch the stored JWT for authentication.
        val response: HttpResponse = client.get("http://10.0.2.2:4000/order/most-ordered") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json { ignoreUnknownKeys = true }
            val mostOrderedFoodsResponse = json.decodeFromString<MostOrderedFoodsResponse>(jsonResponse)
            mostOrderedFoodsResponse.data // Return the list of most ordered foods
        } else {
            Log.e("fetchMostOrderedFoods", "Failed with status: ${response.status}")
            emptyList()
        }
    } catch (e: Exception) {
        Log.e("fetchMostOrderedFoods", "Error fetching most ordered foods: ${e.message}")
        emptyList()
    } finally {
        client.close()
    }
}


suspend fun createPromotion(
    context: Context,
    promotionName: String,
    description: String,
    discount: Double,
    startDate: String,
    endDate: String,
    menuItems: List<String> // List of menu item IDs
): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context) // Retrieve the JWT for authorization
        val requestBody = CreatePromotionRequest(
            promotionName = promotionName,
            description = description,
            discount = discount,
            startDate = startDate,
            endDate = endDate,
            menuItems = menuItems
        )

        val response: HttpResponse = client.post("http://10.0.2.2:4000/promotion/create") { // Adjusted endpoint
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") } // Add authorization header
            }
            setBody(Json.encodeToString(requestBody)) // Serialize the data class to JSON
        }

        if (response.status == HttpStatusCode.Created) {
            Log.d("createPromotion", "Promotion created successfully")
            true
        } else {
            Log.e("createPromotion", "Failed to create promotion. Status: ${response.status.description}")
            false
        }
    } catch (e: Exception) {
        Log.e("createPromotion", "Error creating promotion: ${e.message}", e)
        false
    } finally {
        client.close()
    }
}

suspend fun getAllAvailablePromotions(context: Context): List<Promotion> {
    val client = HttpClientProvider.instance

    return withContext(Dispatchers.IO) {
        try {
            val jwt = getStoredJwt(context) // Retrieve JWT token
            Log.d("getAllAvailablePromoti", "JWT Token: $jwt")

            val response: HttpResponse = client.get("http://10.0.2.2:4000/promotion/all") {
                headers {
                    jwt?.let {
                        append(HttpHeaders.Authorization, "Bearer $it")
                    }
                }
                contentType(ContentType.Application.Json)
            }

            if (response.status == HttpStatusCode.OK) {
                val jsonResponse = response.bodyAsText()
                Log.d("getAllAvailablePromoti", "Response body: $jsonResponse")

                val promotionsResponse = json.decodeFromString<PromotionsResponse>(jsonResponse)
                Log.d("getAllAvailablePromoti", "Promotions data: ${promotionsResponse.data}")

                promotionsResponse.data
            } else {
                Log.e("getAllAvailablePromoti", "Error: ${response.status.description}")
                emptyList()
            }
        } catch (e: Exception) {
            Log.e("getAllAvailablePromoti", "Exception: ${e.message}")
            emptyList()
        }
    }
}

suspend fun getMerchantPromotions(context: Context, merchantId: String): List<Promo> {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/promotion/merchant/$merchantId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            Log.d("getMerchantPromotions", "Response: $jsonResponse")
            val promoResponse = json.decodeFromString<PromoResponse>(jsonResponse)
            Log.d("getMerchantPromotions", "Successfully fetched promotions: $promoResponse")
            promoResponse.data // Return only the promotions list
        } else {
            Log.e("getMerchantPromotions", "Failed with status: ${response.status}")
            emptyList()
        }
    } catch (e: Exception) {
        Log.e("getMerchantPromotions", "Error fetching promotions: ${e.message}", e)
        emptyList()
    } finally {
        client.close()
    }
}

suspend fun deletePromotion(context: Context, promotionId: String): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context) // Retrieve the JWT token for authorization
        val response: HttpResponse = client.delete("http://10.0.2.2:4000/promotion/$promotionId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") } // Add the Bearer token to the headers
            }
        }

        if (response.status == HttpStatusCode.OK) {
            Log.d("deletePromotion", "Promotion deleted successfully.")
            true
        } else {
            Log.e("deletePromotion", "Failed to delete promotion. Status: ${response.status.description}")
            false
        }
    } catch (e: Exception) {
        Log.e("deletePromotion", "Error deleting promotion: ${e.message}", e)
        false
    } finally {
        client.close() // Ensure the client is closed after the request
    }
}

suspend fun postReview(
    context: Context,
    orderId: String,
    menuItemId: String,
    rating: Int,
    reviewText: String
): Boolean {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val reviewRequest = ReviewRequest(orderId, menuItemId, rating, reviewText)
        val requestBody = json.encodeToString(reviewRequest)

        val response: HttpResponse = client.post("http://10.0.2.2:4000/reviews") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
            setBody(requestBody)
        }

        response.status == HttpStatusCode.Created
    } catch (e: Exception) {
        Log.e("postReview", "Error submitting review: ${e.message}")
        false
    } finally {
        client.close()
    }
}

suspend fun getReviewForMenuItem(
    context: Context,
    orderId: String,
    menuItemId: String
): ReviewData? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)
        val response: HttpResponse = client.get("http://10.0.2.2:4000/reviews/menu/$menuItemId/order/$orderId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json {
                ignoreUnknownKeys = true // Allow unknown keys
                isLenient = true         // Be lenient in parsing
            }
            val reviewResponse = json.decodeFromString<ReviewResponse>(jsonResponse)
            Log.d("getReviewForMenuItem", "Review fetched successfully: $reviewResponse")
            reviewResponse.data // Return the review data directly
        } else {
            Log.e("getReviewForMenuItem", "Failed to fetch review. Status: ${response.status}")
            null
        }
    } catch (e: Exception) {
        Log.e("getReviewForMenuItem", "Error fetching review: ${e.message}", e)
        null
    } finally {
        client.close()
    }
}

suspend fun getReviewsForMerchantOrders(context: Context, merchantId: String): List<MerchantOrderReview>? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)

        // Dynamically construct the endpoint with the merchantId
        val endpoint = "http://10.0.2.2:4000/reviews/merchant/$merchantId/orders/reviews"

        // Fetch merchant orders and reviews
        val response: HttpResponse = client.get(endpoint) {
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

            val reviewsResponse = json.decodeFromString<MerchantOrderReviewsResponse>(jsonResponse)
            Log.d("getReviewsForMerchant", "Reviews fetched successfully: $reviewsResponse")
            reviewsResponse.data
        } else {
            Log.e("getReviewsForMerchant", "Failed to fetch reviews. Status: ${response.status.description}")
            null
        }
    } catch (e: Exception) {
        Log.e("getReviewsForMerchant", "Error fetching reviews: ${e.message}", e)
        null
    } finally {
        client.close()
    }
}



suspend fun getMerchantReviews(
    context: Context,
    merchantId: String
): MerchantReviewsResponse? {
    val client = provideHttpClient(context)
    return try {
        val jwt = getStoredJwt(context)

        val response: HttpResponse = client.get("http://10.0.2.2:4000/reviews/merchant/$merchantId") {
            contentType(ContentType.Application.Json)
            headers {
                jwt?.let { append(HttpHeaders.Authorization, "Bearer $it") }
            }
        }

        if (response.status == HttpStatusCode.OK) {
            val jsonResponse = response.bodyAsText()
            val json = Json {
                ignoreUnknownKeys = true
                isLenient = true
            }

            val reviewsResponse = json.decodeFromString<MerchantReviewsResponse>(jsonResponse)
            Log.d("getMerchantReviews", "Merchant reviews fetched successfully: $reviewsResponse")
            reviewsResponse
        } else {
            Log.e("getMerchantReviews", "Failed to fetch merchant reviews. Status: ${response.status}")
            null
        }
    } catch (e: Exception) {
        Log.e("getMerchantReviews", "Error fetching merchant reviews: ${e.message}", e)
        null
    } finally {
        client.close()
    }
}

