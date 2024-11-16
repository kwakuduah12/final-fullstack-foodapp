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
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.*
import android.util.Log
import androidx.navigation.navArgument
import com.example.homedasher_prod.ui.theme.HomeDasherProdTheme

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
                    val userId = cartState.value?.user_id ?: ""
                    val viewModel: MerchantViewModel = viewModel()

                    MerchantHomeScreen(
                        context = LocalContext.current,
                        userId = userId,
                        navController = navController,
                        viewModel = viewModel
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
                composable("userCartItems/{userId}", arguments = listOf(navArgument("userId") { type = NavType.StringType })) { backStackEntry ->
                    val userId = backStackEntry.arguments?.getString("userId")
                    if (userId != null) {
                        UserCartItems(userId = userId)
                    } else {
                        Log.e("MainContent", "userId is null")
                    }
                }
                composable(
                    "profile/{profileId}",
                    arguments = listOf(navArgument("profileId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val profileId = backStackEntry.arguments?.getString("profileId")
                    if (profileId != null) {
                        ProfileScreen(profileId = profileId, context = LocalContext.current)
                    } else {
                        Log.e("MainContent", "profileId is null")
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