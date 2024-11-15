import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.homedasher_prod.MerchantMenuItem
import com.example.homedasher_prod.getMenuItems
import com.example.homedasher_prod.postToCart
import kotlinx.coroutines.launch

@Composable
fun UserMenuScreen(context: Context, merchantId: String, userId: String) {
    val scope = rememberCoroutineScope()
    var menuItems by remember { mutableStateOf<List<MerchantMenuItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

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

    when {
        isLoading -> {
            CircularProgressIndicator(modifier = Modifier.fillMaxSize().wrapContentSize())
        }
        errorMessage != null -> {
            Text(
                text = errorMessage!!,
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.fillMaxSize().wrapContentSize()
            )
        }
        else -> {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(16.dp)
            ) {
                items(menuItems) { menuItem ->
                    MenuItemCard(menuItem, userId, context)
                }
            }
        }
    }
}

@Composable
fun MenuItemCard(menuItem: MerchantMenuItem, userId: String, context: Context) {
    val scope = rememberCoroutineScope()
    var quantity by remember { mutableStateOf(1) }
    val appContext = LocalContext.current.applicationContext

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = menuItem.itemName, style = MaterialTheme.typography.headlineMedium)
            menuItem.description?.let {
                Text(text = it, style = MaterialTheme.typography.bodyMedium)
            }
            Text(text = "Price: \$${menuItem.price}", style = MaterialTheme.typography.bodyMedium)
            Text(text = "Category: ${menuItem.category}", style = MaterialTheme.typography.bodyMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (menuItem.available) "Available" else "Unavailable",
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (menuItem.available) Color(0xFF006400) else Color.Red,
                    modifier = Modifier.weight(1f)
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { if (quantity > 1) quantity-- }) {
                        Text("-", style = MaterialTheme.typography.bodyLarge)
                    }
                    Text("$quantity", style = MaterialTheme.typography.bodyLarge)
                    IconButton(onClick = { quantity++ }) {
                        Text("+", style = MaterialTheme.typography.bodyLarge)
                    }
                }
                Button(
                    onClick = {
                        if (menuItem.available) {
                            scope.launch {
                                try {
                                    postToCart(context, userId, menuItem._id, quantity)
                                    Toast.makeText(
                                        appContext,
                                        "Item added successfully!",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                } catch (e: Exception) {
                                    Toast.makeText(
                                        appContext,
                                        "Failed to add item: ${e.message}",
                                        Toast.LENGTH_SHORT
                                    ).show()
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
