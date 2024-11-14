import androidx.compose.foundation.layout.*
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import android.content.Context
import com.example.homedasher_prod.Merchant
import com.example.homedasher_prod.getAllMerchants
import kotlinx.coroutines.launch

@Composable
fun MerchantHomeScreen(navController: NavHostController? = null, modifier: Modifier = Modifier, context: Context) {
    var merchants by remember { mutableStateOf<List<Merchant>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            val retrievedMerchants = getAllMerchants(context)
            if (retrievedMerchants.isNotEmpty()) {
                merchants = retrievedMerchants
            } else {
                errorMessage = "Failed to fetch merchants."
            }
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        if (isLoading) {
            CircularProgressIndicator()
        } else {
            errorMessage?.let {
                Text(text = it, color = MaterialTheme.colorScheme.error)
            }

            merchants.forEach { merchant ->
                MerchantItem(merchant)
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun MerchantItem(merchant: Merchant) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Text(text = "Store Name: ${merchant.storeName}", fontSize = 18.sp)
        Text(text = "Address: ${merchant.address}", fontSize = 14.sp)
        Text(text = "Email: ${merchant.email}", fontSize = 14.sp)
        Text(text = "Phone: ${merchant.phoneNumber}", fontSize = 14.sp)
        Text(text = "Type: ${merchant.storeType}", fontSize = 14.sp)
    }
}