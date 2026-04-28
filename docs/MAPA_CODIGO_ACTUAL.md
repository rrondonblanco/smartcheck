# SmartCheck — Mapa del código actual

> **Fecha:** 23 de abril de 2026 · revisión línea por línea
> **Archivos auditados:** `app v2.html` (1586 líneas), `app-v2/app.jsx` (87 líneas), `app-v2/screens-a.jsx`, `app-v2/screens-b.jsx`, `app-v2/screens-c.jsx`, `app-v2/shell.jsx`, `src-v2/icons.jsx`
> **Propósito:** distinguir qué es funcional, qué es maqueta y qué requiere intervención antes de empezar el refactor productivo.

---

## 0. Lo primero que hay que saber

`app v2.html` es **el monolito vivo** que sirve el servidor HTTPS local. Los archivos de `app-v2/` son una **descomposición modular** del mismo código (idénticos componentes en archivos separados) pero **no se están sirviendo** — están como preparación para el refactor a Next.js. Cuando hagamos el handoff al equipo de TI, ellos van a partir desde `app-v2/`. Mientras tanto, todo el desarrollo y la prueba funcional pasa por `app v2.html`.

**Implicación importante:** cualquier cambio que hagamos en `app v2.html` debe replicarse en el archivo correspondiente de `app-v2/` (o viceversa) para que ambas versiones queden sincronizadas. O bien decidimos cuál es la fuente de verdad y dejamos la otra en pausa hasta el handoff.

---

## 1. Tabla maestra de pantallas

| # | Pantalla | Líneas | Estado real | Resumen |
|---|---|---|---|---|
| 1 | `WelcomeScreen` | 259–315 | Estática | Decorativa, CTA "Empezar". Sin lógica. |
| 2 | `DeviceTypeScreen` | 317–363 | Limitada | Solo 'phone' habilitado; 'tablet' y 'laptop' marcados como `available:false`. Contradice la promesa multidispositivo. |
| 3 | `ImeiScreen` | 376–472 | **Funcional al 100%** | OCR con Tesseract.js, paste desde clipboard, validación Luhn en vivo. Bien construida. |
| 4 | `ImeiCheckScreen` | 474–546 | **MAQUETA** | Animación `setInterval` decorativa que tarda ~3.5s. Las 6 "bases" son strings fijos. Siempre marca `imeiOk: true`. **Primer target del refactor.** |
| 5 | `TestMenuScreen` | 550–607 | Funcional | Lista 8 tests fijos, no filtra por capabilities (porque aún no hay device detection real). |
| 6 | `TouchTest` | 633–693 | **Funcional** | Grid 16x16, pointer events, calcula coverage real, requiere ≥95% para pass. |
| 7 | `DisplayTest` | 695–728 | **Funcional** | Recorre 5 colores, validación visual del operador. |
| 8 | `AudioTest` | 730–~970 | **Funcional** | Sweep con AudioContext (80Hz→12kHz), grabación con MediaRecorder, análisis de picos. |
| 9 | `CameraTest` | ~970–1010 | **Funcional** | getUserMedia front+rear con `facingMode`. |
| 10 | `SensorsTest` | ~1010–1095 | **Funcional** | DeviceMotionEvent (acelerómetro), DeviceOrientationEvent (giroscopio). |
| 11 | `BatteryTest` | 1095–1173 | **Parcial** | Solo `navigator.getBattery()` (level + charging). Reconoce limitación iOS. **No mide salud.** |
| 12 | `ConnectivityTest` | 1175–1238 | **Funcional** | online/offline, NetworkInformation API, geolocation, ping. |
| 13 | `ButtonsTest` | 1240–1330 | **Funcional con bug menor** | Detecta carga, bloqueo, vibración. La variable `touchOk` se referencia pero parece no setearse en el flujo (revisar). |
| 14 | `SummaryScreen` | 1335–1422 | **Parcial / hardcode** | Score real, pero "Samsung Galaxy A54 5G" está **hardcodeado** sin importar el IMEI. Fecha también fija. |
| 15 | `ReportScreen` | 1424–1492 | **MAQUETA** | Link, QR, firma sha256, reporte ID — todo fijo o aleatorio. No se persiste nada. |
| 16 | `App` (router) | 1496–1542 | Funcional | localStorage para persistencia de pantalla y state. 16 rutas cubiertas. |
| 17 | `DebugNav` | 1544–1581 | Funcional | Sólo desktop. Permite saltar entre pantallas y resetear. Útil para QA. |

