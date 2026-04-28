function SensorsTest({ save, back, skip }) {
  const [rotation, setRotation] = React.useState({x:0,y:0});
  const [proxDetected, setProxDetected] = React.useState(false);
  const [tilted, setTilted] = React.useState(false);

  React.useEffect(()=>{
    let id;
    const handler = (e) => {
      const x = e.beta || 0, y = e.gamma || 0;
      setRotation({x,y});
      if (Math.abs(x) > 30 || Math.abs(y) > 30) setTilted(true);
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handler);
    } else {
      let t = 0;
      id = setInterval(()=>{ t += 0.1; setRotation({x:Math.sin(t)*30, y:Math.cos(t)*25}); if (t>2) setTilted(true); }, 80);
    }
    return () => { window.removeEventListener('deviceorientation', handler); id && clearInterval(id); };
  }, []);

  const canPass = tilted && proxDetected;
  return (
    <TestShell title="Sensores" back={back} onSkip={skip} canPass={canPass}
      onPass={()=>save('sensors',{status:'pass',detail:'Giroscopio, acelerómetro y proximidad OK'})}
      onFail={()=>save('sensors',{status:'fail',detail:'Sensor no responde'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">Inclina el teléfono</div>
        <div className="text-white/60 text-[13px] mt-1">Giroscopio, acelerómetro y proximidad.</div>
      </div>
      <div className="px-5 mt-5 space-y-3">
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-[13px] font-semibold">Giroscopio + acelerómetro</div>
              <div className="text-white/50 text-[11px] mt-0.5 font-mono">x: {rotation.x.toFixed(1)}° · y: {rotation.y.toFixed(1)}°</div>
            </div>
            <ResultBadge ok={tilted ? 'pass' : undefined}/>
          </div>
          <div className="mt-4 aspect-square max-w-[180px] mx-auto rounded-full bg-black/40 ring-1 ring-white/10 flex items-center justify-center relative">
            <div className="absolute w-full h-px bg-white/10"></div>
            <div className="absolute h-full w-px bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-mint-500 shadow-[0_0_20px_rgba(198,255,173,0.6)] transition-all" style={{transform:`translate(${rotation.y*1.5}px, ${rotation.x*1.5}px)`}}></div>
          </div>
          {!tilted && <div className="mt-3 text-center text-[11px] text-white/50">Inclinalo 30° o más</div>}
        </div>

        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${proxDetected ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white'}`}>
            <I.Sensor size={20}/>
          </div>
          <div className="flex-1">
            <div className="text-white text-[13px] font-semibold">Proximidad</div>
            <div className="text-white/50 text-[11px]">{proxDetected ? 'Detectado correctamente' : 'Cubrí la parte superior'}</div>
          </div>
          <button onClick={()=>setProxDetected(true)} disabled={proxDetected}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11.5px] font-medium disabled:opacity-40">
            Simular
          </button>
        </div>
      </div>
    </TestShell>
  );
}

function BatteryTest({ save, back, skip }) {
  const [data, setData] = React.useState(null);
  React.useEffect(()=>{
    const t = setTimeout(()=>setData({ health: 94, cycles: 312, temp: 32, level: 87 }), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <TestShell title="Batería" back={back} onSkip={skip} canPass={!!data}
      onPass={()=>save('battery',{status:'pass',detail:`Salud ${data.health}% · ${data.cycles} ciclos`})}
      onFail={()=>save('battery',{status:'fail',detail:'Degradación crítica'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">Salud de la batería</div>
        <div className="text-white/60 text-[13px] mt-1">Capacidad, ciclos y temperatura.</div>
      </div>
      <div className="px-5 mt-5">
        {!data ? (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-white/30 border-t-mint-500 rounded-full spin-slow"></div>
            <div className="text-white/70 text-[13px]">Analizando batería…</div>
          </div>
        ) : (
          <div className="space-y-3 fade-up">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">Salud</div>
                  <div className="font-display text-white text-[40px] font-semibold leading-none mt-1">{data.health}<span className="text-[22px] text-white/50">%</span></div>
                </div>
                <div className="rounded-full bg-mint-500/15 text-mint-400 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5 ring-1 ring-mint-500/30">Excelente</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-mint-500" style={{width:`${data.health}%`}}></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['Ciclos',data.cycles],['Temp.',`${data.temp}°`],['Carga',`${data.level}%`]].map(([l,v])=>(
                <div key={l} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-center">
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">{l}</div>
                  <div className="font-display text-white text-[18px] font-semibold mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TestShell>
  );
}

function ConnectivityTest({ save, back, skip }) {
  const [checks, setChecks] = React.useState({wifi:null, bt:null, gps:null});
  React.useEffect(()=>{
    const steps = [['wifi',500],['bt',1100],['gps',1800]];
    steps.forEach(([k,t])=>setTimeout(()=>setChecks(c=>({...c,[k]:'ok'})), t));
  }, []);
  const allOk = checks.wifi && checks.bt && checks.gps;
  return (
    <TestShell title="Conectividad" back={back} onSkip={skip} canPass={allOk}
      onPass={()=>save('connectivity',{status:'pass',detail:'Wi-Fi, Bluetooth y GPS operativos'})}
      onFail={()=>save('connectivity',{status:'fail',detail:'Módulo de red falla'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">Radios y ubicación</div>
        <div className="text-white/60 text-[13px] mt-1">Probamos cada módulo.</div>
      </div>
      <div className="px-5 mt-5 space-y-2.5">
        {[
          ['wifi','Wi-Fi 6 (ax)', <I.Wifi size={18}/>,'conectado a 867 Mbps'],
          ['bt','Bluetooth 5.3', <I.Bluetooth size={18}/>,'dispositivos cercanos: 4'],
          ['gps','GPS', <I.Gps size={18}/>,'±3.2m · 7 satélites'],
        ].map(([k,l,ic,sub])=>{
          const done = checks[k]==='ok';
          return (
            <div key={k} className={`flex items-center gap-3 rounded-2xl p-4 ring-1 ${done ? 'bg-mint-500/10 ring-mint-500/30' : 'bg-white/5 ring-white/10'}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${done ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white'}`}>{ic}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[13px] font-semibold">{l}</div>
                <div className="text-white/50 text-[11px]">{done ? sub : 'probando…'}</div>
              </div>
              {done ? <I.Check size={16} stroke={3} className="text-mint-400"/> : <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin-slow"/>}
            </div>
          );
        })}
      </div>
    </TestShell>
  );
}

function ButtonsTest({ save, back, skip }) {
  const [hit, setHit] = React.useState(new Set());
  const btns = ['power','vol-up','vol-down','charge'];
  const allHit = btns.every(b=>hit.has(b));
  return (
    <TestShell title="Botones y carga" back={back} onSkip={skip} canPass={allHit}
      onPass={()=>save('buttons',{status:'pass',detail:'4 controles verificados'})}
      onFail={()=>save('buttons',{status:'fail',detail:'Botón sin respuesta'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">Botones físicos y puerto</div>
        <div className="text-white/60 text-[13px] mt-1">Presioná cada botón.</div>
      </div>
      <div className="px-5 mt-6">
        <div className="relative mx-auto w-[180px] aspect-[1/2] rounded-[34px] bg-black ring-1 ring-white/10 p-1.5">
          <div className="relative w-full h-full rounded-[28px] bg-gradient-to-b from-ink-700 to-ink-900 overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-14 rounded-full bg-black/60"></div>
            <div className="absolute inset-4 top-8 rounded-xl bg-white/5 ring-1 ring-white/10"></div>
          </div>
          <button onClick={()=>setHit(s=>new Set([...s,'power']))}
            className={`absolute -right-1.5 top-24 w-2 h-14 rounded-r ${hit.has('power') ? 'bg-mint-500' : 'bg-white/40'} transition`}></button>
          <button onClick={()=>setHit(s=>new Set([...s,'vol-up']))}
            className={`absolute -left-1.5 top-20 w-2 h-10 rounded-l ${hit.has('vol-up') ? 'bg-mint-500' : 'bg-white/40'} transition`}></button>
          <button onClick={()=>setHit(s=>new Set([...s,'vol-down']))}
            className={`absolute -left-1.5 top-32 w-2 h-10 rounded-l ${hit.has('vol-down') ? 'bg-mint-500' : 'bg-white/40'} transition`}></button>
          <button onClick={()=>setHit(s=>new Set([...s,'charge']))}
            className={`absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-2 w-14 rounded-b ${hit.has('charge') ? 'bg-mint-500' : 'bg-white/40'} transition`}></button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {[['power','Encendido'],['vol-up','Volumen +'],['vol-down','Volumen −'],['charge','Puerto carga']].map(([id,l])=>(
            <div key={id} className={`rounded-xl ring-1 p-3 flex items-center gap-2 ${hit.has(id) ? 'bg-mint-500/10 ring-mint-500/30' : 'bg-white/5 ring-white/10'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${hit.has(id) ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white/40'}`}>
                {hit.has(id) ? <I.Check size={11} stroke={3}/> : <span className="w-1 h-1 bg-white/40 rounded-full"/>}
              </div>
              <div className="text-white text-[12px] font-medium">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </TestShell>
  );
}

function SummaryScreen({ state, next, back }) {
  const results = state.results || {};
  const [generating, setGenerating] = React.useState(true);
  React.useEffect(()=>{ const t=setTimeout(()=>setGenerating(false), 1800); return ()=>clearTimeout(t); }, []);

  const testList = [
    ['touch','Pantalla táctil',<I.Touch size={14}/>],
    ['display','Pantalla LED',<I.Screen size={14}/>],
    ['audio','Audio',<I.Speaker size={14}/>],
    ['camera','Cámaras',<I.Camera size={14}/>],
    ['sensors','Sensores',<I.Sensor size={14}/>],
    ['battery','Batería',<I.Battery size={14}/>],
    ['connectivity','Conectividad',<I.Wifi size={14}/>],
    ['buttons','Botones / carga',<I.Plug size={14}/>],
  ];
  const passCount = testList.filter(([k])=>results[k]?.status==='pass').length;
  const failCount = testList.filter(([k])=>results[k]?.status==='fail').length;
  const score = Math.round((passCount / testList.length) * 100);

  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Generando reporte" onBack={back} step={7} total={8}/>
      <div className="flex-1 overflow-y-auto pb-28 hide-scroll">
        {generating ? (
          <div className="h-full flex flex-col items-center justify-center px-5 -mt-12">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                <circle cx="20" cy="20" r="17" fill="none" stroke="#C6FFAD" strokeWidth="3" strokeDasharray="80 106.8" strokeLinecap="round" className="spin-slow origin-center"/>
              </svg>
            </div>
            <div className="mt-6 font-display text-white text-[18px] font-semibold">Compilando evidencias</div>
            <div className="mt-1 text-white/50 text-[12px]">Firmando reporte…</div>
          </div>
        ) : (
          <div className="px-5 pt-3 fade-up">
            <div className="rounded-3xl bg-gradient-to-br from-mint-500 to-mint-600 text-ink-900 p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">SmartCheck Score</div>
                <div className="font-mono text-[10px] opacity-60">20 · abr · 2026</div>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <div className="font-display text-[72px] font-semibold leading-none">{score}</div>
                <div className="pb-2 opacity-70 font-mono text-[11px]">/100</div>
              </div>
              <div className="mt-1 text-[13px] font-semibold">{score >= 85 ? 'Equipo en excelente estado' : score >= 60 ? 'Equipo operativo con observaciones' : 'Equipo con fallas críticas'}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-ink-900/10 py-2"><div className="font-display font-semibold text-[18px]">{passCount}</div><div className="text-[10px] opacity-70 uppercase">OK</div></div>
                <div className="rounded-xl bg-ink-900/10 py-2"><div className="font-display font-semibold text-[18px]">{failCount}</div><div className="text-[10px] opacity-70 uppercase">Fallas</div></div>
                <div className="rounded-xl bg-ink-900/10 py-2"><div className="font-display font-semibold text-[18px]">{testList.length - passCount - failCount}</div><div className="text-[10px] opacity-70 uppercase">N/D</div></div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Dispositivo</div>
              <div className="mt-1 text-white font-display font-semibold text-[16px]">Samsung Galaxy A54 5G</div>
              <div className="text-[11px] text-white/50 font-mono mt-0.5">IMEI · {(state.imei||'').replace(/(\d{3})(?=\d)/g,'$1 ')}</div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-mint-400">
                <I.Shield size={12}/> Sin reportes · equipo libre
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              {testList.map(([k,l,ic])=>{
                const r = results[k];
                return (
                  <div key={k} className="flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r?.status==='pass' ? 'bg-mint-500/15 text-mint-400' : r?.status==='fail' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white/60'}`}>{ic}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[12.5px] font-semibold">{l}</div>
                      <div className="text-white/50 text-[10.5px] truncate">{r?.detail || 'Sin datos'}</div>
                    </div>
                    <ResultBadge ok={r?.status}/>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {!generating && (
        <BottomBar>
          <PrimaryBtn onClick={next}>Ver reporte completo <I.Arrow size={16}/></PrimaryBtn>
        </BottomBar>
      )}
    </div>
  );
}

function ReportScreen({ state, back, restart }) {
  const [copied, setCopied] = React.useState(false);
  const link = 'smartcheck.app/r/a3f8-22-k9-9e';
  const qr = React.useMemo(()=>Array.from({length:49}).map(()=>Math.random()>0.5), []);
  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Reporte listo" onBack={back}/>
      <div className="flex-1 overflow-y-auto pb-28 hide-scroll">
        <div className="px-5 pt-2 fade-up">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-ink-700 to-ink-800 ring-1 ring-white/10 p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mint-500/20 blur-3xl rounded-full"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Reporte #A3F8-22</div>
                <div className="mt-2 font-display text-white text-[24px] font-semibold leading-tight">Diagnóstico completo</div>
                <div className="text-[12px] text-white/60 mt-1">20 de abril, 2026 · 14:32 · firmado</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-mint-500 text-ink-900 flex items-center justify-center">
                <I.File size={22}/>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white p-3">
              <div className="w-20 h-20 rounded-lg bg-ink-900 grid grid-cols-7 grid-rows-7 gap-[2px] p-1">
                {qr.map((on,i)=>(
                  <div key={i} className={`rounded-[1px] ${on ? 'bg-white' : 'bg-ink-900'}`}></div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase text-ink-500 font-semibold tracking-wider">Compartir</div>
                <div className="font-mono text-ink-900 text-[11px] truncate">{link}</div>
                <button onClick={()=>{setCopied(true); setTimeout(()=>setCopied(false),1500);}}
                  className="mt-1.5 text-[11px] font-semibold text-mint-700">{copied ? 'Copiado ✓' : 'Copiar enlace'}</button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[['Descargar PDF',<I.Download size={16}/>],['Compartir',<I.Share size={16}/>],['Imprimir',<I.File size={16}/>]].map(([l,ic])=>(
              <button key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-3 flex flex-col items-center gap-1.5 text-white hover:bg-white/[0.08]">
                <span className="text-mint-400">{ic}</span>
                <span className="text-[11px] font-medium">{l}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="flex items-center gap-2 text-white text-[13px] font-semibold"><I.Lock size={14} className="text-mint-400"/> Firma criptográfica</div>
            <div className="mt-2 font-mono text-[10px] text-white/50 break-all leading-relaxed">
              sha256:a3f8b71c22c991a0e4d...8e9f · ts:1713631920
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 text-[11.5px] text-white/60 leading-relaxed">
              Firmado con el timestamp del servidor. Cualquier modificación invalida la firma.
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-mint-500/10 ring-1 ring-mint-500/30 p-4">
            <div className="text-mint-400 text-[11px] font-semibold tracking-wide uppercase">Próximo paso</div>
            <div className="mt-1 text-white text-[13.5px] font-semibold">Compartí el link con el comprador antes de cerrar la venta.</div>
          </div>
        </div>
      </div>
      <BottomBar>
        <button onClick={restart} className="w-full rounded-2xl bg-white/10 text-white ring-1 ring-white/15 font-semibold text-[14px] py-4 hover:bg-white/15">
          Nuevo diagnóstico
        </button>
      </BottomBar>
    </div>
  );
}

Object.assign(window, { SensorsTest, BatteryTest, ConnectivityTest, ButtonsTest, SummaryScreen, ReportScreen });
