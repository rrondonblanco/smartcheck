// SmartCheck MVP Backend
// =======================
// Express + mock DB. Diseñado para handoff al equipo TI de Reuse.
// El equipo TI puede portar esto a NestJS, Spring Boot, lo que use, sin sorpresas.
//
// Puerto: 8767 (no choca con server Ruby HTTP 8765 ni HTTPS 8766)
// Arranque: cd server && npm install && npm start
//
// Endpoints:
//   GET  /health                        → healthcheck
//   GET  /api/lookup/:tac               → resuelve TAC → device info
//   POST /api/lookup/:imei/checks       → validaciones (stolen, carrier, iCloud, warranty, ICCID)
//   POST /api/session                   → crea una sesión (devuelve sessionId)
//   GET  /api/session/:id               → obtiene sesión
//   POST /api/report                    → persiste reporte final
//   GET  /api/report/:id                → recupera reporte por ID
//   POST /api/probe/upload              → APK Android sube medición de batería
//   GET  /api/probe/:sessionId/status   → frontend Web polea estado de la medición
//
// Notas para el equipo TI:
//   - Toda la persistencia está en memoria (sessions, reports). Productivo: PostgreSQL.
//   - tacs.json es el catálogo offline. Productivo: tabla tac con índice + sync semanal GSMA.
//   - Los "checks" están mockeados. Productivo: integraciones reales (GSMA, Apple GSX, Samsung GSPN, blacklist LATAM).
//   - CORS está totalmente abierto. Productivo: lista blanca de dominios (smartcheck.reuse.cl, partners).
//   - No hay auth. Productivo: JWT con scope por partnerId.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const app = express();
const HTTP_PORT = process.env.PORT || 8767;
const HTTPS_PORT = process.env.HTTPS_PORT || 8768;

// --- Setup ---
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Servir archivos estáticos del root del repo (web del prototipo).
// En producción (Render) esto hace que la web y la API vivan en la misma URL,
// eliminando los problemas de cert separado por puerto que tienen los iPhones.
// En local sigue funcionando — Express sirve el HTML, pero podés seguir usando
// el server Ruby para iterar más rápido sin reiniciar Express.
const WEB_ROOT = path.join(__dirname, '..');
app.use(express.static(WEB_ROOT, {
  index: false,                          // queremos controlar la ruta '/' explícitamente
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    // El HTML cambia seguido durante iteración; no queremos cache agresivo.
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    if (filePath.endsWith('.apk'))  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  },
}));

// Ruta '/' redirige al HTML principal del prototipo
app.get('/', (_req, res) => res.redirect('/app%20v2.html'));

// Carga el catálogo TAC al arranque
const TAC_DB_PATH = path.join(__dirname, 'db', 'tacs.json');
let TAC_DB = { tacs: {} };
try {
  TAC_DB = JSON.parse(fs.readFileSync(TAC_DB_PATH, 'utf-8'));
  console.log(`[SmartCheck] TAC DB loaded: ${Object.keys(TAC_DB.tacs).length} entries from ${TAC_DB_PATH}`);
} catch (err) {
  console.error(`[SmartCheck] ERROR loading TAC DB: ${err.message}`);
  console.error(`[SmartCheck] Expected file at: ${TAC_DB_PATH}`);
}

// In-memory stores (productivo: PostgreSQL)
const sessions = new Map();
const reports = new Map();
// probeMeasurements: sessionId → { state, data, receivedAt }
//   state: 'waiting' (la web creó la sesión y espera al APK) | 'measuring' (el APK está midiendo) | 'done'
const probeMeasurements = new Map();

// --- Helpers ---
function validateImeiLuhn(imei) {
  if (!/^\d{15}$/.test(imei)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = parseInt(imei[i], 10);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

// Genera un check pseudo-determinístico basado en el IMEI
// Para que el mismo IMEI siempre devuelva los mismos resultados (útil en demos repetibles)
function deterministicCheck(imei, checkName, weights) {
  const seed = crypto.createHash('sha256').update(imei + checkName).digest('hex');
  const num = parseInt(seed.substring(0, 4), 16) / 0xffff;
  let acc = 0;
  for (const [status, weight] of weights) {
    acc += weight;
    if (num <= acc) return status;
  }
  return weights[weights.length - 1][0];
}

// --- Routes ---

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'smartcheck-mvp',
    version: '0.1.0',
    tacEntries: Object.keys(TAC_DB.tacs).length,
    uptime: process.uptime(),
  });
});

