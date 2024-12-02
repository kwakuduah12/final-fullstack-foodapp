package com.example.homedasher_prod

import MerchantHomeScreen
import UserMenuScreen
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.homedasher_prod.ui.theme.HomeDasherProdTheme

import android.util.Log
import androidx.navigation.NavType
import androidx.navigation.navArgument

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HomeDasherProdTheme {
                MainContent()
            }
        }
    }

    @Composable
    fun MainContent() {
        val navController = rememberNavController()
        val context = LocalContext.current
        val startDestination = determineStartDestination(context)

        // State to hold cart information, now CartData type
        val cartState = remember { mutableStateOf<CartData?>(null) }

        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = startDestination,
                modifier = Modifier.padding(innerPadding)
            ) {
                composable("home") {
                    HomeScreen(
                        context = LocalContext.current,
                        userId = cartState.value?.user_id ?: "",
                        navController = navController
                    )
                }
                composable("login") { LoginScreen(navController) }
                composable("register") { RegisterScreen(navController) }
                composable("merchantRegistration") { MerchantRegistrationScreen(navController) }
                composable("userHomeScreen") {
                    HomeScreen(
                        context = LocalContext.current,
                        userId = cartState.value?.user_id ?: "",
                        navController = navController
                    )
                }
                composable("merchantHomeScreen") {
                    MerchantHomeScreen(
                        navController,
                        context = LocalContext.current
                    )
                }
                composable("category/{storeType}") { backStackEntry ->
                    val storeType = backStackEntry.arguments?.getString("storeType")
                    if (storeType != null) {
                        UserCategoryScreen(
                            context = LocalContext.current,
                            storeType = storeType,
                            navController = navController,
                            userId = cartState.value?.user_id ?: ""
                        )
                    } else {
                        Log.e("MainContent", "storeType is null")
                    }
                }
                composable(
                    "userMenu/{storeName}/{merchantId}/{userId}",
                    arguments = listOf(
                        navArgument("storeName") { type = NavType.StringType },
                        navArgument("merchantId") { type = NavType.StringType },
                        navArgument("userId") { type = NavType.StringType }
                    )
                ) { backStackEntry ->
                    val storeName = backStackEntry.arguments?.getString("storeName")
                    val merchantId = backStackEntry.arguments?.getString("merchantId")
                    val userId = backStackEntry.arguments?.getString("userId")

                    if (storeName != null && merchantId != null && userId != null) {
                        UserMenuScreen(
                            context = LocalContext.current,
                            merchantId = merchantId,
                            userId = userId
                        )
                    } else {
                        Log.e("MainContent", "Required arguments are null")
                    }
                }
                // Add UserCartItems route
                composable("userCartItems/{userId}", arguments = listOf(navArgument("userId") { type = NavType.StringType })) { backStackEntry ->
                    val userId = backStackEntry.arguments?.getString("userId")
                    if (userId != null) {
                        UserCartItems(userId = userId)
                    } else {
                        Log.e("MainContent", "userId is null")
                    }
                }
            }
        }
    }

    private fun determineStartDestination(context: Context): String {
        val sharedPreferences: SharedPreferences = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val isAuthenticated = checkAuthenticationStatus(context)
        val lastDestination = sharedPreferences.getString("last_destination", "home") ?: "home"

        return if (isAuthenticated) lastDestination else "login"
    }
}