---

## 2. Inventario funcional vs maqueta

### Funcional al 100% (no tocar salvo refactor cosmético)

- `validateImeiLuhn` (líneas 365–374) — checksum Luhn correcto.
- `ImeiScreen` — OCR con Tesseract.js, paste, validación.
- `TouchTest` — coverage real con pointer events.
- `DisplayTest` — patrones de color con validación operador.
- `AudioTest` — sweep + grabación + análisis.
- `CameraTest` — getUserMedia front/rear.
- `SensorsTest` — eventos de movimiento/orientación.
- `ConnectivityTest` — APIs reales del navegador.
- `ButtonsTest` — eventos de carga/bloqueo/vibración (con bug menor).
- `App` — routing y persistencia.
- `DebugNav` — navegación de QA.

### Funcional con limitaciones reales del navegador

- `BatteryTest` — `navigator.getBattery()` no expone salud de batería en ninguna plataforma. iOS Safari ni siquiera la implementa. **Es lo que el APK Probe Android y OCR iOS deben resolver.**

### Maqueta a reemplazar

- `ImeiCheckScreen` — animación decorativa que siempre da OK. **Primer refactor crítico.**
- `SummaryScreen` (parcial) — el dispositivo "Samsung Galaxy A54 5G" está hardcodeado en línea 1390. Hay que cablearlo a `state.device.brand + state.device.model` cuando exista.
- `ReportScreen` — toda la pantalla es decoración: link fijo, QR aleatorio, sha256 fijo, ID fijo. **Requiere backend para volverse real.**

### No funcional / placeholder

- `DeviceTypeScreen` permite seleccionar solo "phone". Tablet y laptop están deshabilitados pero visualmente presentes. Cuando el IMEI lookup detecte tipo automáticamente, esta pantalla puede volverse opcional o desaparecer.

---

## 3. Hardcodes a eliminar (catálogo exacto)

| Línea | Archivo | Hardcode | Reemplazo |
|---|---|---|---|
| 1374 | `app v2.html` | Fecha `20 · abr · 2026` en SummaryScreen | Generar dinámicamente con `new Date()` |
| 1390 | `app v2.html` | Modelo "Samsung Galaxy A54 5G" | `${state.device.brand} ${state.device.model}` |
| 1391 | `app v2.html` | Mensaje "Sin reportes · equipo libre" | Compilar de `state.imeiCheck.checks` |
| 1426 | `app v2.html` | Link `smartcheck.app/r/a3f8-22-k9-9e` | Generado por backend `/api/report` |
| 1427 | `app v2.html` | QR aleatorio `Math.random()` | QR real con código de evaluación |
| 1437–1439 | `app v2.html` | "Reporte #A3F8-22" + fecha | reportId real del backend |
| 1472 | `app v2.html` | `sha256:a3f8b71c22c991a0e4d...8e9f` | Firma real del backend |
| 1496 | `app v2.html` | `INITIAL_STATE` sin `device` | Extender con `device: null` |
| 475 | `app v2.html` | Array `bases` con 6 strings fijos | Array dinámico desde respuesta de API |
| 533 | `app v2.html` | "Equipo libre · sin reportes · habilitado" | Texto compilado desde checks reales |

---

## 4. Bug menor en ButtonsTest (línea 1240–1330)

