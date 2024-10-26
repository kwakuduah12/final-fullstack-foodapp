package com.example.homedasher_prod

import android.content.Context
import android.widget.Toast
import androidx.navigation.NavHostController
import io.ktor.client.*
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json


@Serializable
data class LoginRequest(val email: String, val password: String)

@Serializable
data class RegisterRequest(val email: String, val name: String, val password: String, val confirmPassword: String)

object HttpClientProvider {
    val instance: HttpClient by lazy {
        HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
    }
}
val client = HttpClientProvider.instance

fun loginUser(email: String, password: String, context: Context, navController: NavHostController) {
    val request = LoginRequest(email, password)

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val response: HttpResponse = client.post("http://10.0.2.2:4000/user/login") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }

            withContext(Dispatchers.Main) {
                if (response.status == HttpStatusCode.OK) {
                    Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                    navController.navigate("home") {
                        popUpTo("login") {
                            inclusive = true
                        }
                    }
                } else {
                    Toast.makeText(context, "Login failed: ${response.status.description}", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

fun registerUser(email: String, name: String, password: String, confirmPassword: String, context: Context) {
    val request = RegisterRequest(email, name, password, confirmPassword)

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val response: HttpResponse = client.post("http://10.0.2.2:4000/user/signup") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }

            withContext(Dispatchers.Main) {
                if (response.status == HttpStatusCode.OK) {
                    Toast.makeText(context, "Registration successful!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Registration failed: ${response.status.description}", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}