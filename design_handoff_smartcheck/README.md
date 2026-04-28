# SmartCheck — Design Handoff

## Overview
SmartCheck es una herramienta de diagnóstico profesional para equipos (teléfonos, tablets, notebooks) orientada al mercado de compra-venta de usados en LATAM. Este handoff contiene dos productos:

1. **Landing marketing** (`landing/index.html`) — sitio público con hero, secciones de cómo funciona, qué analizamos, demo interactiva, casos de uso, precios, testimonios, FAQ y CTA final.
2. **Web app de diagnóstico** (`app/app.html`) — flujo de 15 pantallas que ejecuta el diagnóstico real en el equipo: onboarding, verificación IMEI, 8 pruebas (táctil, pantalla, audio, cámaras, sensores, batería, conectividad, botones), resumen con SmartCheck Score y reporte firmado con QR.

## About the Design Files
Los archivos de este bundle son **referencias de diseño creadas en HTML + React (via Babel in-browser) + TailwindCSS (CDN)**. Son prototipos que muestran la apariencia y el comportamiento deseados, **no código de producción para copiar directamente**.

La tarea es **recrear estos diseños en el entorno objetivo del codebase** (Next.js / Vite + React / SvelteKit / lo que corresponda) usando los patrones, librerías y sistema de componentes ya establecidos. Si no existe un entorno aún, recomendamos **Next.js 14 + TypeScript + Tailwind CSS + Radix UI/shadcn** para el landing y la app, o **React Native / Expo** si la app se planea como nativa.

Las interacciones sensoriales de la app (cámara, audio, DeviceOrientation, batería, red) están implementadas con **Web APIs reales** en el prototipo y deben portarse a las APIs equivalentes del target (Expo Sensors, native permissions, etc.).

## Fidelity
**High-fidelity (hifi)** — colores, tipografía, espaciados, radios, sombras y animaciones son finales. Copy en español rioplatense final. El desarrollador debe recrear la UI pixel-perfect usando las libs del codebase objetivo.

---

## Design Tokens

### Colors
| Token | Hex | Uso |
|---|---|---|
| `ink-900` | `#151930` | Navy base. Fondos oscuros, tipografía principal, CTAs oscuros. |
| `ink-800` | `#181b33` | Navy secundario. |
| `ink-700` | `#1b1f3a` | |
| `ink-600` | `#232845` | |
| `ink-500` | `#333855` | Tipografía secundaria sobre claros. |
| `ink-400` | `#575d7a` | Tipografía terciaria / placeholders. |
| `ink-300` | `#9096ae` | Íconos inactivos. |
| `ink-200` | `#c4c8d8` | Bordes. |
| `ink-100` | `#e5e7ef` | Bordes suaves, rings. |
| `ink-50`  | `#f3f4f8` | Fondos de chips, hover sutil. |
| `mint-500` / accent | `#C6FFAD` | **Acento único**. CTAs lima, estados OK, highlights, pulsos. |
| `mint-400` | `#a8ef84` | Hover del acento. |
| `mint-600` | `#529a33` | **Texto lima oscuro** sobre fondos claros (contraste AA). Usar cuando el acento lima no tenga contraste suficiente. |
| `mint-700` | `#3d7826` | Eyebrows, labels sobre fondos claros. |
| `canvas` | `#FAFAF7` | Off-white cálido. Fondo principal del landing. |
| `white` | `#FFFFFF` | Superficies de cards. |

**Reglas de uso del acento:**
- Sobre fondo navy: el lima `#C6FFAD` tiene contraste pleno → usarlo para tipografía, íconos y fills.
- Sobre fondo blanco/crema: **no usar lima puro para texto** — sustituir por `#529a33` o `#3d7826`. El lima puro solo para fills (botones, pills, chips) con texto navy encima.

### Typography
| Family | Uso | Pesos cargados |
|---|---|---|
| **Geist** | Display (headlines, logo wordmark, números grandes) | 400, 500, 600, 700, 800 |
| **Inter** | Body (párrafos, labels, UI) | 400, 500, 600, 700 |
| **JetBrains Mono** | Mono (IMEIs, SNs, eyebrows all-caps, metadata técnica) | 400, 500 |

Letter-spacing: `-0.02em` en Geist (display). Eyebrows en JetBrains Mono con `letter-spacing: 0.14em–0.18em`, `text-transform: uppercase`, tamaño 10–11px.