// GET /api/devices → lista todos los modelos conocidos (para dropdown manual)
// El frontend lo usa cuando un TAC no resuelve, para que el operador pueda
// elegir el modelo a mano y continuar el flujo sin abortar la demo.
app.get('/api/devices', (_req, res) => {
  const seen = new Set();
  const list = [];
  for (const [tac, d] of Object.entries(TAC_DB.tacs)) {
    // Dedupe por brand+model (varios TACs apuntan al mismo modelo, ej. variantes 5G/LTE)
    const key = `${d.brand}|${d.model}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({
      tac,
      brand: d.brand,
      model: d.model,
      modelNumber: d.modelNumber,
      os: d.os,
      year: d.year,
      designCapacityMAh: d.designCapacityMAh,
      category: d.category,
      capabilities: d.capabilities,
    });
  }
  // Orden: marca asc, año desc (modelos más nuevos arriba dentro de cada marca)
  list.sort((a, b) => a.brand.localeCompare(b.brand) || (b.year || 0) - (a.year || 0));
  res.json({ count: list.length, devices: list });
});

// GET /api/lookup/:tac → resuelve TAC → device info
app.get('/api/lookup/:tac', (req, res) => {
  const tac = req.params.tac;

  if (!/^\d{8}$/.test(tac)) {
    return res.status(400).json({
      error: 'invalid_tac',
      message: 'TAC debe ser 8 dígitos numéricos',
    });
  }

  const device = TAC_DB.tacs[tac];

  if (!device) {
    return res.status(404).json({
      error: 'tac_not_found',
      message: `TAC ${tac} no está en el catálogo. En producción haríamos fallback a GSMA/Sickw API.`,
      tac,
      fallback: {
        brand: 'Desconocido',
        model: 'Modelo no detectado',
        os: 'unknown',
        category: 'phone',
        capabilities: ['screen', 'touch', 'camera', 'mic', 'battery-web-only', 'buttons', 'connectivity', 'sensors'],
      },
    });
  }

  res.json({
    tac,
    ...device,
    source: 'internal_db',
  });
});

// POST /api/lookup/:imei/checks → validaciones IMEI
app.post('/api/lookup/:imei/checks', (req, res) => {
  const imei = req.params.imei;

  if (!/^\d{15}$/.test(imei)) {
    return res.status(400).json({
      error: 'invalid_imei',
      message: 'IMEI debe ser 15 dígitos numéricos',
    });
  }

  if (!validateImeiLuhn(imei)) {
    return res.status(400).json({
      error: 'invalid_luhn',
      message: 'IMEI inválido (checksum Luhn no coincide)',
    });
  }

  // Mock determinístico: el mismo IMEI siempre devuelve los mismos checks
  // 85% probabilidad de "ok", 10% "warning", 5% "fail"
  const weights = [['ok', 0.85], ['warning', 0.10], ['fail', 0.05]];
  const checkNames = [
    { name: 'GSMA registry', notes: { ok: 'Equipo registrado y limpio', warning: 'Registro parcial', fail: 'No registrado en GSMA' } },
    { name: 'Reporte robo LATAM', notes: { ok: 'Sin reportes en bases LATAM', warning: 'Reporte previo resuelto', fail: 'Reportado como robado' } },
    { name: 'Lista negra carrier', notes: { ok: 'No bloqueado por carrier', warning: 'Bloqueo parcial', fail: 'Bloqueado por operador' } },
    { name: 'Bloqueo iCloud / FRP', notes: { ok: 'Sin activación bloqueada', warning: 'Verificar con propietario', fail: 'Activation Lock activo' } },
    { name: 'Estado garantía', notes: { ok: 'En garantía vigente', warning: 'Fuera de garantía', fail: 'Garantía nula por daño' } },
    { name: 'ICCID cross', notes: { ok: 'SIM coincide con registros', warning: 'SIM cambiada recientemente', fail: 'Discrepancia en ICCID' } },
  ];

  const checks = checkNames.map(c => {
    const status = deterministicCheck(imei, c.name, weights);
    return {
      name: c.name,
      status,
      note: c.notes[status],
    };
  });

  // Estado global: ok si todos ok, warning si algún warning, fail si algún fail
  let globalStatus = 'ok';
  if (checks.some(c => c.status === 'fail')) globalStatus = 'fail';
  else if (checks.some(c => c.status === 'warning')) globalStatus = 'warning';

  res.json({
    imei,
    status: globalStatus,
    checks,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/session → crea una sesión
app.post('/api/session', (req, res) => {
  const sessionId = crypto.randomBytes(8).toString('hex').toUpperCase();
  const session = {
    sessionId,
    createdAt: new Date().toISOString(),
    partnerId: req.body.partnerId || 'reuse-cl',
    tradeInRef: req.body.tradeInRef || null, // referencia opcional al sistema Trade-In
    status: 'open',
  };
  sessions.set(sessionId, session);
  res.status(201).json(session);
});

app.get('/api/session/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  res.json(session);
});

// POST /api/report → persiste reporte final
app.post('/api/report', (req, res) => {
  const { sessionId, imei, device, results, score, imeiCheck } = req.body;

  if (!imei || !results) {
    return res.status(400).json({ error: 'missing_fields', required: ['imei', 'results'] });
  }

  const reportId = crypto.randomBytes(4).toString('hex').toUpperCase();
  const folio = `SC-${reportId}`;
  const signaturePayload = JSON.stringify({ imei, results, ts: Date.now() });
  const signature = 'sha256:' + crypto.createHash('sha256').update(signaturePayload).digest('hex');

  const report = {
    reportId,
    folio,
    sessionId: sessionId || null,
    imei,
    device: device || null,
    results,
    imeiCheck: imeiCheck || null,
    score: score || 0,
    signature,
    createdAt: new Date().toISOString(),
    shareUrl: `https://smartcheck.reuse.cl/r/${reportId}`,
  };
  reports.set(reportId, report);

  res.status(201).json(report);
});

