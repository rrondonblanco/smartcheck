# SmartCheck — Proyecto consolidado

> **Última actualización:** 23 de abril de 2026
> **Owner:** Roberto Rondón (rrondon@reuse.cl)
> **Producto:** herramienta de diagnóstico multidispositivo (smartphone, tablet, notebook) para trade-in B2B.

Este archivo es el mapa central del proyecto. Si eres nuevo (o eres una versión futura de Claude retomando este trabajo), empieza acá.

---

## 1. Qué es SmartCheck

Plataforma digital que permite a un operador de tienda evaluar un dispositivo usado en minutos para decidir si se recibe (trade-in). Tres etapas en el roadmap:

1. **Landing pública** — sitio marketing con CTA "Comenzar prueba" (diseñada en Claude Design, lista visualmente).
2. **Web App de diagnóstico** — flujo de 15 pantallas con tests reales (cámara, pantalla, audio, batería, IMEI, etc.). Corre 100% en navegador, sin instalación. En desarrollo activo.
3. **Dashboard operador** — panel B2B donde aterrizan los análisis de todas las tiendas. Operador revisa, compara y decide recibir/rechazar. Pendiente.

El producto apunta a reemplazar ExChange y operar en Reuse Chile, Falabella Chile, MacStore México.

---

## 2. Estructura de la carpeta

| Carpeta / archivo | Qué es | Origen |
|---|---|---|
| `app v2.html` | **Punto de entrada VIVO.** Monolito React+Babel+Tailwind con las 15 pantallas del diagnóstico. Es lo que sirve el servidor HTTPS local. | Claude Code (21 abr 2026) |
| `app-v2/` | Componentes React extraídos del monolito (app.jsx, screens-a.jsx, screens-b.jsx, screens-c.jsx, shell.jsx). Preparación para migrar a Next.js. | Claude Code |
| `src-v2/icons.jsx` | Iconografía compartida. | Claude Code |
| `design_handoff_smartcheck/` | Handoff de diseño original: landing/, app/, brand/, screenshots/ y README con design tokens, tipografía, colores. | Claude Design |
| `Landing Producto Phonecheck.zip` | Export original de la landing desde Claude Design. | Claude Design |
| `logo_blanco 2.png` | Logo de Reuse (versión blanca). | Brand |
| `docs/` | Documentación estratégica y técnica. | Cowork / Claude |
| `docs/diagrams/` | 4 diagramas de arquitectura (SVG editables + PNG de respaldo). | Cowork / Claude |
| `tools/` | Script Ruby del servidor HTTPS + certificados autofirmados. | Claude Code |
| `server/` | Backend MVP Express. Endpoints `/api/lookup`, `/api/session`, `/api/report`. Mock DB de 32 TACs. | Cowork (27 abr) |
| `.claude/` | Configuración local de Claude Code (launch.json, settings). No tocar manualmente. | Claude Code |

### Documentos en `docs/`

| Archivo | Contenido |
|---|---|
| `SmartCheck_BatteryHealth_Analisis_v1.docx` | v1.0 original. Research + benchmark de competidores (PhoneCheck, Blancco, Piceasoft, NSYS, AccuBattery) + decisión híbrida. |
| `SmartCheck_BatteryHealth_Analisis_v1_1.docx` | v1.1 actualizado. Suma §6 IMEI Lookup adaptativo + §10 Mapeo a código actual con referencias a líneas exactas del `app v2.html`. |
| `SmartCheck_Arquitectura_Tecnica_v1.docx` | Arquitectura técnica con 4 diagramas embebidos, endpoints, state schema, snippets de código, roadmap en 7 fases. |

---

## 3. Cómo correr el servidor local para probar la app

El `app v2.html` necesita servirse por HTTPS para que funcionen APIs como cámara, micrófono y batería desde un móvil real. Claude Code dejó un setup listo.

### 3.1 Primer arranque (una sola vez o tras reinicio)

Abre Terminal y pega esto (todo de una vez):

