// SmartCheck Probe — settings
//
// Si el equipo TI quiere mover este proyecto a su monorepo, sólo hay que
// renombrar `rootProject.name` y mantener el módulo `:app`.

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SmartCheckProbe"
include(":app")
