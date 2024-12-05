package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.material.icons.*
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Star
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavController
import kotlinx.coroutines.launch

@Composable
fun MerchantHomeScreen(
    context: Context,
    merchantId: String,
    navController: NavController,
    viewModel: MerchantViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.fetchMerchants(context)
        viewModel.loadMostOrderedFoods(context)
    }

    val mostOrderedFoods = viewModel.mostOrderedFoods

    Box(
        modifier = Modifier.verticalScroll(rememberScrollState())
    ) {
        Image(
            modifier = Modifier
                .fillMaxWidth()
                .offset(0.dp, (-30).dp),
            contentDescription = "Header",
            painter = painterResource(id = R.drawable.bg_main),
            contentScale = ContentScale.FillWidth
        )
        Column {
            AppBar(context, merchantId, navController)
            Content(
                context = context,
                merchantId = merchantId,
                navController = navController,
                mostOrderedFoods = mostOrderedFoods
            )
        }
    }
}

@Composable
fun Content(
    context: Context,
    merchantId: String,
    navController: NavController,
    mostOrderedFoods: List<MostOrderedFood>
) {
    Header(context = context)
    Spacer(modifier = Modifier.height(16.dp))
    Promotions(context = context, merchantId = merchantId, navController = navController) // Pass merchantId
    Spacer(modifier = Modifier.height(16.dp))
    MerchantManageStoreSection(context, merchantId, navController = navController)
    Spacer(modifier = Modifier.height(16.dp))
    MerchantBestSellerSection(mostOrderedFoods)
}





@Composable
fun MerchantManageStoreSection(context: Context, userId: String, navController: NavController) {
    val showDialog = remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope() // Define the coroutineScope
    val menuItems = remember { mutableStateOf<List<MerchantMenuItem>>(emptyList()) }

    val storeTypes: List<Triple<String, ImageVector, () -> Unit>> = listOf(
        Triple("Create Menu", Icons.Default.Add) { showDialog.value = true },
        Triple("See Orders", Icons.Default.List) {
            navController.navigate("merchantOrdersScreen/$userId")
        },
        Triple("Menu", Icons.Default.Menu) {
            navController.navigate("merchantMenuScreen/$userId")
        },
        Triple("Promotions", Icons.Default.Star) {
            navController.navigate("merchantPromotionsScreen/$userId") // Navigate to the Promotions screen
        }
    )




    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Manage Store", style = MaterialTheme.typography.headlineSmall)
        }
        Spacer(modifier = Modifier.height(16.dp))

        // Store Management Buttons
        Column(
            verticalArrangement = Arrangement.spacedBy(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            for (i in storeTypes.indices step 2) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(40.dp)
                ) {
                    MerchantCategoryButton(
                        text = storeTypes[i].first,
                        icon = storeTypes[i].second,
                        backgroundColor = Color(0xffFEF4E7),
                        onClick = storeTypes[i].third
                    )
                    if (i + 1 < storeTypes.size) {
                        MerchantCategoryButton(
                            text = storeTypes[i + 1].first,
                            icon = storeTypes[i + 1].second,
                            backgroundColor = Color(0xffFEF4E7),
                            onClick = storeTypes[i + 1].third
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

    }

    // Show Create Menu Dialog
    if (showDialog.value) {
        CreateMenuDialog(
            context = context,
            onDismiss = { showDialog.value = false },
            onMenuCreated = {
                coroutineScope.launch {
                    menuItems.value = getMenuItems(context, userId)
                }
            }
        )
    }

}

@Composable
fun MostOrderedItemCard(food: MostOrderedFood) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = food.name,
                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Orders: ${food.name}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Revenue: \$${food.price}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
            }
        }
    }
}



