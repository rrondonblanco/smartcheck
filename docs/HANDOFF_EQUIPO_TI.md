# SmartCheck — Handoff al equipo de TI de Reuse

> **Versión:** 0.1.0-mvp · 27 de abril de 2026
> **Para:** equipo de TI de Reuse que va a construir el producto productivo
> **De:** Roberto Rondón (rrondon@reuse.cl) · Product Designer UX/UI
> **Acompañado por:** Cowork (asistente AI)

Este documento es el manual de bienvenida para el equipo técnico que va a tomar el prototipo y construir el producto. Léelo de principio a fin antes de tocar código — vas a ahorrarte mucho tiempo.

---

## 1. ¿Qué es este repositorio?

SmartCheck es un módulo de evaluación técnica de dispositivos (smartphone, tablet, futuro: notebook) que se integra al flujo Trade-In de Reuse. Reemplaza a PhoneCheck.

**Lo que estás recibiendo es un prototipo MVP con flujo end-to-end funcional**, no un producto productivo. Diseñado para:

- Validar la experiencia del operador y del cliente final con datos reales en el navegador.
- Servir de blueprint para que tu equipo construya el productivo manteniendo la misma lógica de negocio.
- Demostrar a partners (Falabella, MacStore, Samsung, Xiaomi) el valor diferencial frente a PhoneCheck.

**No es producto:** persistencia en memoria, mock de validaciones, sin autenticación, sin observabilidad real, sin hardening de seguridad.

---

## 2. Estructura del repositorio

```
SmartCheck/
├── README.md                              ← arrancar acá
├── app v2.html                            ← frontend monolito (vivo, lo que se sirve)
├── app-v2/                                ← versión modular (preparación para refactor)
│   ├── app.jsx
│   ├── shell.jsx
│   ├── screens-a.jsx                      (Welcome, DeviceType, Imei, ImeiCheck)
│   ├── screens-b.jsx                      (Tests: touch, display, audio, camera...)
│   └── screens-c.jsx                      (Sensors, Battery, Connectivity, Buttons, Summary, Report)
├── src-v2/icons.jsx                       ← iconografía
├── server/                                ← backend MVP (lo creamos el 27/abr)
│   ├── index.js                           (Express + endpoints)
│   ├── package.json
│   ├── README.md                          (cómo correrlo)
│   └── db/
│       └── tacs.json                      (mock de 32 TACs reales)
├── tools/                                 ← infra de desarrollo local
│   ├── serve_https.rb                     (server HTTPS con certs autofirmados)
│   ├── cert.pem
│   └── key.pem
├── design_handoff_smartcheck/             ← handoff visual de Claude Design
│   ├── README.md                          (design tokens, tipografía, colores)
│   ├── app/                               (HTMLs de referencia de cada pantalla)
│   ├── landing/                           (sitio público)
│   ├── brand/
│   └── screenshots/
└── docs/                                  ← documentación estratégica y técnica
    ├── SmartCheck_BatteryHealth_Analisis_v1.docx
    ├── SmartCheck_BatteryHealth_Analisis_v1_1.docx   (versión vigente)
    ├── SmartCheck_Arquitectura_Tecnica_v1.docx       (la biblia técnica)
    ├── MAPA_CODIGO_ACTUAL.md                         (auditoría línea por línea)
    └── diagrams/                                      (4 SVG de arquitectura)
```

**Empieza leyendo:** `README.md` → `docs/SmartCheck_Arquitectura_Tecnica_v1.docx` → `docs/MAPA_CODIGO_ACTUAL.md`. Con eso tienes 90% del contexto.

---

## 3. Qué hace funcionar el prototipo hoy

| Pieza | Estado | Implementado en |
|---|---|---|
| Flujo de 15 pantallas (welcome → reporte) | Funcional, persistido en localStorage | `app v2.html` líneas 1654–1690 |
| Validación IMEI (Luhn + OCR Tesseract) | Funcional | `app v2.html` líneas 365–472 |
| Lookup TAC → device info | **Funcional con mock de 32 modelos** | `server/index.js` + `server/db/tacs.json` |
| Validaciones IMEI (6 checks: GSMA, robo, carrier, iCloud/FRP, garantía, ICCID) | **Mock determinístico** (mismo IMEI = misma respuesta) | `server/index.js` `deterministicCheck()` |
| Persistencia de sesiones y reportes | In-memory `Map` (se pierde al reiniciar el server) | `server/index.js` |
| Tests de hardware (touch, display, audio, cámara, sensores, conectividad, botones) | Funcionales con APIs reales del navegador | `app v2.html` líneas 633–1330 |
| Test de batería | Solo `navigator.getBattery()` (level + charging, no health) | `app v2.html` líneas 1095–1173 |
| Score y reporte | Calculado real, persistencia mock | `app v2.html` líneas 1335–1492 |
| Servidor HTTPS local con certs autofirmados | Funcional para pruebas en LAN | `tools/serve_https.rb` |

