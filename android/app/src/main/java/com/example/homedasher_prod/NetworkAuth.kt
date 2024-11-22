package com.example.homedasher_prod

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey


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