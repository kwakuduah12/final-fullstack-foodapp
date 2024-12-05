package com.example.homedasher_prod

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.auth0.android.jwt.JWT


fun saveJwtSecurely(token: String, role: String, context: Context) {
    val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        "jwt_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    sharedPreferences.edit().apply {
        putString("jwt", token)
        putString("role", role)
        apply()
    }
}

fun getStoredJwt(context: Context): String? {
    val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        "jwt_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    return sharedPreferences.getString("jwt", null)
}

fun checkAuthenticationStatus(context: Context): Boolean {
    val jwt = getStoredJwt(context)
    val role = getStoredRole(context)

    return jwt != null && role != null
}

fun getStoredRole(context: Context): String? {
    val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        "jwt_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    return sharedPreferences.getString("role", null)
}

fun performLogout(context: Context) {
    val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        "jwt_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    sharedPreferences.edit().apply {
        remove("jwt")
        remove("role")
        apply()
    }
}


fun isJwtValid(jwt: String?): Boolean {
    return try {
        val decodedJWT = jwt?.let { JWT(it) }
        // Check if the token is expired with a 10-second leeway
        !decodedJWT?.isExpired(10)!!
    } catch (e: Exception) {
        false
    }
}

fun getIdFromJwt(context: Context): String? {
    val jwt = getStoredJwt(context) // Retrieve the stored JWT token
    return try {
        val decodedJWT = jwt?.let { JWT(it) }
        val id = decodedJWT?.getClaim("id")?.asString() // "id" is the key for the user ID
        if (id.isNullOrEmpty()) {
            Log.e("JWTError", "ID claim not found or empty in JWT.")
            null
        } else {
            Log.d("JWTInfo", "Extracted ID: $id")
            id
        }
    } catch (e: Exception) {
        Log.e("JWTError", "Error decoding JWT: ${e.message}")
        null
    }
}