---

## 4. Qué falta para llegar a producción (orden recomendado de ataque)

### 4.1 Crítico — bloqueante para piloto

| # | Tarea | Esfuerzo aprox |
|---|---|---|
| 1 | Migrar `app v2.html` → Next.js 14 + TypeScript con los componentes ya extraídos en `app-v2/` | 2 semanas |
| 2 | Migrar `server/` → stack productivo (NestJS o Spring si es lo de Reuse) + PostgreSQL | 2-3 semanas |
| 3 | Poblar la DB TAC real (contrato GSMA + Sickw como fallback) | 1 semana + acuerdo comercial |
| 4 | Implementar las 6 integraciones de validación reales (GSMA, blacklist LATAM, Apple GSX, Samsung GSPN, ICCID cross) | 3-4 semanas |
| 5 | Integración con sistema Trade-In productivo (formato del código de evaluación, webhook o pull, partners) | Coordinar con equipo Trade-In |
| 6 | Auth: JWT con scope por `partnerId` para multi-tenancy | 1 semana |
| 7 | Hosting productivo (Vercel/AWS para front, Railway/RDS para backend), dominio (`smartcheck.reuse.cl`), certificados Let's Encrypt | 1 semana |
| 8 | Hardening: CSP, HSTS, rate-limiting (60/min en /lookup), input validation (zod o equivalente), structured logging, Sentry, SOC 2 readiness | 2 semanas |

### 4.2 Diferencial — necesario para el pitch comercial

| # | Tarea | Esfuerzo aprox |
|---|---|---|
| 9 | Rama de batería iOS: OCR sobre screenshot de Ajustes → Batería → Salud (Tesseract.js ya cargado) | 1 semana |
| 10 | SmartCheck Probe APK Android: Kotlin nativo, lee `BatteryManager` y `/sys/class/power_supply/`, distribuido por QR + deep-link | 4 semanas + pipeline de build/firma |
| 11 | Endpoint `/api/probe/upload` que recibe la medición del APK y la asocia al `sessionId` | 1 semana |
| 12 | Filtrado de tests por `state.device.capabilities` (la lista canónica está en `docs/MAPA_CODIGO_ACTUAL.md` §5) | 3 días |

### 4.3 Importante — para extender el alcance

| # | Tarea | Esfuerzo aprox |
|---|---|---|
| 13 | Módulo notebooks (Mac/Windows): web-only para tests visuales + `.pkg`/`.exe` descargable para SSD/RAM/batería laptop | 6 semanas |
| 14 | Dashboard interno (si se decide tenerlo separado del backoffice de Trade-In) | 3 semanas |
| 15 | Soporte de tablets explícito (hoy hardcodeado a phone en DeviceTypeScreen) | 2 días |

---

## 5. Decisiones técnicas que tomamos en el MVP y que ustedes pueden cambiar

Ninguna decisión del prototipo es vinculante. Lo que elegimos y por qué:

- **Stack frontend del MVP:** React 18 + Babel in-browser + Tailwind CDN. **Productivo:** migrar a Next.js 14 + TypeScript + Tailwind compilado. La mayor parte del código JSX se traslada 1:1.
- **Stack backend del MVP:** Express + JSON estático. **Productivo:** lo que use Reuse hoy (NestJS, Spring Boot, Django). El código actual es ~250 líneas, se reescribe en horas.
- **DB del MVP:** mapa en memoria. **Productivo:** PostgreSQL (recomendado Supabase para velocidad o RDS si Reuse ya tiene infra AWS). Tablas mínimas: `tac` (índice B-tree), `session`, `report`, `measurement`.
- **OCR:** Tesseract.js en el cliente. **Productivo:** evaluar si se queda en cliente (mejor para privacidad) o se mueve al backend con Tesseract o Google Vision API (mejor precisión).
- **Mock de validaciones:** función determinística por IMEI. **Productivo:** integraciones reales con sus respectivos contratos y SLAs.
- **Persistencia state cliente:** localStorage. **Productivo:** se mantiene + sync con backend cuando hay sesión activa.

---

## 6. Lista de gestiones administrativas/comerciales que necesita Reuse

Esto no es código — son decisiones empresariales que tienen que estar antes de salir a producción:

- **Contrato GSMA** o equivalente para acceso al catálogo TAC (~80k modelos). Alternativa: Sickw como fallback comercial.
- **Apple GSX** para warranty lookup en iPhone/iPad. Requiere acuerdo de Authorized Service Provider o Reseller.
- **Samsung GSPN** para warranty lookup en dispositivos Samsung. Requiere acuerdo con Samsung.
- **CheckMEND o equivalente LATAM** para blacklist y reporte de robo.
- **Hosting productivo:** Vercel/AWS para frontend, Railway/Render/AWS para backend, RDS o Supabase para DB.
- **Dominio:** `smartcheck.reuse.cl` (o el que decidan), con SSL real (Let's Encrypt o ACM).
- **Cuenta Apple Developer** ($99/año) si se decide hacer una versión iOS nativa más adelante.
- **Cuenta Google Play Developer** ($25 una sola vez) para distribuir el SmartCheck Probe APK por canal cerrado.
- **Privacy review** para Ley 19.628 (Chile) y LFPDPPP (México). Definir aviso de privacidad, política de retención, manejo de IMEI.
- **Coordinación con el equipo de Trade-In** para el contrato del código de evaluación y la API de integración.
- **Acuerdos comerciales con cada partner** (Reuse, Falabella, MacStore, Samsung, Xiaomi) para definir reglas de scoring, precios base y categorías aceptadas — esto se traduce en filas de la tabla `partner_config`.

---

## 7. Riesgos técnicos conocidos

- **Distribución del APK Android sin Play Store:** firma + instalación de fuentes desconocidas asusta al cliente. Recomendación: publicar en Play Store con canal cerrado o como app pública limitada.
- **Mixed content (HTTP/HTTPS):** el frontend en HTTPS no puede llamar a un backend HTTP. El MVP resuelve esto sirviendo el backend también con HTTPS usando los mismos certs autofirmados. Productivo: backend con cert real.
- **Battery Status API deprecada:** Chrome y Safari pueden eliminarla en versiones futuras. La rama Android no depende de ella (usa el APK), pero el fallback web sí. Asumimos eventual eliminación.
- **OCR de iOS Settings depende del idioma del cliente:** Tesseract trabajaba con `'eng'` en el MVP. Productivo: detectar idioma y cargar el `.traineddata` correcto, o entrenar regex multi-idioma para "Capacidad máxima/Maximum Capacity/Capacidade máxima".
- **TAC missing en marcas oscuras / pre-2014:** caen al modo "fallback" del backend. Hay que asegurarse de que la UI degrada elegante.
- **Rate limit GSMA:** la API tiene límites. Productivo: cache local agresivo (TTL 30 días por TAC) y batching.
- **Manipulación del IMEI por el cliente:** un cliente malicioso puede ingresar un IMEI distinto al de su dispositivo. Mitigación: cross-check con `getUserMedia` + algunos device fingerprints, o leer el IMEI directamente del dispositivo en el APK Probe.

---

## 8. Cómo correr el prototipo (verificación final)

```bash
# 1. Clonar/copiar la carpeta SmartCheck

# 2. Setear el symlink (si /tmp/smartcheck_serve no existe)
ln -sfn "$(pwd)" /tmp/smartcheck_serve

# 3. Backend
cd server && npm install && npm start
# → http://0.0.0.0:8767 + https://0.0.0.0:8768

# 4. Frontend (en otra terminal)
cd /tmp/smartcheck_serve && ruby serve_https.rb
# → https://0.0.0.0:8766/app%20v2.html

# 5. Desde tu Mac:
# https://localhost:8766/app%20v2.html
# (aceptar advertencia de cert autofirmado)
```

**Para probar end-to-end:** ingresar un IMEI válido con TAC del catálogo. Por ejemplo:

| Modelo | IMEI de prueba (Luhn válido) |
|---|---|
| Samsung Galaxy S23 | `353532159876544` |
| iPhone 15 | `354513179876549` |
| Xiaomi Redmi Note 13 | `358768159876547` |
| Google Pixel 8 | `353178179876549` |

El `ImeiCheckScreen` debe mostrar el modelo correcto detectado y las 6 validaciones con resultados deterministas.

---

## 9. Contacto

Para dudas sobre el contexto, decisiones de producto o integración con Trade-In:
**Roberto Rondón** · rrondon@reuse.cl

Para dudas sobre decisiones técnicas o arquitectura:
**Roberto Rondón** + **Cowork (Claude)** — el contexto del prototipo está en este repo y en los `.docx` de `docs/`.
