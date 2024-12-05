import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.homedasher_prod.MerchantMenuItem
import com.example.homedasher_prod.getCart
import com.example.homedasher_prod.getMenuItems
import com.example.homedasher_prod.postToCart
import com.example.homedasher_prod.updateCartStatus
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserMenuScreen(
    context: Context,
    merchantId: String,
    userId: String,
    storeName: String,
    navController: NavController
) {
    val scope = rememberCoroutineScope()
    var menuItems by remember { mutableStateOf<List<MerchantMenuItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isCartNotEmpty by remember { mutableStateOf(false) }

    LaunchedEffect(merchantId) {
        scope.launch {
            try {
                isLoading = true
                menuItems = getMenuItems(context, merchantId)
                if (menuItems.isEmpty()) {
                    errorMessage = "No menu items available."
                }
            } catch (e: Exception) {
                errorMessage = "Failed to load menu items: ${e.message}"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(userId) {
        updateCartStatus(context, userId) { isNotEmpty ->
            isCartNotEmpty = isNotEmpty
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Welcome to $storeName",
                        style = MaterialTheme.typography.headlineSmall.copy(
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                },
                actions = {
                    Box {
                        IconButton(onClick = { navController.navigate("userCartItems/$userId") }) {
                            Icon(
                                imageVector = Icons.Default.ShoppingCart,
                                contentDescription = "Cart",
                                tint = MaterialTheme.colorScheme.onPrimary
                            )
                        }
                        if (isCartNotEmpty) {
                            Box(
                                modifier = Modifier
                                    .size(14.dp)
                                    .background(Color.Red, shape = CircleShape)
                                    .align(Alignment.TopEnd)
                                    .offset(x = 8.dp, y = (-8).dp)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.mediumTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F9FA))
                .padding(paddingValues)
        ) {
            when {
                isLoading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
                errorMessage != null -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = errorMessage!!,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                color = Color.Red,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp) // Spacing between items
                    ) {
                        items(menuItems) { menuItem ->
                            MenuItemCard(
                                menuItem = menuItem,
                                userId = userId,
                                context = context,
                                onItemAddedToCart = {
                                    scope.launch {
                                        updateCartStatus(context, userId) { isNotEmpty ->
                                            isCartNotEmpty = isNotEmpty
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MenuItemCard(
    menuItem: MerchantMenuItem,
    userId: String,
    context: Context,
    onItemAddedToCart: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var quantity by remember { mutableStateOf(1) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        shape = RoundedCornerShape(6.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF8F9FA)) // Light background
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Image/Icon Section
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(color = Color(0xFFEDEDED), shape = RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Item Image",
                    modifier = Modifier.size(40.dp),
                    tint = Color.Gray
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Details Section
            Column(
                modifier = Modifier.weight(0.5f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = menuItem.itemName,
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Price: \$${menuItem.price}",
                    style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFF4CAF50))
                )
                // Show discounted price only if it is not null
                menuItem.discountedPrice?.let { discountedPrice ->
                    Text(
                        text = "Discounted Price: \$${discountedPrice}",
                        style = MaterialTheme.typography.bodyLarge.copy(color = Color.Red),
                        fontWeight = FontWeight.Bold
                    )
                }
                menuItem.description?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodyMedium.copy(color = Color.Gray),
                        maxLines = 2,
                        overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                    )
                }
                // Availability status
                Text(
                    text = if (menuItem.available) "Available" else "Not Available",
                    style = MaterialTheme.typography.bodyLarge.copy(
                        color = if (menuItem.available) Color(0xFF4CAF50) else Color.Red,
                        fontWeight = FontWeight.Bold
                    )
                )
            }

            // Quantity and Button Section
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { if (quantity > 1) quantity-- }) {
                        Text("-", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
                    }
                    Text("$quantity", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
                    IconButton(onClick = { quantity++ }) {
                        Text("+", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
                    }
                }

                Button(
                    onClick = {
                        if (menuItem.available) {
                            scope.launch {
                                try {
                                    postToCart(context, userId, menuItem._id, quantity)
                                    Toast.makeText(context, "Item added successfully!", Toast.LENGTH_SHORT).show()
                                    onItemAddedToCart()
                                } catch (e: Exception) {
                                    Toast.makeText(context, "Failed to add item: ${e.message}", Toast.LENGTH_SHORT)
                                        .show()
                                }
                            }
                        }
                    },
                    enabled = menuItem.available,
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text("Add to Cart", color = Color.White)
                }
            }
        }
    }
}