app.get('/api/report/:id', (req, res) => {
  const report = reports.get(req.params.id);
  if (!report) return res.status(404).json({ error: 'report_not_found' });
  res.json(report);
});

// =====================================================================
// SmartCheck Probe (Android APK) — endpoints
// =====================================================================
// Flujo:
//   1. La Web crea (o usa una) sessionId existente.
//   2. La Web le muestra al cliente un QR con deep-link smartcheck://probe?sessionId=...
//   3. El cliente escanea, se instala el APK y abre el deep-link.
//   4. El APK lee BatteryManager + /sys/class/power_supply/ y hace POST /api/probe/upload.
//   5. La Web hace polling a GET /api/probe/:sessionId/status hasta que state==='done'.
//
// Decisión: los datos del Probe quedan asociados a sessionId, no a IMEI.
// Cuando la Web persista el reporte vía /api/report, mergea estos datos al payload final.

// POST /api/probe/upload
app.post('/api/probe/upload', (req, res) => {
  const {
    sessionId,
    imei,            // opcional — el APK puede no tenerlo (flujo principal: la Web ya lo capturó)
    device,
    battery,
    estimate,        // NUEVO — resultado del Coulomb counting (HealthEstimator del APK)
    designCapacityMAh, // NUEVO — eco del valor que la web pasó vía deep-link
    method,
    probeVersion,
    timestamp,
  } = req.body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'missing_sessionId' });
  }
  if (!battery || typeof battery !== 'object') {
    return res.status(400).json({ error: 'missing_battery_payload' });
  }

  // Validación mínima de campos críticos. Aceptamos null/undefined (algunos devices
  // no exponen todos los counters), pero healthPct fuera de rango es un red flag.
  const healthPct = Number(battery.healthPct);
  if (Number.isFinite(healthPct) && (healthPct < 0 || healthPct > 110)) {
    return res.status(400).json({
      error: 'invalid_health_pct',
      message: 'healthPct fuera de rango razonable [0–110]',
      received: battery.healthPct,
    });
  }

  const measurement = {
    sessionId,
    imei: imei || null,
    device: device || null,
    battery,
    estimate: estimate || null,
    designCapacityMAh: designCapacityMAh || null,
    method: method || 'android-probe',
    probeVersion: probeVersion || 'unknown',
    timestamp: timestamp || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };

  probeMeasurements.set(sessionId, {
    state: 'done',
    data: measurement,
    receivedAt: measurement.receivedAt,
  });

  const estHealth = estimate?.status === 'ok' ? `${estimate.healthPct?.toFixed?.(1) ?? estimate.healthPct}% (${estimate.confidence})` : (estimate?.status || 'n/a');
  console.log(`[Probe] upload OK · session=${sessionId} · ${device?.manufacturer || '?'}/${device?.model || '?'} · OEM=${battery.healthPct ?? '?'}% · estimate=${estHealth} · design=${designCapacityMAh || '?'}mAh`);

  res.json({
    ok: true,
    sessionId,
    received: measurement.receivedAt,
  });
});

// GET /api/probe/:sessionId/status
// Estados:
//   - 'waiting':   la web aún no recibió nada (no hay entrada o explícitamente marcada)
//   - 'measuring': el APK avisó que arrancó (futuro — opcional)
//   - 'done':      la medición llegó completa
app.get('/api/probe/:sessionId/status', (req, res) => {
  const { sessionId } = req.params;
  const entry = probeMeasurements.get(sessionId);

  if (!entry) {
    return res.json({ state: 'waiting', data: null });
  }
  res.json({ state: entry.state, data: entry.data || null });
});

// --- Start ---
// HTTP siempre arranca (para pruebas locales desde la Mac)
http.createServer(app).listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`[SmartCheck] HTTP backend  → http://0.0.0.0:${HTTP_PORT}`);
});

// HTTPS arranca si encontramos los certs (necesario para llamadas desde móvil en HTTPS)
const certPath = path.join(__dirname, '..', 'tools', 'cert.pem');
const keyPath = path.join(__dirname, '..', 'tools', 'key.pem');
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  try {
    const sslOpts = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    };
    https.createServer(sslOpts, app).listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`[SmartCheck] HTTPS backend → https://0.0.0.0:${HTTPS_PORT} (mismos certs que serve_https.rb)`);
    });
  } catch (err) {
    console.warn(`[SmartCheck] HTTPS no pudo arrancar: ${err.message}`);
    console.warn(`[SmartCheck] El backend solo escuchará HTTP en :${HTTP_PORT}`);
  }
} else {
  console.warn(`[SmartCheck] No encontré certs en tools/ — HTTPS no disponible. Sólo HTTP en :${HTTP_PORT}`);
}

console.log(`[SmartCheck] Try: curl http://localhost:${HTTP_PORT}/health`);
console.log(`[SmartCheck] Try: curl http://localhost:${HTTP_PORT}/api/lookup/35353215`);
