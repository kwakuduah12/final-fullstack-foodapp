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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.homedasher_prod.ui.theme.HomeDasherProdTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HomeDasherProdTheme {
                val navController = rememberNavController()
                val context = LocalContext.current
                val startDestination = determineStartDestination(context)

                LaunchedEffect(Unit) {
                    navController.navigate(startDestination) {
                        popUpTo(startDestination) { inclusive = true }
                    }
                }

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    NavigationComponent(
                        navController = navController,
                        modifier = Modifier.padding(innerPadding),
                        startDestination = startDestination
                    )
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

@Composable
fun NavigationComponent(navController: NavHostController, modifier: Modifier = Modifier, startDestination: String) {
    NavHost(navController, startDestination = startDestination, modifier = modifier) {
        composable("home") { HomeScreen(context = LocalContext.current, navController) }
        composable("login") { LoginScreen(navController) }
        composable("register") { RegisterScreen(navController) }
        composable("merchantRegistration") { MerchantRegistrationScreen(navController) }
        composable("userHomeScreen") { HomeScreen(context = LocalContext.current, navController) }
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
                )
            }
        }
        composable("userMenu/{storeName}/{merchantId}") { backStackEntry ->
            val storeName = backStackEntry.arguments?.getString("storeName")
            val merchantId = backStackEntry.arguments?.getString("merchantId")

            if (storeName != null && merchantId != null) {
                UserMenuScreen(
                    context = LocalContext.current,
                    merchantId = merchantId,
                )
            }
        }
    }
}
@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    HomeDasherProdTheme {
        HomeScreen(context = LocalContext.current, navController = rememberNavController())
    }
}