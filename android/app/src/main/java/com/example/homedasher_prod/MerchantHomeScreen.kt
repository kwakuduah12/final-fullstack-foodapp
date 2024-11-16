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
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.Alignment
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.navigation.NavController
import com.example.homedasher_prod.MerchantViewModel
import com.example.homedasher_prod.R
import androidx.compose.ui.graphics.vector.ImageVector
import com.example.homedasher_prod.AppBar
import com.example.homedasher_prod.Content
import androidx.lifecycle.viewmodel.compose.viewModel


@Composable
fun MerchantHomeScreen(
    context: Context,
    userId: String,
    navController: NavController,
    viewModel: MerchantViewModel = viewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.fetchMerchants(context)
    }

    if (viewModel.isLoading) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(48.dp)
            )
        }
    } else if (!viewModel.errorMessage.isNullOrEmpty()) {
        Text(text = viewModel.errorMessage ?: "", modifier = Modifier.fillMaxSize())
    } else {
        Column {
            Box(
                modifier = Modifier.weight(1f)
                    .verticalScroll(rememberScrollState())
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
                    AppBar(context, userId, navController)
                    Content(viewModel.merchants, navController)
                }
            }
            BottomNavigationBar(navController)
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavController) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .background(MaterialTheme.colorScheme.surface, shape = RoundedCornerShape(8.dp)),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        BottomNavItem(Icons.Default.Person, "Profile") {
            navController.navigate("profile")
        }
        BottomNavItem(Icons.Default.List, "Orders") {
            navController.navigate("orders")
        }
        BottomNavItem(Icons.Default.Menu, "Menu") {
            navController.navigate("menu")
        }
        BottomNavItem(Icons.Default.Settings, "Settings") {
            navController.navigate("settings")
        }
        BottomNavItem(Icons.Default.Info, "Info") {
            navController.navigate("info")
        }
    }
}

@Composable
fun BottomNavItem(icon: ImageVector, label: String, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Icon(imageVector = icon, contentDescription = label, tint = MaterialTheme.colorScheme.primary)
        Text(text = label, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface)
    }
}