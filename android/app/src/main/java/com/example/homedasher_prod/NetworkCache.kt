package com.example.homedasher_prod

import android.content.Context
import io.ktor.client.*
import io.ktor.client.engine.okhttp.OkHttp
import okhttp3.Cache
import java.io.File

fun provideHttpClient(context: Context): HttpClient {
    val cacheSize = 10 * 1024 * 1024 // 10 MB
    val cacheDir = File(context.cacheDir, "http_cache")
    val cache = Cache(cacheDir, cacheSize.toLong())

    val okHttpClient = okhttp3.OkHttpClient.Builder()
        .cache(cache)
        .build()

    return HttpClient(OkHttp) {
        engine {
            preconfigured = okHttpClient
        }
    }
}