**Escala del landing:**
- Hero H1: 44px mobile / 56px sm / 68px lg, `font-weight: 600`, `line-height: 1.02`
- Section H2: 34px–44px, `font-weight: 600`
- Body: 15–17px, `line-height: 1.55–1.6`, `color: ink-500`
- Eyebrow: 11px mono, uppercase, tracking 0.14em, color `mint-700`

**Escala de la app (mobile 390×844):**
- Título pantalla: 22–26px, `font-weight: 700`, Geist
- Label: 13px, `font-weight: 500`
- Caption/hint: 11–12px, color white/50

### Spacing
Sistema de 4px (Tailwind default). Paddings comunes: contenedores 24–32px, cards 20–28px, secciones 80–120px verticales.

### Radii
- `rounded-md` (6px) — inputs pequeños
- `rounded-xl` (12px) — cards chicos, chips
- `rounded-2xl` (16px) — cards principales
- `rounded-3xl` (24px) — pricing cards, cta bloques
- `rounded-[32px]` — CTA final grande
- `rounded-[36px]` — device mockup del hero
- Full para pills y botones pill

### Shadows
```
soft: 0 1px 2px rgba(21,25,48,0.04), 0 2px 8px rgba(21,25,48,0.04)
card: 0 1px 3px rgba(21,25,48,0.05), 0 8px 24px rgba(21,25,48,0.06)
lift: 0 20px 50px -20px rgba(21,25,48,0.25)
```

### Efectos especiales
- **Grid bg**: líneas a 48px, `rgba(21,25,48,0.05)`.
- **Hero gradient**: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(198,255,173,0.28), transparent 60%)` sobre `#FAFAF7`.
- **CTA gradient**: doble radial lima sobre navy `#151930`.
- **Pulse-ring**: `box-shadow` animado en lima para el monitor de diagnóstico en vivo.
- **Scan-line**: barra de 2px lima que recorre la pantalla del device mockup (2.4s linear infinite).

---

## Brand System

### Logo (V4 — monograma SC)
Cuadrado con radio 14–15/72, letras **SC** en Geist 800 con letter-spacing `-1.2`, y un **punto lima** pequeño en la esquina superior derecha (esquina noreste) como firma del brand.

**Configuraciones:**
- **Principal**: fondo navy `#151930`, tipografía y punto lima `#C6FFAD`.
- **Variante viva**: fondo lima `#C6FFAD`, tipografía y punto navy `#151930`.
- **Outline**: fondo blanco, borde navy, letras navy, punto lima.

El punto lima es la firma distintiva — mantenerla incluso en versiones mono.

Ver `brand/V4 Palette Test.html` para las 8 combinaciones validadas y tests de escala (favicon 32px → hero 240px).

### Tono y voz
- Rioplatense neutro, tuteo formal (vos), directo.
- No formal corporativo, no jerga tech.
- Ejemplos: "Sabé exactamente qué hay dentro del equipo", "Comprá o vendé usados con certeza, no con fe", "Sin instalación".

---

## Landing — Secciones

Ver `landing/src/` (cada sección es un módulo JSX):

1. **Navbar** (`logo.jsx` + inline en `sections.jsx`) — logo V4, links "Cómo funciona / Dispositivos / Precios / FAQ", "Ingresar" + CTA pill navy.
2. **Hero** (`hero.jsx`) — Chip "Nuevo", H1 de dos líneas con subrayado lima animado en "qué hay", subcopy, dos CTAs (primario navy, secundario outline con ícono play), stats inline (+50.000 equipos / Sin instalación / <5 min). A la derecha: device mockup animado con pantalla de diagnóstico en curso (scan line, progress bar lima, card "Current test: Touch", grid de 8 cuadrantes, checklist de 5 pruebas). Badge flotante "Tiempo real · 247 ms".
3. **TrustBar** — marquee infinito con device glyphs genéricos (iOS / Android / Windows / Tablet / Laptop / Chip / Wear).
4. **ProblemSolution** (`sections.jsx`) — comparativo de 2 columnas. Izquierda: card claro "Sin SmartCheck" con dolores. Derecha: card navy con "Con SmartCheck" y beneficios + badge lima "Diagnóstico en 3 min".
5. **StepsHow** — 4 pasos numerados con íconos y flechas.
6. **WhatWeAnalyze** — tabs (Hardware / Software / Red / Identidad) → grid de 8 cards con íconos y check lima pequeño arriba-derecha.
7. **Benefits** — grid 2×2 de beneficios con íconos que cambian a lima en hover.
8. **InteractiveDemo** (`demo.jsx`) — simulación en vivo de un diagnóstico: stepper izquierdo (5 tests), terminal con URL `smartcheck.app/run/a3f8-22`, progress bar lima, lista de pruebas con check animado, estado "en vivo" pulsando. Tab para ver pantalla táctil (grid 4×5 con cuadrantes que se van tocando).
9. **UseCases** — 3 cards horizontales (Compradores / Vendedores / Técnicos) — la primera con fondo navy invertido.
10. **Pricing** (`pricing-faq.jsx`) — 3 planes (Free / Pro destacado / Business). Pro con fondo navy, chip lima "Más popular", CTA lima. Features con checks lima.
11. **Testimonials** — 3 quotes con avatar inicial en círculo navy.
12. **FAQ** — acordeón con 6 preguntas, transición suave.
13. **FinalCTA** — bloque `cta-gradient` con gradientes lima sobre navy, chip "Probá gratis. Sin tarjeta.", H2 grande, dos CTAs (lima primario + outline blanco), mini-card con icono verificado.
14. **Footer** — 4 columnas + línea fina arriba, logo V4 versión lima, links, social, copyright.