```bash
# 1. Crear symlink de /tmp/smartcheck_serve a esta carpeta (solo si no existe)
ln -sfn "/Users/robertorondon/Library/CloudStorage/GoogleDrive-rrondon@reuse.cl/Otros ordenadores/Mi iMac (1)/REUSE/UX:UI REUSE/SmartCheck" /tmp/smartcheck_serve

# 2. Copiar los archivos del servidor desde tools/ a /tmp/smartcheck_serve
cp /tmp/smartcheck_serve/tools/serve_https.rb /tmp/smartcheck_serve/tools/cert.pem /tmp/smartcheck_serve/tools/key.pem /tmp/smartcheck_serve/

# 3. Arrancar el servidor
cd /tmp/smartcheck_serve && ruby serve_https.rb
```

El servidor queda corriendo en la terminal. Para detenerlo: `Ctrl + C`.

### 3.2 Conocer tu IP LAN

Abre otra Terminal y corre:

```bash
ipconfig getifaddr en0
```

(si no responde, prueba con `en1`). Anota la IP que aparece (ejemplo: `192.168.1.20`).

### 3.3 Abrir en iPhone/Android

1. Asegúrate de que tu móvil está en la misma red WiFi que la Mac.
2. Abre Safari/Chrome en el móvil.
3. Navega a: `https://<tu-ip-lan>:8766/app%20v2.html`
   - Ejemplo: `https://192.168.1.20:8766/app%20v2.html`
4. El navegador mostrará una advertencia de "conexión no privada" (normal — el cert es autofirmado). Toca **Avanzado** → **Continuar de todas formas**.
5. La app carga y ya puedes testear con permisos reales de cámara, mic, batería.

### 3.4 También funciona en HTTP plano (solo desde tu Mac)

Claude Code dejó además un server HTTP plano (sin SSL) en puerto 8765 para pruebas rápidas locales:

```bash
cd /tmp/smartcheck_serve && ruby -run -e httpd . -p 8765
```

Accede desde tu Mac en `http://127.0.0.1:8765/app%20v2.html`. No sirve para móvil real (sin HTTPS no hay cámara ni batería API).

### 3.5 Backend MVP (Express)

Desde el 27 de abril hay un backend Node/Express en `server/`. Sirve `/api/lookup/:tac`, `/api/lookup/:imei/checks`, `/api/session`, `/api/report`. Lo consume `ImeiCheckScreen` para verificar IMEI con datos reales (32 TACs en `server/db/tacs.json`).

**Primera vez (instalar dependencias):**

```bash
cd "/Users/robertorondon/Library/CloudStorage/GoogleDrive-rrondon@reuse.cl/Otros ordenadores/Mi iMac (1)/REUSE/UX:UI REUSE/SmartCheck/server"
npm install
```

**Arrancar el backend (cada vez que reinicies o quieras correrlo):**

```bash
cd "/Users/robertorondon/Library/CloudStorage/GoogleDrive-rrondon@reuse.cl/Otros ordenadores/Mi iMac (1)/REUSE/UX:UI REUSE/SmartCheck/server"
npm start
```

Verás:

```
[SmartCheck] TAC DB loaded: 32 entries
[SmartCheck] HTTP backend  → http://0.0.0.0:8767
[SmartCheck] HTTPS backend → https://0.0.0.0:8768 (mismos certs que serve_https.rb)
```

**Probar que funciona:**

```bash
# Healthcheck
curl http://localhost:8767/health

# Lookup TAC real (Samsung Galaxy S23)
curl http://localhost:8767/api/lookup/35353215

# Lookup TAC real (iPhone 15)
curl http://localhost:8767/api/lookup/35451317
```

**Importante:** el frontend detecta automáticamente si el backend hay que llamarlo por HTTP (8767) o HTTPS (8768) según cómo se sirva el HTML. No hay que configurar nada manualmente. Si necesitas forzar una URL específica, abrí la consola del navegador y corré:

```js
window.SMARTCHECK_API_URL = 'https://192.168.1.20:8768';
```

**Recomendación de flujo de desarrollo:**

1. Terminal 1 → arrancar `serve_https.rb` (puertos 8765/8766 para servir el HTML).
2. Terminal 2 → arrancar `server/npm start` (puertos 8767/8768 para la API).
3. Móvil → entrar a `https://<tu-ip-lan>:8766/app%20v2.html` y empezar a testear.

