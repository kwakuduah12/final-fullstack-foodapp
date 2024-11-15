package com.example.homedasher_prod

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Icon
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material.icons.rounded.Search
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch
import androidx.compose.runtime.*



@Composable
fun HomeScreen(
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
                AppBar(context, userId, navController)
                Content(viewModel.merchants, navController)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppBar(context: Context, userId: String, navController: NavController) {
    val coroutineScope = rememberCoroutineScope()
    var isCartNotEmpty by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val cart = getCart(context, userId)
                isCartNotEmpty = cart != null && cart.items.isNotEmpty()
            } catch (e: Exception) {
                Log.e("AppBar", "Error retrieving cart", e)
            }
        }
    }

    Row(
        Modifier
            .padding(16.dp)
            .height(46.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceAround
    ) {
        TextField(
            value = "",
            onValueChange = {},
            label = { Text(text = "Search Restaurants...", fontSize = 12.sp) },
            singleLine = true,
            leadingIcon = { Icon(imageVector = Icons.Rounded.Search, contentDescription = "Search") },
            colors = TextFieldDefaults.textFieldColors(
                containerColor = Color.White,
                focusedIndicatorColor = Color.Transparent,
                unfocusedIndicatorColor = Color.Transparent
            ),
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        )
        Spacer(modifier = Modifier.width(8.dp))
        IconButton(onClick = {
            coroutineScope.launch {
                try {
                    val cart = getCart(context, userId)
                    if (cart != null && isCartNotEmpty) {
                        navController.navigate("userCartItems/${userId}")
                    } else {
                        Toast.makeText(context, "Your cart is empty", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Log.e("AppBar", "Error retrieving cart", e)
                }
            }
        }) {
            Box {
                Icon(
                    imageVector = Icons.Outlined.ShoppingCart,
                    contentDescription = "Cart",
                    tint = Color.White
                )
                if (isCartNotEmpty) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .background(Color.Red, shape = CircleShape)
                            .align(Alignment.TopEnd)
                    )
                }
            }
        }
        IconButton(onClick = {
            performLogout(context)
            Toast.makeText(context, "Logged out", Toast.LENGTH_SHORT).show()
            navController.navigate("login") {
                popUpTo("home") { inclusive = true }
            }
        }) {
            Icon(imageVector = Icons.Filled.ExitToApp, contentDescription = "Logout", tint = Color.White)
        }
        IconButton(onClick = {}) {
            Icon(imageVector = Icons.Outlined.Notifications, contentDescription = "Notification", tint = Color.White)
        }
    }
}

@Composable
fun Content(merchants: List<Merchant>, navController: NavController) {
    Header()
    Spacer(modifier = Modifier.height(16.dp))
    Promotions()
    Spacer(modifier = Modifier.height(16.dp))
    if (merchants.isNotEmpty()) {
        CategorySection(merchants = merchants, navController = navController)
    }
    Spacer(modifier = Modifier.height(16.dp))
    BestSellerSection()
}