### Tweaks panel
`tweaks.jsx` + contrato en `app.jsx` — panel flotante bottom-right que permite editar headline, accent color, CTA label y background. Usa `postMessage('__edit_mode_*')` para persistir. **Ignorable** si no es relevante en el target: es una herramienta del prototipo, no del producto final.

---

## App — Flujo y pantallas

Ver `app/app/` (15 pantallas en 3 archivos + shell + app principal):

### Navegación
`app/app.jsx` tiene un router de pantallas (state `screen`) + barra top con progreso + localStorage persistente (`smartcheck.state`).

### Pantallas (`screens-a.jsx`, `screens-b.jsx`, `screens-c.jsx`)
1. **Bienvenida** — splash con logo V4 grande y CTA "Empezar"
2. **Tipo de dispositivo** — grid de 6 opciones (Phone / Tablet / Laptop / Desktop / Wear / Console)
3. **IMEI / Serial** — input con validación, scanner placeholder
4. **Chequeo IMEI** — animación de 6 bases internacionales (GSMA / CheckMEND / Apple / Samsung / Local carrier ×2). Círculo de progreso lima.
5. **Menú de pruebas** — grid de 8 cards (Táctil / Pantalla / Audio / Cámaras / Sensores / Batería / Conectividad / Botones) con estado (pendiente / en curso / ok / falla).
6. **Táctil** — grid 3×3 de cuadrantes; el usuario debe tocar cada uno. Cuadrante tocado → check lima con pulso.
7. **Pantalla** — 5 colores fullscreen (rojo / verde / azul / blanco / negro) para detectar pixeles muertos.
8. **Audio** — oscillator real a 440Hz + grabación con mic (MediaRecorder). Waveform en lima.
9. **Cámaras** — preview de cámara frontal + trasera con `getUserMedia`. Viewfinder con crosshair.
10. **Sensores** — DeviceOrientation real. Cuadrado con dot lima que se mueve según la inclinación; meta: inclinar 30°+.
11. **Batería** — Battery API (si disponible), % actual, tiempo estimado, estado de carga.
12. **Conectividad** — Wi-Fi (navigator.connection), Bluetooth, NFC flags.
13. **Botones** — detector de keydown para volumen/power (con instrucciones para probar cada uno).
14. **Resumen** — SmartCheck Score grande en lima (0–100), badges de cada test (ok/warn/fail), CTA "Generar reporte".
15. **Reporte** — card navy con score, QR code, link compartible, CTA "Descargar PDF". Firma digital simulada.

### Patrones de la app
- Fondo global `#151930`, cards con `rgba(255,255,255,0.04–0.08)` y ring sutil.
- Estados OK → lima; warn → amarillo; fail → rojo rose-400.
- Transiciones `fade-up` (0.35s ease-out) entre pantallas.
- Bottom bar con "Atrás" / "Saltar" / "Siguiente" (pill lima).
- Selector de pantalla (debug) — combobox top-right para saltar a cualquiera.

---

## Interacciones & Behavior

### Landing
- Marquee de dispositivos: `@keyframes marquee` 40s linear infinite.
- Tabs "Qué analizamos": swap instantáneo de grid, sin transición.
- FAQ: `<details>` nativo con custom summary (sin marker).
- Pricing: plan destacado `lg:-translate-y-2`.
- Hero device: progress bar sube de 0→100% en ~3s, luego se resetea.
- Demo interactiva: ciclo de 5 pasos, cada uno ~1.2s; al completar muestra "Reporte listo".

