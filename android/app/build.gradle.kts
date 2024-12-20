plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    kotlin("plugin.serialization") version "1.9.0"
}

android {
    namespace = "com.example.homedasher_prod"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.homedasher_prod"
        minSdk = 21
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.firebase.crashlytics.buildtools)
    implementation("com.google.android.gms:play-services-location:21.3.0")
    val nav_version = "2.8.2"

    implementation("androidx.navigation:navigation-compose:$nav_version")
    implementation("com.google.accompanist:accompanist-systemuicontroller:0.30.1")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    implementation("io.ktor:ktor-client-core:2.3.2")
    implementation("io.ktor:ktor-client-cio:2.3.2")
    implementation("io.ktor:ktor-client-content-negotiation:2.3.2")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.2")
    implementation("androidx.security:security-crypto:1.1.0-alpha03")
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.foundation.android)
    implementation ("io.ktor:ktor-client-okhttp:2.0.0")
    implementation ("com.squareup.okhttp3:okhttp:4.9.3")
    implementation("io.ktor:ktor-client-okhttp:2.x.x")
    implementation("io.ktor:ktor-client-core:2.x.x")
    implementation("com.squareup.okhttp3:okhttp:4.x.x")
    implementation("com.auth0.android:jwtdecode:2.0.1")
    implementation("io.coil-kt:coil-compose:2.2.2")
    implementation("com.google.maps.android:maps-compose:6.2.1")
    implementation ("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.compose.material3:material3:1.2.0") // Or latest stable version
    implementation("androidx.compose:compose-bom:2023.10.00") // Replace with the latest BOM version
    implementation ("androidx.compose.material3:material3")
    implementation(libs.maps.compose)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}
