package com.example.homedasher_prod

import android.content.Context
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.compose.foundation.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.material3.TextField
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Icon
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material.icons.outlined.Star
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
import androidx.compose.ui.window.Dialog


@Composable
fun HomeScreen(
    context: Context,
    userId: String,
    navController: NavController,
    viewModel: MerchantViewModel = viewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.fetchMerchants(context)
        viewModel.loadMostOrderedFoods(context)
    }

    val mostOrderedFoods = viewModel.mostOrderedFoods
    val merchantId = remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            val profile = getProfile(context)
            merchantId.value = (profile as? MerchantProfile)?._id
        } catch (e: Exception) {
            Log.e("HomeScreen", "Error determining profile type: ${e.message}")
        }
    }

    if (viewModel.isLoading) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            CircularProgressIndicator(modifier = Modifier.size(48.dp))
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
                Content(
                    merchants = viewModel.merchants,
                    navController = navController,
                    context = context,
                    userId = userId,
                    mostOrderedFoods = mostOrderedFoods,
                    merchantId = merchantId.value // Pass merchantId here
                )
            }
        }
    }
}




@Composable
fun AppBar(context: Context, userId: String, navController: NavController) {
    val coroutineScope = rememberCoroutineScope()
    var isCartNotEmpty by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val cart = getCart(context, userId)
                isCartNotEmpty = cart != null && cart.items.isNotEmpty()
            } catch (_: Exception) {
            }
        }
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .height(56.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        TextField(
            value = "",
            onValueChange = {},
            label = { Text(text = "Search...", fontSize = 14.sp) },
            singleLine = true,
            leadingIcon = {
                Icon(
                    imageVector = Icons.Rounded.Search,
                    contentDescription = "Search",
                    modifier = Modifier.size(20.dp)
                )
            },
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .height(32.dp)
        )

        Spacer(modifier = Modifier.width(8.dp))

        IconButton(onClick = {
            coroutineScope.launch {
                try {
                    val cart = getCart(context, userId)
                    if (cart != null && isCartNotEmpty) {
                        navController.navigate("userCartItems/$userId")
                    } else {
                        Toast.makeText(context, "Your cart is empty", Toast.LENGTH_SHORT).show()
                    }
                } catch (_: Exception) {
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

        IconButton(onClick = {
            Toast.makeText(context, "Notifications clicked", Toast.LENGTH_SHORT).show()
        }) {
            Icon(imageVector = Icons.Outlined.Notifications, contentDescription = "Notification", tint = Color.White)
        }

        IconButton(onClick = {
            coroutineScope.launch {
                try {
                    val profile = getProfile(context)
                    when (profile) {
                        is MerchantProfile -> {
                            navController.navigate("profile/${profile._id}")
                        }
                        is UserProfile -> {
                            navController.navigate("profile/${profile._id}")
                            Log.d("HomeScreen", "Navigated to profile screen with userId: ${profile._id}")
                        }
                        else -> {
                            Toast.makeText(context, "Failed to load profile", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    Toast.makeText(context, "Error fetching profile", Toast.LENGTH_SHORT).show()
                }
            }
        }) {
            Icon(
                imageVector = Icons.Filled.AccountCircle,
                contentDescription = "Profile",
                tint = Color.White
            )
        }
    }
}



@Composable
fun Content(
    merchants: List<Merchant>,
    navController: NavController,
    context: Context,
    userId: String,
    mostOrderedFoods: List<MostOrderedFood>,
    merchantId: String?
) {
    Header(context = context)
    Spacer(modifier = Modifier.height(16.dp))
    Promotions(context = context, merchantId = merchantId, navController = navController) // Use merchantId to fetch promotions
    Spacer(modifier = Modifier.height(16.dp))

    if (merchants.isNotEmpty()) {
        CategorySection(merchants = merchants, navController = navController)
    }
    Spacer(modifier = Modifier.height(16.dp))
    MostOrderedSection(mostOrderedFoods = mostOrderedFoods, navController = navController, userId)
    Spacer(modifier = Modifier.height(16.dp))
    RecentOrdersSection(context, userId)
}






@Composable
fun Header(context: Context) {
    var balance by remember { mutableStateOf(0.0) }
    val coroutineScope = rememberCoroutineScope()

    // Dialog state
    var showDialog by remember { mutableStateOf(false) }
    var topUpAmount by remember { mutableStateOf("") }

    // Fetch balance when the screen is displayed
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            balance = getBalance(context) ?: 10.0
        }
    }

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
                    .clickable { showDialog = true } // Show the dialog on click
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
                    Text(
                        text = "$${"%.2f".format(balance)}", // Dynamically display balance
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Text(
                        text = "Top up",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 12.sp
                    )
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

    // Dialog for top-up
    if (showDialog) {
        Dialog(onDismissRequest = { showDialog = false }) {
            Card(
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Top Up Balance",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    TextField(
                        value = topUpAmount,
                        onValueChange = { topUpAmount = it },
                        label = { Text("Enter Amount") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        singleLine = true
                    )
                    Row(
                        horizontalArrangement = Arrangement.End,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Button(onClick = { showDialog = false }) {
                            Text("Cancel")
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(onClick = {
                            coroutineScope.launch {
                                try {
                                    val amount = topUpAmount.toDoubleOrNull()
                                    if (amount != null && amount > 0) {
                                        // Call top-up API
                                        val success = topUpBalance(context, amount)
                                        if (success) {
                                            balance += amount
                                            Toast.makeText(
                                                context,
                                                "Top-up successful!",
                                                Toast.LENGTH_SHORT
                                            ).show()
                                        } else {
                                            Toast.makeText(
                                                context,
                                                "Failed to top up. Try again!",
                                                Toast.LENGTH_SHORT
                                            ).show()
                                        }
                                    } else {
                                        Toast.makeText(
                                            context,
                                            "Invalid amount. Please enter a valid number.",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    }
                                } catch (e: Exception) {
                                    Toast.makeText(
                                        context,
                                        "Error during top-up: ${e.message}",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                                showDialog = false
                            }
                        }) {
                            Text("Top Up")
                        }
                    }
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
fun Promotions(context: Context, merchantId: String?, navController: NavController) {
    val coroutineScope = rememberCoroutineScope()
    var promotions by remember { mutableStateOf<List<CommonPromotion>>(emptyList()) }
    var merchants by remember { mutableStateOf<Map<String, String>>(emptyMap()) } // Map of merchantId to storeName
    var isLoading by remember { mutableStateOf(true) }
    var userRole by remember { mutableStateOf<String?>(null) }

    // Determine user role
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            userRole = try {
                val profile = getProfile(context)
                if (profile is MerchantProfile) "Merchant" else "User"
            } catch (e: Exception) {
                null
            }
        }
    }

    // Fetch promotions and merchant data
    LaunchedEffect(merchantId) {
        coroutineScope.launch {
            try {
                val allMerchants = getAllMerchants(context)
                merchants = allMerchants.associate { it.id to it.storeName }

                promotions = if (merchantId != null) {
                    getMerchantPromotions(context, merchantId).map { it.toCommonPromotion() }
                } else {
                    getAllAvailablePromotions(context).map { it.toCommonPromotion() }
                }

                isLoading = false
            } catch (e: Exception) {
                Log.e("Promotions", "Error fetching promotions or merchants: ${e.message}")
                isLoading = false
            }
        }
    }

    if (isLoading) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
        ) {
            CircularProgressIndicator()
        }
    } else if (promotions.isEmpty()) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
        ) {
            Text(
                "No promotions available",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = MaterialTheme.colorScheme.onSurface
                )
            )
        }
    } else {
        LazyRow(
            modifier = Modifier.height(160.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(promotions) { promotion ->
                val title = promotion.name ?: "Unnamed Item"
                val subtitle = "Discount"
                val header = "${promotion.discount}% OFF"
                val storeName = merchants[promotion.merchantId] // Lookup storeName using merchantId

                PromotionItem(
                    title = title,
                    subtitle = subtitle,
                    header = header,
                    backgroundColor = MaterialTheme.colorScheme.primary,
                    imagePainter = painterResource(id = R.drawable.promotion),
                    onClick = {
                        if (userRole == "Merchant" && merchantId != null) {
                            // Navigate to merchant promotions screen
                            navController.navigate("merchantPromotionsScreen/$merchantId")
                        } else {
                            if (storeName != null) {
                                // Navigate to menu for the associated merchant
                                navController.navigate(
                                    "userMenu/$storeName/${promotion.merchantId}/${getIdFromJwt(context)}"
                                )
                            } else {
                                Toast.makeText(
                                    context,
                                    "Store name not available for this promotion",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun PromotionItem(
    title: String,
    subtitle: String,
    header: String,
    backgroundColor: Color,
    imagePainter: Painter,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(300.dp)
            .clickable { onClick() },
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
                Text(
                    text = title,
                    fontSize = 14.sp,
                    color = Color.White
                )
                Text(
                    text = subtitle,
                    fontSize = 16.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = header,
                    fontSize = 28.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
            Image(
                painter = imagePainter,
                contentDescription = "",
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
    Log.d("CategorySection", "storeTypes: $storeTypes")

    Column(
        modifier = Modifier.padding(horizontal = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Category", style = MaterialTheme.typography.headlineSmall)
            TextButton(onClick = { navController.navigate("map") }) {
                Text(text = "Map", color = MaterialTheme.colorScheme.primary)
            }
        }
        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            items(storeTypes) { storeType ->
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
fun RecentOrdersSection(context: Context, userId: String) {
    val coroutineScope = rememberCoroutineScope()
    var recentOrders by remember { mutableStateOf<List<UserOrder>?>(null) }
    var message by remember { mutableStateOf("Loading your recent orders...") }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(userId) {
        isLoading = true
        try {
            val orders = getRecentUserOrders(context, userId)
            recentOrders = orders?.sortedByDescending { it.orderDate } // Sort orders by date in descending order (newest to oldest)
            message = if (orders.isNullOrEmpty()) "You haven't placed any orders yet." else ""
        } catch (e: Exception) {
            Log.e("RecentOrdersSection", "Error fetching user orders: ${e.message}")
            message = "Failed to load recent orders. Please try again."
        } finally {
            isLoading = false
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Your Recent Orders",
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(16.dp)
            )
        } else if (!recentOrders.isNullOrEmpty()) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(recentOrders!!) { order ->
                    RecentOrderCard(order = order)
                }
            }
        } else {
            Text(
                text = message,
                style = MaterialTheme.typography.bodyLarge,
                color = Color.Gray,
                modifier = Modifier.padding(top = 16.dp)
            )
        }
    }
}

@Composable
fun RecentOrderCard(order: UserOrder) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    // State for each item tied to both `orderId` and `menuItemId`
    val itemRatings = remember { mutableStateMapOf<String, Int>() }
    val itemReviews = remember { mutableStateMapOf<String, String>() }
    val itemSubmitted = remember { mutableStateMapOf<String, Boolean>() }

    // Load reviews on first render
    LaunchedEffect(order.id) {
        coroutineScope.launch {
            order.items.forEach { item ->
                val uniqueKey = "${order.id}_${item.menuItem?.id ?: ""}"
                item.menuItem?.id?.let { menuItemId ->
                    val savedReview = getReviewForMenuItem(context, order.id, menuItemId)
                    savedReview?.let {
                        itemRatings[uniqueKey] = it.rating
                        itemReviews[uniqueKey] = it.review_text ?: ""
                        itemSubmitted[uniqueKey] = true
                    }
                }
            }
        }
    }

    Card(
        modifier = Modifier
            .width(240.dp)
            .wrapContentHeight()
            .padding(8.dp),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "Order #${order.id.takeLast(7)}",
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = "Total: $${String.format("%.2f", order.totalPrice)}",
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.secondary
            )

            Divider(color = Color.Gray, thickness = 1.dp)

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 180.dp) // Constrain maximum height
                    .verticalScroll(rememberScrollState())
            ) {
                Column {
                    order.items.forEach { item ->
                        val uniqueKey = "${order.id}_${item.menuItem?.id ?: ""}"

                        if (itemSubmitted[uniqueKey] == true) {
                            NonEditableReviewCard(
                                menuItemName = item.menuItem?.itemName ?: "Unknown Item",
                                price = item.menuItem?.price ?: 0.0,
                                rating = itemRatings[uniqueKey] ?: 0,
                                reviewText = itemReviews[uniqueKey] ?: ""
                            )
                        } else {
                            EditableReviewCard(
                                menuItem = item,
                                rating = itemRatings[uniqueKey] ?: 0,
                                reviewText = itemReviews[uniqueKey] ?: "",
                                onRatingChanged = { newRating -> itemRatings[uniqueKey] = newRating },
                                onReviewTextChanged = { newReview -> itemReviews[uniqueKey] = newReview },
                                onSubmit = {
                                    coroutineScope.launch {
                                        val success = postReview(
                                            context = context,
                                            orderId = order.id,
                                            menuItemId = item.menuItem?.id ?: "",
                                            rating = itemRatings[uniqueKey] ?: 0,
                                            reviewText = itemReviews[uniqueKey] ?: ""
                                        )
                                        if (success) {
                                            itemSubmitted[uniqueKey] = true
                                            Toast.makeText(context, "Review submitted!", Toast.LENGTH_SHORT).show()
                                        } else {
                                            Toast.makeText(context, "Failed to submit review.", Toast.LENGTH_SHORT).show()
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
fun EditableReviewCard(
    menuItem: UserOrderItem, // Accept UserOrderItem instead of OrderItem
    rating: Int,
    reviewText: String,
    onRatingChanged: (Int) -> Unit,
    onReviewTextChanged: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(
            text = "${menuItem.menuItem?.itemName ?: "Unknown Item"}",
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            text = "Price: $${String.format("%.2f", menuItem.menuItem?.price ?: 0.0)} | Qty: ${menuItem.quantity}",
            style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
        )

        RatingBar(
            currentRating = rating,
            onRatingChanged = onRatingChanged,
            enabled = true
        )

        TextField(
            value = reviewText,
            onValueChange = onReviewTextChanged,
            label = { Text("Write a review") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = onSubmit,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Submit Review")
        }
    }
}

@Composable
fun NonEditableReviewCard(
    menuItemName: String,
    price: Double,
    rating: Int,
    reviewText: String
) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(
            text = menuItemName,
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            text = "Price: $${String.format("%.2f", price)}",
            style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
        )

        StaticRatingBar(currentRating = rating)

        Text(
            text = "Review: $reviewText",
            style = MaterialTheme.typography.bodySmall,
            color = Color.Gray
        )
    }
}


@Composable
fun RatingBar(
    currentRating: Int,
    onRatingChanged: (Int) -> Unit,
    enabled: Boolean
) {
    Row(
        modifier = Modifier.padding(top = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in 1..5) {
            val starColor = if (i <= currentRating) Color(0xFF4CAF50) else Color.Gray
            Icon(
                imageVector = if (i <= currentRating) Icons.Filled.Star else Icons.Outlined.Star,
                contentDescription = null,
                modifier = Modifier
                    .size(24.dp)
                    .clickable(enabled) { onRatingChanged(i) },
                tint = starColor
            )
        }
    }
}

@Composable
fun StaticRatingBar(currentRating: Int) {
    Row(
        modifier = Modifier.padding(top = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in 1..5) {
            val starColor = if (i <= currentRating) Color(0xFF4CAF50) else Color.Gray
            Icon(
                imageVector = if (i <= currentRating) Icons.Filled.Star else Icons.Outlined.Star,
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = starColor
            )
        }
    }
}




@Composable
fun MostOrderedSection(
    mostOrderedFoods: List<MostOrderedFood>,
    navController: NavController,
    userId: String
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp) // Adds space around the section
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Popular",
                style = MaterialTheme.typography.headlineSmall
            )
            TextButton(onClick = {}) {
                Text(text = "See All", color = MaterialTheme.colorScheme.primary)
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp), // Fixes the height of the section
            contentAlignment = Alignment.Center
        ) {
            if (mostOrderedFoods.isEmpty()) {
                Text(
                    text = "No most ordered foods available",
                    style = MaterialTheme.typography.bodyMedium.copy(color = Color.Gray),
                    textAlign = TextAlign.Center
                )
            } else {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(mostOrderedFoods) { food ->
                        MerchantBestSellerItem(
                            imagePainter = painterResource(id = R.drawable.jollof), // Replace with dynamic image if available
                            title = food.name,
                            price = "\$${String.format("%.2f", food.price)}",
                            discountPercent = 0,
                            onClick = {
                                navController.navigate(
                                    "userMenu/${food.storeName}/${food.merchantId}/$userId"
                                )
                            }
                        )
                    }
                }
            }
        }
    }
}