### App
- Chequeo IMEI: 6 bases se iluminan secuencialmente (400ms cada una).
- Táctil: cada tap en cuadrante → `ping-soft` animation.
- Sensores: requiere permission prompt en iOS 13+ (`DeviceOrientationEvent.requestPermission`).
- Audio: tono tocado vía `OscillatorNode`, grabación con `MediaRecorder`.
- Resumen: score anima de 0 al valor final con `requestAnimationFrame`.

---

## State Management (app)
```ts
type AppState = {
  screen: ScreenId;
  deviceType: 'phone' | 'tablet' | 'laptop' | 'desktop' | 'wear' | 'console';
  imei: string;
  imeiCheck: Record<BaseId, 'pending' | 'ok' | 'fail'>;
  tests: Record<TestId, {
    status: 'pending' | 'running' | 'ok' | 'warn' | 'fail';
    result?: any;
  }>;
  score: number;            // 0–100
  reportId: string;          // para QR
};
```
Persistir en `localStorage` como JSON bajo `smartcheck.state`. Re-hidratar en mount.

---

## Assets
- **Fuentes**: Google Fonts (Geist, Inter, JetBrains Mono). Self-host en producción.
- **Íconos**: SVG inline custom (ver `landing/src/icons.jsx`). Son simples, path-based, usan `currentColor`. Se pueden portar a `lucide-react` / `phosphor-icons` con estilos equivalentes, pero recomendamos mantener el set custom para consistencia.
- **Logo**: V4 SVG inline (ver `landing/src/logo.jsx` y `brand/V4 Palette Test.html`). Exportar como `logo.svg` + `logo-mark.svg` + `logo-icon-*.png` (32/192/512) para favicon/PWA.
- **No hay assets bitmap** en el diseño.

---

## Responsive
- Landing: breakpoints Tailwind estándar. Hero y secciones colapsan a 1 columna en `<lg` (1024px). Device mockup del hero se oculta en `<md` (~768px).
- App: diseñada para mobile (390×844). Desktop muestra la app dentro de un frame mobile centrado, o adaptada a ventana con max-width 440px (decisión del dev).

---

## Archivos en este bundle

```
design_handoff_smartcheck/
├── README.md                          ← este archivo
├── screenshots/                       ← referencia visual del flujo
│   ├── 01-08-landing.jpg              ← landing desde hero hasta footer
│   └── 01-12-app.jpg                  ← 12 pantallas clave de la app en orden
├── landing/
│   ├── index.html                     ← landing completa (TailwindCDN + React via Babel)
│   └── src/
│       ├── app.jsx                    ← root + tweaks
│       ├── logo.jsx                   ← Logo V4 + DeviceGlyph
│       ├── icons.jsx                  ← todo el set de íconos SVG
│       ├── hero.jsx                   ← hero + device mockup animado
│       ├── sections.jsx               ← trust / problem-solution / steps / what-we-analyze / benefits / use-cases / testimonials / footer
│       ├── demo.jsx                   ← InteractiveDemo simulado
│       ├── pricing-faq.jsx            ← Pricing + FAQ + FinalCTA
│       └── tweaks.jsx                 ← panel de edición en vivo (ignorable)
├── app/
│   ├── app.html                       ← web app de diagnóstico
│   └── app/
│       ├── app.jsx                    ← router + state + persistencia
│       ├── shell.jsx                  ← top bar + bottom bar + screen picker
│       ├── screens-a.jsx              ← bienvenida / tipo / IMEI / chequeo / menú
│       ├── screens-b.jsx              ← táctil / pantalla / audio / cámaras
│       └── screens-c.jsx              ← sensores / batería / conectividad / botones / resumen / reporte
└── brand/
    ├── Isologo Exploration.html       ← 12 direcciones de logo exploradas (referencia)
    ├── V4 Palette Test.html           ← logo final en 8 combinaciones + tests de escala
    └── design-canvas.jsx              ← solo para los archivos brand (ignorable en producción)
```

## Cómo abrir los prototipos
Los archivos HTML cargan desde CDN — solo hay que abrirlos con un server local:
```bash
cd design_handoff_smartcheck
python3 -m http.server 8000
# o: npx serve .
```
Luego visitar `http://localhost:8000/landing/` y `http://localhost:8000/app/`.