@Composable
fun CreateMenuDialog(
    context: Context,
    onDismiss: () -> Unit,
    onMenuCreated: () -> Unit // Callback for updating the UI after creation
) {
    val itemName = remember { mutableStateOf("") }
    val description = remember { mutableStateOf("") }
    val price = remember { mutableStateOf("") }
    val category = remember { mutableStateOf("") }
    val available = remember { mutableStateOf(false) }
    val expanded = remember { mutableStateOf(false) } // For dropdown menu
    val predefinedCategories = listOf("Appetizer", "Main Course", "Dessert", "Drink", "Other")
    val coroutineScope = rememberCoroutineScope()

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color.White,
            modifier = Modifier.padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(text = "Create Menu Item", style = MaterialTheme.typography.headlineSmall)

                TextField(
                    value = itemName.value,
                    onValueChange = { itemName.value = it },
                    label = { Text("Item Name") }
                )
                TextField(
                    value = description.value,
                    onValueChange = { description.value = it },
                    label = { Text("Description") }
                )
                TextField(
                    value = price.value,
                    onValueChange = { price.value = it },
                    label = { Text("Price") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )

                // Dropdown for Category
                Box(modifier = Modifier.fillMaxWidth()) {
                    TextField(
                        value = category.value,
                        onValueChange = {}, // Do nothing, category is set by dropdown selection
                        label = { Text("Category") },
                        enabled = false, // Disable manual input
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Default.ArrowDropDown,
                                contentDescription = "Dropdown",
                                modifier = Modifier.clickable { expanded.value = !expanded.value }
                            )
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(
                        expanded = expanded.value,
                        onDismissRequest = { expanded.value = false }
                    ) {
                        predefinedCategories.forEach { categoryOption ->
                            DropdownMenuItem(
                                text = { Text(categoryOption) },
                                onClick = {
                                    category.value = categoryOption
                                    expanded.value = false
                                }
                            )
                        }
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "Available")
                    Switch(
                        checked = available.value,
                        onCheckedChange = { available.value = it }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val success = createMenuItem(
                                    context = context,
                                    itemName = itemName.value,
                                    description = description.value,
                                    price = price.value.toDoubleOrNull() ?: 0.0,
                                    category = category.value,
                                    available = available.value
                                )
                                if (success) {
                                    Toast.makeText(context, "Menu item created successfully!", Toast.LENGTH_SHORT).show()
                                    onMenuCreated()
                                    onDismiss()
                                } else {
                                    Log.e("CreateMenuDialog", "Failed to create menu item.")
                                }
                            }
                        }
                    ) {
                        Text(text = "Create")
                    }

                    Button(onClick = onDismiss) {
                        Text("Cancel")
                    }
                }
            }
        }
    }
}



@Composable
fun MerchantCategoryButton(
    text: String = "",
    icon: ImageVector,
    backgroundColor: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(100.dp)
            .clickable { onClick() },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(100.dp)
                .background(
                    color = backgroundColor,
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(18.dp),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color.Black,
                modifier = Modifier.size(48.dp)
            )
        }
        Text(
            text = text,
            textAlign = TextAlign.Center,
            fontSize = 14.sp
        )
    }
}




@Composable
fun MerchantBestSellerSection(mostOrderedFoods: List<MostOrderedFood>) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Best Seller",
                style = MaterialTheme.typography.headlineSmall
            )
            TextButton(onClick = {}) {
                Text(text = "More", color = MaterialTheme.colorScheme.primary)
            }
        }
        MerchantBestSellerItems(mostOrderedFoods)
    }
}



@Composable
fun MerchantBestSellerItems(mostOrderedFoods: List<MostOrderedFood>) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        if (mostOrderedFoods.isEmpty()) {
            item {
                Text(
                    text = "No Best Sellers Found",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(16.dp)
                )
            }
        } else {
            items(mostOrderedFoods) { food ->
                MerchantBestSellerItem(
                    imagePainter = painterResource(id = R.drawable.jollof), // Replace with dynamic image if possible
                    title = food.name,
                    price = "\$${String.format("%.2f", food.price)}",
                    discountPercent = 0,
                    onClick = {}
                )
            }
        }
    }
}




@Composable
fun MerchantBestSellerItem(
    title: String = "",
    price: String = "",
    discountPercent: Int = 0,
    imagePainter: Painter,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(160.dp)
            .clickable { onClick() }
            .padding(vertical = 8.dp),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = imagePainter,
                contentDescription = "",
                modifier = Modifier
                    .size(100.dp)
                    .padding(bottom = 8.dp),
                contentScale = ContentScale.Crop
            )
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Start)
            )
            Row(
                modifier = Modifier.align(Alignment.Start)
            ) {
                Text(
                    text = price,
                    textDecoration = if (discountPercent > 0)
                        TextDecoration.LineThrough
                    else
                        TextDecoration.None,
                    color = if (discountPercent > 0) Color.Gray else Color.Black
                )
                if (discountPercent > 0) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "[$discountPercent%]", color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