@Composable
fun Header() {
    Card(
        modifier = Modifier
            .height(64.dp)
            .padding(horizontal = 16.dp),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            QrButton()
            VerticalDevider()
            Row(
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(1f)
                    .clickable { }
                    .padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_money),
                    contentDescription = "",
                    tint = Color(0xFF6FCF97)
                )
                Column(
                    modifier = Modifier.padding(8.dp)
                ) {
                    Text(text = "$120", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(text = "Top up", color = MaterialTheme.colorScheme.primary, fontSize = 12.sp)
                }
            }
            VerticalDevider()
            Row(
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(1f)
                    .clickable { }
                    .padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_coin),
                    contentDescription = "",
                    tint = Color.Magenta
                )
                Column(
                    modifier = Modifier.padding(8.dp)
                ) {
                    Text(text = "$12", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(text = "Top up", color = Color.LightGray, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun QrButton() {
    IconButton(
        onClick = {},
        modifier = Modifier
            .fillMaxHeight()
            .aspectRatio(1f)
    ) {
        Icon(
            painter = painterResource(id = R.drawable.ic_scan),
            contentDescription = "scan",
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        )
    }
}

@Composable
fun VerticalDevider() {
    Divider(
        color = Color(0xFFF1F1F1),
        modifier = Modifier
            .width(1.dp)
            .height(32.dp)
    )
}

@Composable
fun Promotions() {
    LazyRow(
        modifier = Modifier.height(160.dp),
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ){
        item {
            PropotionItem(
                imagePainter = painterResource(id = R.drawable.promotion),
                title = "Fruit",
                subtitle = "Start @",
                header = "$1",
                backgroundColor = MaterialTheme.colorScheme.primary
            )
        }
        item {
            PropotionItem(
                imagePainter = painterResource(id = R.drawable.promotion),
                title = "Meat",
                subtitle = "Discount",
                header = "$1",
                backgroundColor = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun PropotionItem(
    title: String = "",
    subtitle: String = "",
    header: String = "",
    backgroundColor: Color = Color.Transparent,
    imagePainter: Painter
) {
    Card(
        modifier = Modifier.width(300.dp),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row {
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.Center
            ) {
                Text(text = title, fontSize = 14.sp, color = Color.White)
                Text(text = subtitle, fontSize = 16.sp, color = Color.White, fontWeight = FontWeight.Bold)
                Text(text = header, fontSize = 28.sp, color = Color.White, fontWeight = FontWeight.Bold)
            }
            Image(
                painter = imagePainter, contentDescription = "",
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(1f),
                alignment = Alignment.CenterEnd,
                contentScale = ContentScale.Crop
            )
        }
    }
}

@Composable
fun CategorySection(merchants: List<Merchant>, navController: NavController) {
    val storeTypeImages = mapOf(
        "Asian" to R.drawable.asian,
        "Italian" to R.drawable.italian,
        "African" to R.drawable.jollof,
        "Mexican" to R.drawable.tacos,
        "Grocery" to R.drawable.ic_cheese
    )

    val storeTypes = merchants.map { it.storeType }.distinct()

    Column(
        modifier = Modifier.padding(horizontal = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Category", style = MaterialTheme.typography.headlineSmall)
            TextButton(onClick = {}) {
                Text(text = "More", color = MaterialTheme.colorScheme.primary)
            }
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            storeTypes.forEach { storeType ->
                val imageRes = storeTypeImages[storeType] ?: R.drawable.bg_main
                CategoryButton(
                    text = storeType,
                    icon = painterResource(id = imageRes),
                    backgroundColor = Color(0xffFEF4E7),
                    onClick = { navController.navigate("category/$storeType") }
                )
            }
        }
    }
}

@Composable
fun CategoryButton(
    text: String = "",
    icon: Painter,
    backgroundColor: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(72.dp)
            .clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(85.dp)
                .background(
                    color = backgroundColor,
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(18.dp)
        ) {
            Image(
                painter = icon,
                contentDescription = "",
                modifier = Modifier.fillMaxSize()
            )
        }
        Text(
            text = text,
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Center,
            fontSize = 13.sp
        )
    }
}

@Composable
fun BestSellerSection() {
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
        BestSellerItems()
    }
}

@Composable
fun BestSellerItems() {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            BestSellerItem(
                imagePainter = painterResource(id = R.drawable.italian),
                title = "Pasta",
                price = "6.99",
                discountPercent = 10
            )
        }
        item {
            BestSellerItem(
                imagePainter = painterResource(id = R.drawable.jollof),
                title = "Jollof Rice",
                price = "10.64",
                discountPercent = 5
            )
        }
        item {
            BestSellerItem(
                imagePainter = painterResource(id = R.drawable.tacos),
                title = "Tacos",
                price = "4.76",
                discountPercent = 20
            )
        }
    }
}

@Composable
fun BestSellerItem(
    title: String = "",
    price: String = "",
    discountPercent: Int = 0,
    imagePainter: Painter
) {
    Card(
        modifier = Modifier.width(160.dp),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        //elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
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

@Composable
@Preview(showSystemUi = true, showBackground = true)
fun PrevScreen() {
    val userId = "sampleUserId"
    HomeScreen(
        context = LocalContext.current,
        userId = userId,
        navController = rememberNavController()
    )
}