En la línea 1270, `allOk = chargeEvent && lockEvent && vibrateOk!==null && touchOk` depende de `touchOk` que se declara en línea 1245 (`useState(false)`) pero **nunca veo dónde se setea a `true`** en las líneas mostradas. Eso significa que el botón "Marcar OK" nunca se habilita aunque las otras tres pruebas pasen. Pendiente verificar al refactorizar — puede que el código de `touchOk = true` esté en una sección que no leí, o que el bug sea real.

---

## 5. Estado del INITIAL_STATE actual (línea 1496)

```js
const INITIAL_STATE = { deviceType: null, imei: '', imeiOk: false, results: {} };
```

**Falta para volverse productivo:**

```js
const INITIAL_STATE = {
  deviceType: null,
  imei: '',
  imeiOk: false,
  device: null,           // NEW — viene de /api/lookup/:tac
                          // { brand, model, os, year, designCapacityMAh, capabilities[] }
  imeiCheck: {            // NEW — reemplaza el bool imeiOk
    status: 'idle',       // idle | loading | ok | error
    checks: []            // array dinámico desde el backend
  },
  results: {},
  reportId: null,         // NEW — viene de POST /api/report
  sessionId: null,        // NEW — para integración con Trade-In
  partnerId: null,        // NEW — multi-tenancy (Reuse, Falabella, etc.)
};
```

---

## 6. Dependencias externas cargadas

| Línea | Recurso | Uso |
|---|---|---|
| 9 | Google Fonts (Geist, Inter, JetBrains Mono, Poppins) | Tipografía |
| 10 | Tailwind CDN | Estilos |
| 49 | React 18.3.1 | UI |
| 50 | ReactDOM 18.3.1 | UI |
| 51 | Babel Standalone 7.29.0 | JSX in-browser |
| 52 | **Tesseract.js 5.1.0** | **OCR — ya disponible para iOS battery health** |

Tesseract.js ya está cargado y se usa en `ImeiScreen`. Cuando implementemos OCR de batería iOS no hay que agregar dependencia, solo invocar `window.Tesseract.recognize()` con la imagen del Ajustes → Batería → Salud.

---

## 7. Lo que no existe en absoluto (faltante para producto)

- **Backend / API.** No hay servidor de aplicación. El servidor Ruby `serve_https.rb` solo sirve archivos estáticos.
- **Base de datos de TACs.** No hay mapeo IMEI → device.
- **Endpoints `/api/lookup`, `/api/checks`, `/api/session`, `/api/report`, `/api/probe/upload`.**
- **Persistencia del reporte.** Todo se pierde al cerrar el navegador (salvo el localStorage que mantiene el state).
- **APK Probe Android.** Ni código, ni pipeline de build, ni distribución.
- **Filtrado de tests por capabilities del device.**
- **Rama de batería por OS.** Hoy todos pasan por el mismo `BatteryTest` web-only.
- **Integración con Trade-In.** No hay código de evaluación, no hay handshake, no hay handoff.
- **Multi-tenancy.** Hoy es mono-cliente sin distinción de partners.
- **Métricas / observabilidad / errores.**
- **CI/CD, hosting productivo, dominio, SSL real.**

---

## 8. Plan de orden de intervención (orden técnico recomendado)

1. **Crear `state.device` y backend mock `/api/lookup/:tac`** → base para todo lo demás.
2. **Refactorizar `ImeiCheckScreen`** → primer pantalla con datos reales.
3. **Cablear hardcode de SummaryScreen al device real.**
4. **Persistir reporte vía `/api/report`** → ReportScreen muestra ID real.
5. **Filtrar TestMenuScreen por capabilities.**
6. **Habilitar tablet en DeviceTypeScreen** una vez que el TAC lo detecte.
7. **Ramificar BatteryTest por os** (iOS-OCR / Android-Probe / web-only).
8. **APK Probe Android** (proyecto paralelo).
9. **Integración Trade-In** (paralela, dependiente de coordinación con TI).

Cada paso es atómico y testeable — al terminar cada uno se puede validar end-to-end en el dispositivo móvil sin esperar al siguiente.
