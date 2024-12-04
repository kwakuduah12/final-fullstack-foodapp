package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import kotlinx.coroutines.launch

@Composable
fun MerchantMenuScreen(context: Context, merchantId: String) {
    val menuItems = remember { mutableStateOf<List<MerchantMenuItem>?>(null) }
    val isLoading = remember { mutableStateOf(true) }
    val coroutineScope = rememberCoroutineScope()

    val isPromotionMode = remember { mutableStateOf(false) }
    val selectedItems = remember { mutableStateOf<Set<String>>(emptySet()) }
    val isPromotionDialogOpen = remember { mutableStateOf(false) }

    LaunchedEffect(merchantId) {
        isLoading.value = true
        try {
            menuItems.value = getMenuItems(context, merchantId)
        } catch (e: Exception) {
            Log.e("MerchantMenuScreen", "Error fetching menu items: ${e.message}")
            menuItems.value = emptyList()
        } finally {
            isLoading.value = false
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Display content above the button
            if (isLoading.value) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (menuItems.value.isNullOrEmpty()) {
                Text(
                    text = "No menu items available",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f), // Occupy remaining vertical space
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(menuItems.value!!) { item ->
                        MenuItemCard(
                            item = item,
                            context = context,
                            isPromotionMode = isPromotionMode.value,
                            selectedItems = selectedItems,
                            onItemUpdated = {
                                coroutineScope.launch {
                                    menuItems.value = getMenuItems(context, merchantId)
                                }
                            },
                            onItemDeleted = {
                                coroutineScope.launch {
                                    menuItems.value = getMenuItems(context, merchantId)
                                }
                            }
                        )
                    }
                }
            }

            // Button at the bottom
            Button(
                onClick = {
                    if (isPromotionMode.value) {
                        isPromotionDialogOpen.value = true
                    }
                    isPromotionMode.value = !isPromotionMode.value
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isPromotionMode.value) Color(0xFFE91E63) else Color(0xFF4CAF50)
                )
            ) {
                Text(if (isPromotionMode.value) "Finish Selection" else "Create Promotion")
            }
        }

        // Promotion dialog
        if (isPromotionDialogOpen.value) {
            CreatePromotionDialog(
                context = context,
                selectedItems = selectedItems.value.toList(),
                onDismiss = { isPromotionDialogOpen.value = false }
            )
        }
    }
}


@Composable
fun MenuItemCard(
    item: MerchantMenuItem,
    context: Context,
    isPromotionMode: Boolean,
    selectedItems: MutableState<Set<String>>,
    onItemUpdated: () -> Unit,
    onItemDeleted: () -> Unit
) {
    val isDialogOpen = remember { mutableStateOf(false) }
    val isSelected = remember { mutableStateOf(selectedItems.value.contains(item._id)) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable {
                if (isPromotionMode) {
                    // Toggle selection in promotion mode
                    if (isSelected.value) {
                        selectedItems.value = selectedItems.value - item._id
                    } else {
                        selectedItems.value = selectedItems.value + item._id
                    }
                    isSelected.value = !isSelected.value
                } else {
                    // Open edit dialog when not in promotion mode
                    isDialogOpen.value = true
                }
            },
        shape = RoundedCornerShape(4.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected.value && isPromotionMode) Color(0xFFE0F7FA) else Color.White
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = item.itemName ?: "Unknown Item",
                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Category: ${item.category ?: "N/A"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
                Text(
                    text = "Price: \$${item.price ?: "N/A"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Black
                )
                Text(
                    text = if (item.available) "Available" else "Unavailable",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold,
                        color = if (item.available) Color(0xFF66BB6A) else Color(0xFFEF5350)
                    )
                )
            }

            Image(
                painter = painterResource(id = getFoodIcon(item.category)),
                contentDescription = "Food Icon",
                modifier = Modifier
                    .size(64.dp)
                    .padding(start = 16.dp)
            )
        }
    }

    // Edit Menu Item Dialog
    if (isDialogOpen.value) {
        EditMenuItemDialog(
            context = context,
            item = item,
            onDismiss = { isDialogOpen.value = false },
            onDeleteSuccess = onItemDeleted,
            onUpdateSuccess = onItemUpdated
        )
    }
}




