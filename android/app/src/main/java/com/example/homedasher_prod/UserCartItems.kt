package com.example.homedasher_prod

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
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

    LaunchedEffect(userId) {
        coroutineScope.launch {
            cartData = getCart(context, userId)
            isLoading = false
        }
    }

    if (isLoading) {
        CircularProgressIndicator(Modifier.padding(16.dp))
    } else {
        cartData?.let { cart ->
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
                        val totalQuantity = cart.items.sumOf { it.quantity }
                        val merchantId = cart.items.firstOrNull()?.menuItem?.merchant_id ?: "Unknown"

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
                            text = "Total Price: $${cart.total_price}",
                            style = MaterialTheme.typography.headlineSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                coroutineScope.launch {
                                    val success = placeOrder(context, merchantId, cart)
                                    if (success) {
                                        Toast.makeText(context, "Order placed successfully", Toast.LENGTH_SHORT).show()
                                    } else {
                                        Toast.makeText(context, "Failed to place order", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Order Now", color = Color.White)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                LazyColumn {
                    items(cart.items) { item ->
                        CartItemRow(item = item, onDelete = {
                            coroutineScope.launch {
                                val success = deleteCartItem(context, userId, item)
                                if (success) {
                                    cartData = getCart(context, userId) // Refresh cart data
                                    Toast.makeText(context, "Item removed successfully", Toast.LENGTH_SHORT).show()
                                } else {
                                    Toast.makeText(context, "Failed to remove item", Toast.LENGTH_SHORT).show()
                                }
                            }
                        })
                    }
                }
            }
        } ?: Text("Failed to load cart data.", color = MaterialTheme.colorScheme.error)
    }
}

@Composable
fun CartItemRow(item: CartItem, onDelete: (String) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
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
                val itemName = menuItem?.item_name ?: "Unknown"
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
                onClick = { onDelete(item._id) },
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