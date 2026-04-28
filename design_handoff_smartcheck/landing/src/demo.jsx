function InteractiveDemo() {
  const steps = [
    {
      id: 'imei', title: 'Verificación de IMEI', sub: 'Cruce contra 6 bases internacionales',
      body: 'imei',
    },
    {
      id: 'touch', title: 'Digitalizador táctil', sub: 'Tocá los 8 cuadrantes',
      body: 'touch',
    },
    {
      id: 'audio', title: 'Audio y micrófono', sub: 'Tono de 440 Hz + grabación de 2s',
      body: 'audio',
    },
    {
      id: 'battery', title: 'Salud de batería', sub: 'Ciclos, capacidad y temperatura',
      body: 'battery',
    },
  ];
  const [active, setActive] = React.useState(0);
  const [touched, setTouched] = React.useState([]);
  const [imeiProg, setImeiProg] = React.useState(0);
  const [audioBars, setAudioBars] = React.useState(new Array(24).fill(0));

  React.useEffect(() => {
    setTouched([]); setImeiProg(0);
    let t;
    if (steps[active].body === 'imei') {
      t = setInterval(() => setImeiProg(p => (p >= 100 ? 100 : p + 4)), 60);
    } else if (steps[active].body === 'touch') {
      let i = 0;
      t = setInterval(() => { i++; setTouched(arr => [...arr, i-1]); if (i >= 8) clearInterval(t); }, 380);
    } else if (steps[active].body === 'audio') {
      t = setInterval(() => setAudioBars(b => b.map(() => Math.random())), 120);
    }
    return () => clearInterval(t);
  }, [active]);

  const next = () => setActive(a => (a + 1) % steps.length);
  const prev = () => setActive(a => (a - 1 + steps.length) % steps.length);

  return (
    <section id="demo" className="py-24 lg:py-32 bg-white border-y border-ink-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            eyebrow="Demo interactiva"
            title="Probalo ahora mismo."
            subtitle="Navegá los pasos reales. Sin registro. Sin instalación. Sin fricción."
          />
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white ring-1 ring-ink-100 hover:ring-ink-900 flex items-center justify-center" aria-label="Anterior">
              <I.ChevronRight size={16} className="rotate-180"/>
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full bg-ink-900 text-white hover:bg-ink-800 flex items-center justify-center" aria-label="Siguiente">
              <I.ChevronRight size={16}/>
            </button>
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Step rail */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={()=>setActive(i)}
                className={`text-left rounded-2xl px-4 py-3.5 ring-1 transition-all shrink-0 min-w-[240px] lg:min-w-0 ${i===active ? 'bg-ink-900 text-white ring-ink-900' : 'bg-canvas ring-ink-100 text-ink-900 hover:ring-ink-300'}`}>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[11px] ${i===active ? 'text-mint-400' : 'text-ink-400'}`}>0{i+1}</span>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold">{s.title}</div>
                    <div className={`text-[11.5px] mt-0.5 ${i===active ? 'text-white/60' : 'text-ink-400'}`}>{s.sub}</div>
                  </div>
                  {i===active && <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></div>}
                </div>
              </button>
            ))}
          </div>

          {/* Stage */}
          <div className="relative rounded-3xl bg-ink-900 overflow-hidden min-h-[460px] shadow-lift">
            <div className="absolute inset-0 opacity-[0.06] noise"></div>
            {/* top bar */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
              </div>
              <div className="font-mono text-[11px] text-white/50 tracking-wider">smartcheck.app/run/a3f8-22</div>
              <div className="flex items-center gap-1.5 text-mint-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse"></span>
                en vivo
              </div>
            </div>

            <div className="relative p-8 lg:p-10">
              {steps[active].body === 'imei' && <ImeiStage progress={imeiProg}/>}
              {steps[active].body === 'touch' && <TouchStage touched={touched}/>}
              {steps[active].body === 'audio' && <AudioStage bars={audioBars}/>}
              {steps[active].body === 'battery' && <BatteryStage/>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImeiStage({ progress }) {
  const done = progress >= 100;
  const bases = ['GSMA', 'CheckMEND', 'ICCID DB', 'Op. LATAM', 'Stolen DB', 'Carrier'];
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <div className="text-mint-400 text-[11px] font-semibold tracking-wide uppercase">Paso 01 · IMEI</div>
        <div className="mt-2 font-display text-white text-[28px] font-semibold leading-tight">Ingresá o escaneá el IMEI.</div>
        <div className="mt-3 text-white/60 text-[14px]">Cruzamos el número contra bases de robo, bloqueo y lista negra en tiempo real.</div>

        <div className="mt-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
          <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">IMEI</div>
          <div className="mt-1 font-mono text-[18px] text-white tracking-wider">359 123 456 789 012</div>
        </div>

        <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-mint-500 transition-all" style={{width: progress + '%'}}/>
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-mono text-white/50">
          <span>consultando · {progress}%</span>
          <span>~ 1.2s</span>
        </div>
      </div>

      <div className="space-y-2">
        {bases.map((b, i) => {
          const reached = progress > i * 16;
          return (
            <div key={b} className={`flex items-center justify-between rounded-xl px-4 py-3 ring-1 transition-all ${reached ? 'bg-mint-500/10 ring-mint-500/30' : 'bg-white/[0.03] ring-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${reached ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white/40'}`}>
                  {reached ? <I.Check size={14} stroke={3}/> : <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"/>}
                </div>
                <div className="text-white text-[13.5px] font-medium">{b}</div>
              </div>
              <div className={`text-[11px] font-mono ${reached ? 'text-mint-400' : 'text-white/30'}`}>{reached ? 'limpio' : '···'}</div>
            </div>
          );
        })}
        {done && (
          <div className="mt-4 rounded-xl bg-mint-500 text-ink-900 px-4 py-3 flex items-center gap-3">
            <I.CheckCircle size={18} stroke={2.4}/>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">IMEI verificado · equipo libre</div>
              <div className="text-[11px] opacity-70">Sin reportes · habilitado para diagnóstico</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TouchStage({ touched }) {
  return (
    <div className="grid md:grid-cols-[1fr_1.15fr] gap-10 items-center">
      <div>
        <div className="text-mint-400 text-[11px] font-semibold tracking-wide uppercase">Paso 02 · Pantalla táctil</div>
        <div className="mt-2 font-display text-white text-[28px] font-semibold leading-tight">Tocá cada cuadrante.</div>
        <div className="mt-3 text-white/60 text-[14px]">Verifica el digitalizador multitáctil. Detectamos zonas muertas y sensibilidad irregular.</div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wide">Cuadrantes</div>
            <div className="font-mono text-white text-[16px] mt-1">{touched.length}/8</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wide">Latencia</div>
            <div className="font-mono text-white text-[16px] mt-1">42<span className="text-white/40 text-[11px]">ms</span></div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wide">Presión</div>
            <div className="font-mono text-white text-[16px] mt-1">ok</div>
          </div>
        </div>
      </div>
      <div className="relative aspect-[3/4] max-w-[360px] mx-auto w-full rounded-[28px] bg-black/50 ring-1 ring-white/10 p-3">
        <div className="grid grid-cols-2 gap-2 h-full">
          {Array.from({length:8}).map((_,i)=>{
            const isOn = touched.includes(i);
            return (
              <div key={i} className={`relative rounded-xl flex items-center justify-center transition-all ${isOn ? 'bg-mint-500/30 ring-1 ring-mint-400' : 'bg-white/[0.03] ring-1 ring-white/10'}`} style={{gridColumn: i % 2 + 1, gridRow: Math.floor(i/2) + 1}}>
                {isOn ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-mint-500/40 rounded-full ping-soft"></div>
                    <div className="relative w-9 h-9 rounded-full bg-mint-500 text-ink-900 flex items-center justify-center">
                      <I.Check size={18} stroke={3}/>
                    </div>
                  </div>
                ) : (
                  <span className="font-mono text-white/30 text-[11px]">Q{i+1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AudioStage({ bars }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <div className="text-mint-400 text-[11px] font-semibold tracking-wide uppercase">Paso 03 · Audio</div>
        <div className="mt-2 font-display text-white text-[28px] font-semibold leading-tight">Reproducí un tono. Hablá 2 segundos.</div>
        <div className="mt-3 text-white/60 text-[14px]">Probamos bocinas L/R, micrófono principal y cancelación de ruido en una sola pasada.</div>
        <div className="mt-6 space-y-2">
          {[['Bocina izquierda', 'ok'], ['Bocina derecha', 'ok'], ['Micrófono principal', 'grabando'], ['Reducción de ruido', 'ok']].map(([l,s])=>(
            <div key={l} className="flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
              <div className="text-white text-[13px] font-medium">{l}</div>
              <div className={`text-[11px] font-mono ${s==='grabando' ? 'text-mint-400' : 'text-white/50'}`}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-black/40 ring-1 ring-white/10 p-8 flex items-center justify-center h-[340px]">
        <div className="flex items-end gap-1.5 h-[200px]">
          {bars.map((v,i)=>(
            <div key={i} className="w-2.5 rounded-full bg-gradient-to-t from-mint-500/30 to-mint-500 transition-all duration-150" style={{height: `${20 + v * 80}%`}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function BatteryStage() {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <div className="text-mint-400 text-[11px] font-semibold tracking-wide uppercase">Paso 04 · Batería</div>
        <div className="mt-2 font-display text-white text-[28px] font-semibold leading-tight">Salud real de la batería.</div>
        <div className="mt-3 text-white/60 text-[14px]">Leemos ciclos de carga, capacidad máxima y temperatura bajo carga. Sin confiar en "se siente bien".</div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[['Salud','94%'],['Ciclos','312'],['Temp.','32°C']].map(([l,v])=>(
            <div key={l} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
              <div className="text-[10px] text-white/40 uppercase tracking-wide">{l}</div>
              <div className="font-display text-white text-[22px] font-semibold mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-6">
        <div className="flex items-end justify-between">
          <div className="text-white/60 text-[12px] font-mono">degradación histórica</div>
          <div className="text-mint-400 text-[12px] font-mono">excelente</div>
        </div>
        <svg viewBox="0 0 300 120" className="mt-4 w-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C6FFAD" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#C6FFAD" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,30 C50,28 80,40 120,50 S200,70 300,60 L300,120 L0,120 Z" fill="url(#g1)"/>
          <path d="M0,30 C50,28 80,40 120,50 S200,70 300,60" fill="none" stroke="#C6FFAD" strokeWidth="2"/>
          {[0,60,120,180,240,300].map(x=>(
            <line key={x} x1={x} x2={x} y1="0" y2="120" stroke="rgba(255,255,255,0.05)"/>
          ))}
        </svg>
        <div className="mt-3 flex justify-between text-[10px] font-mono text-white/40">
          <span>mes 1</span><span>mes 6</span><span>mes 12</span><span>hoy</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InteractiveDemo });