@Composable
fun CreatePromotionDialog(
    context: Context,
    selectedItems: List<String>,
    onDismiss: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()

    val promotionName = remember { mutableStateOf("") }
    val description = remember { mutableStateOf("") }
    val discount = remember { mutableStateOf("") }
    val startDate = remember { mutableStateOf("") }
    val endDate = remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Create Promotion",
                    style = MaterialTheme.typography.headlineSmall
                )

                TextField(
                    value = promotionName.value,
                    onValueChange = { promotionName.value = it },
                    label = { Text("Promotion Name") }
                )
                TextField(
                    value = description.value,
                    onValueChange = { description.value = it },
                    label = { Text("Description") }
                )
                TextField(
                    value = discount.value,
                    onValueChange = { discount.value = it },
                    label = { Text("Discount (%)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                TextField(
                    value = startDate.value,
                    onValueChange = { startDate.value = it },
                    label = { Text("Start Date (YYYY-MM-DD)") }
                )
                TextField(
                    value = endDate.value,
                    onValueChange = { endDate.value = it },
                    label = { Text("End Date (YYYY-MM-DD)") }
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(onClick = onDismiss, colors = ButtonDefaults.buttonColors(containerColor = Color.Gray)) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val success = createPromotion(
                                    context = context,
                                    promotionName = promotionName.value,
                                    description = description.value,
                                    discount = discount.value.toDoubleOrNull() ?: 0.0,
                                    startDate = "${startDate.value}T00:00:00Z",
                                    endDate = "${endDate.value}T23:59:59Z",
                                    menuItems = selectedItems
                                )
                                if (success) {
                                    onDismiss()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors()
                    ) {
                        Text("Create")
                    }
                }
            }
        }
    }
}


fun getFoodIcon(category: String?): Int {
    return when (category?.lowercase()) {
        "appetizer" -> R.drawable.icon_appetizer
        "main course" -> R.drawable.icon_main_course
        "dessert" -> R.drawable.icon_dessert
        "drink" -> R.drawable.icon_drink
        else -> R.drawable.icon_default_food
    }
}

@Composable
fun EditMenuItemDialog(
    context: Context,
    item: MerchantMenuItem,
    onDismiss: () -> Unit,
    onDeleteSuccess: () -> Unit,
    onUpdateSuccess: () -> Unit // Callback for successful update
) {
    val coroutineScope = rememberCoroutineScope()

    // Editable fields for item details
    val itemName = remember { mutableStateOf(item.itemName ?: "") }
    val price = remember { mutableStateOf(item.price?.toString() ?: "") }
    val category = remember { mutableStateOf(item.category ?: "") }
    val availability = remember { mutableStateOf(item.available) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Edit Menu Item",
                    style = MaterialTheme.typography.headlineSmall
                )

                // Editable fields
                TextField(
                    value = itemName.value,
                    onValueChange = { itemName.value = it },
                    label = { Text("Item Name") }
                )

                TextField(
                    value = price.value,
                    onValueChange = { price.value = it },
                    label = { Text("Price") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )

                TextField(
                    value = category.value,
                    onValueChange = { category.value = it },
                    label = { Text("Category") }
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Available", style = MaterialTheme.typography.bodyMedium)
                    Switch(
                        checked = availability.value,
                        onCheckedChange = { availability.value = it }
                    )
                }

                // Buttons for Delete and Save
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val success = deleteMenuItem(context, item._id ?: "")
                                if (success) {
                                    onDeleteSuccess()
                                    onDismiss()
                                } else {
                                    Log.e("EditMenuItemDialog", "Failed to delete menu item.")
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B0000)) // Darker red color
                    ) {
                        Text(text = "Delete", color = Color.White)
                    }

                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val request = UpdateMenuItemRequest(
                                    item_name = itemName.value,
                                    price = price.value.toDoubleOrNull() ?: 0.0,
                                    category = category.value,
                                    available = availability.value
                                )
                                val success = updateMenuItem(
                                    context = context,
                                    menuItemId = item._id ?: "",
                                    request = request
                                )
                                if (success) {
                                    onUpdateSuccess()
                                    onDismiss()
                                } else {
                                    Log.e("EditMenuItemDialog", "Failed to update menu item.")
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors()
                    ) {
                        Text("Save")
                    }

                }
            }
        }
    }
}