### 3.6 Acceso remoto desde fuera de tu LAN (demos internas)

Cuando quieras mostrarle el prototipo a alguien fuera de tu red WiFi (PM, equipo de TI, partner), podés exponer tu Mac temporalmente al internet con un túnel. La opción más simple es **Cloudflare Tunnel** (gratis, sin cuenta para usos puntuales):

```bash
# Instalar cloudflared (una sola vez)
brew install cloudflared

# Exponer el server HTTPS local (mientras esté corriendo en :8766)
cloudflared tunnel --url https://localhost:8766
```

Te devuelve una URL pública tipo `https://random-words-1234.trycloudflare.com` que cualquiera puede abrir desde su teléfono. Para detener el túnel: `Ctrl + C` en esa terminal.

Alternativa con **ngrok** si Cloudflare no te funciona:

```bash
brew install ngrok
ngrok http https://localhost:8766
```

**Importante para demos remotas:** acuérdate de que el backend (`server/`) también tiene que estar accesible. La forma más simple es exponer **un solo puerto** (el del frontend HTTPS, 8766) y que el server Ruby haga proxy al Express, o simplemente correr ambos por túneles separados. Para una demo de 30 minutos lo más rápido es:

```bash
# Terminal 1: túnel del frontend
cloudflared tunnel --url https://localhost:8766
# → URL pública del frontend

# Terminal 2: túnel del backend
cloudflared tunnel --url https://localhost:8768
# → URL pública del backend (anótala)

# En la consola del navegador del cliente que abre el túnel del frontend:
window.SMARTCHECK_API_URL = '<URL pública del backend>'
```

A largo plazo, cuando esté el equipo de TI involucrado, esto se reemplaza por hosting real en Vercel/Railway con dominio fijo (`smartcheck.reuse.cl`).

---

## 4. Dónde editar qué

- **Código vivo:** `app v2.html` (1586 líneas). Todo el flujo de 15 pantallas está acá por ahora.
- **Código futuro (refactor):** `app-v2/*.jsx`. Cuando se migre a Next.js, estos serán los componentes reales.
- **Diseño:** `design_handoff_smartcheck/` es **referencia**, no código que se copie directo. Los design tokens (colores, tipografía) están documentados ahí.
- **Docs:** cualquier cambio de estrategia o arquitectura va en `docs/`. Los `.docx` se regeneran desde scripts en la carpeta de trabajo de Cowork.

---

## 5. Estado actual del código (27 abr 2026)

| Pantalla | Estado | Pendiente |
|---|---|---|
| 1. Landing / Inicio | Funcional | — |
| 2. Tipo dispositivo | Funcional | Hacer opcional (la detección real la da el TAC) |
| 3. Captura IMEI | Funcional | — |
| 4. IMEI Check | **Funcional con backend mock** | Sumar integraciones reales (GSMA, Apple GSX, Samsung GSPN) |
| 5. Device info | Embebida en IMEI Check (muestra brand/model real) | Agregar pantalla independiente con confirmación/edición |
| 6. Menú de tests | Lista fija | Filtrar por `state.device.capabilities` |
| 7. Pantalla | Funcional | Loggear resultado real |
| 8. Touch | Funcional | — |
| 9. Cámara | Funcional | Fallback si deniegan permisos |
| 10. Micrófono | Funcional | Medir RMS/ruido, no solo presencia |
| 11. Batería | Solo `navigator.getBattery` | Ramificar iOS-OCR / Android-Probe / manual |
| 12. Conectividad | Funcional | Marcar como "consultivo" |
| 13. Botones físicos | Funcional | — |
| 14. Resumen / Score | **Funcional con device real** | Agregar decisión "Recibir/Rechazar" y export |
| 15. Folio / Reporte | Funcional | Persistir vía POST `/api/report` (endpoint ya disponible) |

**Lo que falta que no es pantalla:**

