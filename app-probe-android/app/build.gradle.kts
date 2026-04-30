// SmartCheck Probe — :app
//
// APK liviano (~2-5 MB). Sin Retrofit, sin Gson, sin DI: stdlib + Compose + OkHttp.

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "cl.reuse.smartcheck.probe"
    compileSdk = 34

    defaultConfig {
        applicationId = "cl.reuse.smartcheck.probe"
        minSdk = 26                 // Android 8.0 Oreo — cubre ~99% del parque LATAM 2026
        targetSdk = 34
        versionCode = 1
        versionName = "0.1.0"
        // El backend default; se puede sobreescribir por buildType o resource
        // Hostname mDNS/Bonjour del Mac de Rob. No depende de la IP LAN — sigue funcionando
        // aunque cambie de WiFi. Cuando esté hosting productivo en TI, cambiar a smartcheck.reuse.cl.
        // El APK debug confía en certs autofirmados (ver ApiClient.applyDebugInsecureTrust).
        resValue("string", "smartcheck_api_base", "https://macbook-pro-de-roberto-2.local:8768")
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
            isDebuggable = true
            // Útil para que el APK debug confíe en certs autofirmados sin pelear con Network Security Config.
            // (En release esto NO se aplica.)
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // por ahora — TI configurará keystore real
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    // Kotlin 1.9.24 → Compose Compiler 1.5.14 (mapping oficial JetBrains)
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Compose BOM 2024.06.00 → ships compose-ui 1.6.8, ABI compatible con compiler 1.5.14
    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)

    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.6")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    implementation("com.squareup.okhttp3:okhttp:4.12.0")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
