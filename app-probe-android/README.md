# SmartCheck Probe — APK Android

> APK liviano nativo que mide salud real de batería en Android y la reporta al backend SmartCheck. Resuelve la limitación del navegador (`navigator.getBattery()` no expone salud en ningún browser).

- **Lenguaje:** Kotlin
- **UI:** Jetpack Compose
- **Min SDK:** 26 (Android 8.0 Oreo)
- **Target SDK:** 34 (Android 14)
- **Tamaño esperado:** ~3 MB
- **Permisos:** sólo `INTERNET` + `BATTERY_STATS` (este último ni siquiera muestra prompt al usuario)

## Flujo end-to-end

1. Cliente está en SmartCheck Web haciendo el test de batería en su Android.
2. La Web detecta `os === 'Android'` y `capabilities` incluye `battery-probe`, muestra QR con `smartcheck://probe?sessionId=ABC123`.
3. Cliente escanea con la cámara nativa.
4. Si tiene la app, se abre directo. Si no, le aparece prompt para instalarla (descarga el APK desde el release de GitHub).
5. Pantalla 1: **Consent** — consentimiento explícito de qué se mide y a dónde se envía.
6. Pantalla 2: **Measuring** — animación de 1.2s + lectura real (~50ms) + upload al backend.
7. Pantalla 3: **Done** — muestra healthPct, ciclos, temperatura. Auto-cierra a los 5 segundos.
8. La Web está poleando `/api/probe/:sessionId/status` cada 3s; cuando ve `state: 'done'` avanza.

## Cómo se mide la salud

```
healthPct = (charge_full / charge_full_design) * 100
```

Donde:

- `charge_full` viene de `/sys/class/power_supply/battery/charge_full` (capacidad actual en µAh)
- `charge_full_design` viene de `/sys/class/power_supply/battery/charge_full_design` (capacidad nominal de fábrica en µAh)

Si esa ruta no es accesible (algunos OEMs raros), la lectura cae a `BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER`. En ese caso, el campo `warnings` lo refleja y el backend puede tratar el reading como aproximado.

Otros datos: ciclos (`/sys/class/power_supply/battery/cycle_count`), temperatura, voltaje, tecnología (Li-ion/Li-poly), corriente instantánea — todos vía `BatteryManager` y `ACTION_BATTERY_CHANGED`.

## Compilar local

Necesitás Android Studio Hedgehog (2023.1.1) o más nuevo, o Gradle 8.9+ con JDK 17.

```bash
cd app-probe-android
./gradlew assembleDebug
# APK en: app/build/outputs/apk/debug/app-debug.apk
```

Si es la primera vez (no hay `gradlew`), generalo con:

```bash
gradle wrapper --gradle-version 8.9
```

## Compilar en GitHub Actions

El workflow `.github/workflows/build-apk.yml` corre automáticamente en:

- push a `main` que toque `app-probe-android/**`
- PRs a `main`
- `workflow_dispatch` (manual desde la pestaña Actions)
- cuando se publica un Release (adjunta el APK al release)

El APK queda como artifact `smartcheck-probe-debug` en cada run, descargable 30 días.

## Instalar en el Note 20 Ultra de Rob (manual, mientras no haya release)

```bash
# Desde la Mac, con el teléfono conectado por USB y debugging activado
adb install -r app/build/outputs/apk/debug/app-debug.apk

# O desde el teléfono: Ajustes → Seguridad → Permitir orígenes desconocidos,
# después abrir el APK desde Files / Drive.
```

Para probar el deep-link sin pasar por la web:

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "smartcheck://probe?sessionId=TEST_$(date +%s)" \
  cl.reuse.smartcheck.probe.debug/cl.reuse.smartcheck.probe.MainActivity
```

## Configurar la URL del backend

Por default el APK apunta a `https://10.0.2.2:8768` (loopback del emulador). Para apuntarlo al server local de Rob:

1. **En desarrollo:** edita `app/build.gradle.kts` línea `resValue(... "smartcheck_api_base", ...)` con tu IP LAN.
2. **En producción:** TI configurará un buildType que apunte a `https://api.smartcheck.reuse.cl`.

Alternativa rápida sin recompilar: `adb shell setprop` no funciona porque leemos desde resources. La forma correcta es reemplazar el valor en `strings.xml` o sobrescribirlo en un buildType.

## Estructura

```
app-probe-android/
├── build.gradle.kts                 # Plugins root
├── settings.gradle.kts              # Modules
├── gradle.properties                # JVM / AndroidX
├── gradle/wrapper/                  # Wrapper props (jar lo genera CI)
├── .github/workflows/build-apk.yml  # CI
├── .gitignore
└── app/
    ├── build.gradle.kts             # App config
    ├── proguard-rules.pro
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/cl/reuse/smartcheck/probe/
        │   ├── MainActivity.kt        # Single activity, deep-link
        │   ├── ProbeViewModel.kt      # State machine + upload
        │   ├── BatteryReader.kt       # Lee BatteryManager + sysfs
        │   ├── DeviceInfo.kt          # Build.MANUFACTURER/MODEL/etc
        │   ├── ApiClient.kt           # OkHttp + retry + JSON
        │   └── ui/
        │       ├── Theme.kt
        │       ├── ConsentScreen.kt
        │       ├── MeasuringScreen.kt
        │       └── DoneScreen.kt      # incluye ErrorScreen
        └── res/
            ├── values/colors.xml      # Paleta Reuse (ink-900, mint-500, canvas)
            ├── values/strings.xml     # Strings es-CL
            ├── values/themes.xml
            ├── xml/network_security_config.xml  # acepta autofirmados en debug
            └── mipmap-anydpi-v26/ic_launcher*.xml
```

## Decisiones técnicas

| Tema | Decisión | Motivo |
|---|---|---|
| Framework UI | Compose | Menos código, recomendado por Google, mejor para apps de pocas pantallas. |
| HTTP | OkHttp puro | Retrofit suma 200KB+ por 1 endpoint. JSON con `org.json`. |
| Arquitectura | 1 ViewModel, 1 Repository implícito | Clean-arch para 3 pantallas es overkill. |
| DI | Ninguno | Hilt suma compilación y complejidad. Cuando la app crezca, TI puede agregar. |
| Persistencia | Ninguna | El APK no guarda nada — vive sólo durante la medición. |
| Crash reporting | Ninguno | Decisión explícita en spec: sin terceros. TI puede agregar Sentry self-hosted. |
| Tests | No incluidos en MVP | Scope mínimo. La lógica de `BatteryReader` se prueba mejor en device real. |

## Limitaciones conocidas

- **Algunos OEMs no exponen `/sys/class/power_supply/battery/charge_full`** — lo manejamos con `warnings: ["charge_full_unavailable"]`. La salud queda `null`.
- **`cycle_count` falta en muchos Samsung pre-One UI 5** — manejado igual con warning.
- **Cert autofirmado:** sólo se acepta en debug build. Release usa truststore del sistema.
- **No hay auth en el endpoint** — el `sessionId` es único y opaco, pero un atacante con el sessionId podría inyectar datos. Productivo: HMAC del payload con secret compartido al instalar.

## Siguientes pasos (post-MVP)

1. Firma con keystore real (TI configura GitHub Secrets).
2. Distribución vía Play Store interna o link de descarga corto.
3. HMAC de payload para evitar inyección con sessionId secuestrado.
4. Test instrumentado en al menos 5 modelos (Samsung, Xiaomi, Motorola, OPPO, Pixel).
5. Telemetría mínima de éxito/fallo de lectura sysfs (privacy-preserving, sin device IDs).