- **Backend (API):** **mock funcional** en `server/`. Endpoints `/api/lookup`, `/api/session`, `/api/report` corriendo. Falta integrar fuentes reales (GSMA, Apple GSX, Samsung GSPN) y migrar a PostgreSQL.
- **DB TAC interna:** **mock con 32 modelos** en `server/db/tacs.json`. Productivo: poblar con ~80k modelos vía contrato GSMA.
- **SmartCheck Probe (APK Android):** no existe. Es una app nativa Kotlin para leer `BatteryManager` y reportar al backend por sessionId.
- **Dashboard operador:** **a redefinir** dado el contexto Trade-In. El operador vive en el backoffice de Trade-In; SmartCheck devuelve el reporte vía código de evaluación.
- **Integración con Trade-In:** pendiente coordinación con equipo TI (formato del código, API/webhook, partners por tenant).
- **Hosting productivo:** pendiente. Hoy todo corre en local Mac de Rob con túnel.

---

## 6. Próximos pasos sugeridos

Ver `docs/SmartCheck_Arquitectura_Tecnica_v1.docx` §10 para el roadmap completo. Resumen:

1. **Refactor a Next.js** (2 semanas) — migrar `app v2.html` → `app-v2/` con la misma state shape, extendiendo `state.device`.
2. **API + DB TAC** (2 semanas) — levantar endpoint real de lookup con mock de 10-20 TACs para probar end-to-end sin backend productivo.
3. **iOS OCR** (1 semana) — reutilizar Tesseract.js (ya cargado en línea 51 de `app v2.html`) para leer screenshots de Ajustes → Batería → Salud.
4. **APK Probe Android** (4 semanas) — app nativa + endpoint `/api/probe/upload`.
5. **Dashboard operador** (3 semanas) — etapa 3.
6. **Hardening + privacidad** (2 semanas) — CSP, rate-limits, cifrado, revisión Ley 19.628 (CL) y LFPDPPP (MX).
7. **Piloto** (4 semanas) — rollout en 3-5 tiendas Reuse Chile.

---

## 7. Advertencias

- **No borrar `/tmp/smartcheck_serve` desde Finder:** es un symlink; borrarlo no afecta los archivos reales (que viven acá), pero rompe la configuración de Claude Code. Si lo borraste, recréalo con el comando de §3.1.
- **Reinicios de la Mac borran `/tmp/`:** después de reiniciar, repite los 3 comandos de §3.1 para volver a montar todo.
- **Cambio de red WiFi:** no afecta a los archivos ni al server; solo cambia tu IP LAN (§3.2).
- **El cert autofirmado genera advertencia en el móvil:** es esperado. "Avanzado → Continuar".
- **No committear `key.pem` en repos públicos:** es una clave privada (incluso siendo de desarrollo). Si este proyecto migra a Git, añadir `tools/key.pem` al `.gitignore`.

---

## 8. Cambios recientes

- **27 abr 2026** — `docs/MAPA_CODIGO_ACTUAL.md` con auditoría línea por línea de las 15 pantallas (qué es funcional vs maqueta).
- **27 abr 2026** — Backend MVP en `server/` (Express + 32 TACs mock). `/api/lookup/:tac`, `/api/lookup/:imei/checks`, `/api/session`, `/api/report` funcionando en HTTP 8767 + HTTPS 8768.
- **27 abr 2026** — `app v2.html` refactorizado: `ImeiCheckScreen` ahora consume el backend real, `INITIAL_STATE` extendido con `device`, `imeiCheck`, `reportId`, `sessionId`, `partnerId`. `SummaryScreen` cableado al device real (ya no muestra "Samsung Galaxy A54 5G" hardcodeado).
- **23 abr 2026** — README inicial. Se copió `serve_https.rb`, `cert.pem`, `key.pem` a `tools/` para respaldar el setup frente a reinicios de Mac.
- **23 abr 2026** — Creados `docs/SmartCheck_BatteryHealth_Analisis_v1_1.docx` y `docs/SmartCheck_Arquitectura_Tecnica_v1.docx` con 4 diagramas.
- **21 abr 2026** — `app v2.html` actualizado en Claude Code: integración OCR IMEI con Tesseract.js, fix en script Babel (quitar `data-type="module"`).
- **20 abr 2026** — Setup inicial: symlink `/tmp/smartcheck_serve`, server HTTPS con certs autofirmados.
