package com.example.homedasher_prod

import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

@Composable
fun UserCartItems(userId: String) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var cartData by remember { mutableStateOf<CartData?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedMerchant by remember { mutableStateOf<String?>(null) }

    val snackbarHostState = remember { SnackbarHostState() }

    // Fetch the cart data initially
    LaunchedEffect(userId) {
        Log.d("UserCartItems", "Fetching cart for user: $userId")
        coroutineScope.launch {
            try {
                cartData = getCart(context, userId)
                isLoading = false
                selectedMerchant = cartData?.items?.firstOrNull()?.menuItem?.merchantId
                Log.d("UserCartItems", "Cart fetched: $cartData")
            } catch (e: Exception) {
                Log.e("UserCartItems", "Error fetching cart: ${e.message}")
                isLoading = false
            }
        }
    }


    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        if (isLoading) {
            CircularProgressIndicator(Modifier.padding(16.dp))
        } else {
            cartData?.let { cart ->
                val groupedItems = cart.items.groupBy { it.menuItem?.merchantId }
                val isSingleMerchant = groupedItems.size == 1
                val totalQuantity = cart.items.sumOf { it.quantity }
                val totalPrice = cart.total_price

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "Shopping Cart",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F1F1)),
                        shape = MaterialTheme.shapes.medium,
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                        ) {
                            Text(
                                text = "Total Items: ${cart.items.size}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Total Quantity: $totalQuantity",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Total Price: $$totalPrice",
                                style = MaterialTheme.typography.headlineSmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        if (isSingleMerchant) {
                                            val success = placeOrder(context, selectedMerchant ?: "", cart)
                                            if (success) {
                                                val balanceDeducted = deductBalance(context, cart.total_price)
                                                if (balanceDeducted) {
                                                    val cartCleared = clearCart(context)
                                                    if (cartCleared) {
                                                        cartData = null // Clear local cart data
                                                        Toast.makeText(context, "Order placed, balance deducted, and cart cleared", Toast.LENGTH_SHORT).show()
                                                    } else {
                                                        Toast.makeText(context, "Order placed and balance deducted, but failed to clear cart", Toast.LENGTH_SHORT).show()
                                                    }
                                                } else {
                                                    Toast.makeText(context, "Order placed but failed to deduct balance", Toast.LENGTH_SHORT).show()
                                                }
                                            } else {
                                                Toast.makeText(context, "Failed to place order", Toast.LENGTH_SHORT).show()
                                            }
                                        } else {
                                            snackbarHostState.showSnackbar(
                                                message = "You can only place an order from one store at a time.",
                                                actionLabel = "Got it"
                                            )
                                        }
                                    }
                                },
                                modifier = Modifier.fillMaxWidth(),
                                enabled = isSingleMerchant
                            ) {
                                Text("Order Now", color = Color.White)
                            }

                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    LazyColumn {
                        items(cart.items) { item ->
                            val merchantId = item.menuItem?.merchantId
                            CartItemRow(
                                item = item,
                                isDifferentMerchant = selectedMerchant != null && selectedMerchant != merchantId,
                                onDelete = {
                                    coroutineScope.launch {
                                        val success = deleteCartItem(context, it)
                                        if (success) {
                                            cartData = getCart(context, userId)
                                            Log.d("UserCartItems", "Cart after delete: $userId")
                                            selectedMerchant = cartData?.items?.firstOrNull()?.menuItem?.merchantId
                                            Toast.makeText(context, "Item removed successfully", Toast.LENGTH_SHORT).show()
                                        } else {
                                            Toast.makeText(context, "Failed to remove item", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            } ?: Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Your cart is empty.",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}


@Composable
fun CartItemRow(item: CartItem, isDifferentMerchant: Boolean, onDelete: (String) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isDifferentMerchant) Color(0xFFFFE0E0) else Color.White // Highlight items from different merchants
        ),
        shape = MaterialTheme.shapes.medium,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                val menuItem = item.menuItem
                val itemName = menuItem?.itemName ?: "Unknown"
                val description = menuItem?.description ?: "No Description"
                val price = menuItem?.price?.toString() ?: "0.00"
                val available = menuItem?.available ?: false

                Spacer(modifier = Modifier.height(4.dp))
                Text(text = "Item Name: $itemName", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = "Description: $description", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = "Price: $$price", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = "Available: ${if (available) "Yes" else "No"}", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Quantity: ${item.quantity}", style = MaterialTheme.typography.bodyMedium)
            }
            IconButton(
                onClick = { onDelete(item.menuItem?.id ?: "") },
                modifier = Modifier.padding(start = 16.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.Delete,
                    contentDescription = "Delete Item",
                    tint = Color(0xFFD32F2F)
                )
            }
        }
    }
}
