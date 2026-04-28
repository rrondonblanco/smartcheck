// SmartCheck Probe — root build script
//
// Sólo declara los plugins del proyecto multi-módulo. La config real está en :app.

plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.20" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20" apply false
}
