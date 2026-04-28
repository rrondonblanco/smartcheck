# SmartCheck Backend MVP

> Servidor Express minimalista para el prototipo de SmartCheck.
> **Propósito:** validar el flujo end-to-end con datos reales antes del handoff al equipo TI.
> **NO es producción.** Persistencia en memoria, mock de validaciones, sin auth.

## Cómo correrlo

Requiere Node.js 18 o superior.

```bash
cd server
npm install
npm start
```

Verás:

```
[SmartCheck] TAC DB loaded: 32 entries from .../db/tacs.json
[SmartCheck] MVP backend running at http://0.0.0.0:8767
```

## Probar que funciona

```bash
# Healthcheck
curl http://localhost:8767/health

# Lookup TAC real (Samsung Galaxy S23)
curl http://localhost:8767/api/lookup/35353215

# Lookup TAC inexistente (devuelve 404 + fallback)
curl http://localhost:8767/api/lookup/99999999

# Validaciones IMEI (TAC real + sufijo random + checksum válido)
curl -X POST http://localhost:8767/api/lookup/353532151234560/checks
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Healthcheck |
| GET | `/api/lookup/:tac` | TAC → device info |
| POST | `/api/lookup/:imei/checks` | Validaciones (mock determinístico por IMEI) |
| POST | `/api/session` | Crea sesión |
| GET | `/api/session/:id` | Obtiene sesión |
| POST | `/api/report` | Persiste reporte final |
| GET | `/api/report/:id` | Recupera reporte |

## Decisiones técnicas y handoff a TI

Este código está pensado para ser fácil de portar. Notas:

- **Persistencia:** in-memory `Map`. Productivo: PostgreSQL (recomendado Supabase o RDS) con tablas `tac`, `session`, `report`, `measurement`.
- **TAC DB:** JSON estático en `db/tacs.json` con 32 modelos. Productivo: tabla `tac` con índice B-tree y sync semanal desde GSMA.
- **Checks:** mock determinístico (mismo IMEI = misma respuesta). Productivo: integraciones reales con GSMA, Apple GSX, Samsung GSPN, blacklist LATAM (CheckMEND o similar).
- **Auth:** ninguna. Productivo: JWT con scope por `partnerId` (multi-tenancy).
- **CORS:** abierto para todos. Productivo: lista blanca de dominios.
- **Validación de input:** básica (regex + Luhn). Productivo: middleware de validación (zod, joi) y rate-limiting.
- **Observabilidad:** solo `console.log`. Productivo: structured logging + Sentry/Datadog.

## Estructura de archivos

```
server/
├── index.js          ← server Express con todos los endpoints
├── package.json      ← deps mínimas (express, cors)
├── .gitignore
├── README.md         ← este archivo
└── db/
    └── tacs.json     ← catálogo mock de 32 dispositivos
```

## Cómo agregar más TACs al mock

Editar `db/tacs.json` y reiniciar el servidor. Cada entrada requiere:

```json
"35353215": {
  "brand": "Samsung",
  "model": "Galaxy S23",
  "modelNumber": "SM-S911B",
  "os": "Android",
  "year": 2023,
  "designCapacityMAh": 3900,
  "category": "phone",
  "capabilities": ["screen", "touch", "camera", "mic", "battery-probe", "buttons", "connectivity", "sensors"]
}
```

`capabilities` controla qué tests muestra el frontend para ese dispositivo. Los valores válidos son:

- `screen`, `touch`, `camera`, `mic`, `buttons`, `connectivity`, `sensors` — universales
- `battery-ocr` — iPhone (OCR sobre Ajustes → Batería → Salud con Tesseract.js)
- `battery-probe` — Android (requiere SmartCheck Probe APK)
- `battery-web-only` — fallback genérico (solo level via `navigator.getBattery`)
