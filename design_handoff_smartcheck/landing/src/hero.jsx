// Animated phone mockup showing a live diagnostic
function HeroDeviceMockup() {
  const [progress, setProgress] = React.useState(0);
  const [stepIdx, setStepIdx] = React.useState(0);
  const steps = [
    { label: 'IMEI verificado', sub: '359 123 456 789 012 · limpio', ok: true },
    { label: 'Pantalla táctil', sub: 'digitalizador · 8/8 cuadrantes', ok: true },
    { label: 'Bocinas', sub: 'izq · der · frecuencias nominales', ok: true },
    { label: 'Batería', sub: 'salud 94% · 312 ciclos', ok: true },
    { label: 'Sensores', sub: 'giroscopio · acelerómetro · proximidad', ok: null },
  ];
  React.useEffect(() => {
    const t = setInterval(() => setProgress(p => (p + 1) % 101), 60);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    const t = setInterval(() => setStepIdx(i => (i + 1) % steps.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      {/* Device */}
      <div className="relative mx-auto w-[300px] h-[610px] rounded-[48px] bg-ink-900 p-3 shadow-lift ring-1 ring-black/10">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 h-[26px] w-[100px] rounded-full bg-black/90 z-20"></div>
        <div className="relative h-full w-full rounded-[36px] bg-gradient-to-b from-[#0b1d33] to-[#061424] overflow-hidden">
          {/* scan line */}
          <div className="absolute inset-x-4 h-[2px] bg-mint-500/70 blur-[1px] scan-line" style={{top:'60px'}}></div>

          {/* Header pill */}
          <div className="relative z-10 pt-12 px-5">
            <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
              <span>9:41</span>
              <span className="tracking-wider">SMARTCHECK</span>
              <span>LTE</span>
            </div>

            <div className="mt-6 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-[11px] font-medium tracking-wide uppercase">Diagnóstico en curso</div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500 dot-1"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500 dot-2"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500 dot-3"></span>
                </div>
              </div>
              <div className="mt-3 text-white font-display font-semibold text-[22px] leading-tight">
                Galaxy A54 5G
              </div>
              <div className="mt-1 text-white/50 text-[11px] font-mono">SN · A2F3-8821-K9</div>
              <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-mint-500 rounded-full transition-all duration-200" style={{width: `${progress}%`}}></div>
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-white/50 font-mono">
                <span>{progress}% completado</span>
                <span>18 / 32 pruebas</span>
              </div>
            </div>

            {/* Current test card */}
            <div className="mt-4 rounded-2xl bg-mint-500/10 ring-1 ring-mint-500/30 p-4">
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className="absolute inset-0 rounded-full bg-mint-500/40 ping-soft"></div>
                  <div className="relative w-8 h-8 rounded-full bg-mint-500 flex items-center justify-center text-ink-900">
                    <I.Touch size={16} stroke={2.2}/>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[13px] font-semibold">Tocá cada cuadrante</div>
                  <div className="text-white/60 text-[11px] mt-0.5">Verificando digitalizador multitáctil</div>
                </div>
              </div>
              {/* Quadrant grid */}
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className={`aspect-square rounded-md transition-all ${i < (progress/14) ? 'bg-mint-500/60 ring-1 ring-mint-400' : 'bg-white/5 ring-1 ring-white/10'}`}>
                    {i < (progress/14) && (
                      <div className="h-full w-full flex items-center justify-center text-ink-900">
                        <I.Check size={12} stroke={3}/>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent results */}
            <div className="mt-4 space-y-2">
              {steps.map((s, i) => {
                const active = i === stepIdx;
                return (
                  <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition-all ${active ? 'bg-white/[0.08] ring-white/15' : 'bg-white/[0.03] ring-white/5'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.ok ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white/60'}`}>
                      {s.ok ? <I.Check size={12} stroke={3}/> : <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[11.5px] font-medium truncate">{s.label}</div>
                      <div className="text-white/40 text-[10px] font-mono truncate">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating side cards */}
      <div className="hidden lg:block absolute -left-16 top-20 rounded-2xl bg-white shadow-card ring-1 ring-ink-100 p-4 w-[220px]">
        <div className="flex items-center gap-2 text-mint-600 text-[11px] font-semibold tracking-wide uppercase">
          <I.Shield size={14} stroke={2.2}/> IMEI limpio
        </div>
        <div className="mt-2 text-ink-900 font-display font-semibold text-[15px] leading-tight">Sin reporte de robo</div>
        <div className="mt-1 text-ink-400 text-[12px]">Consulta cruzada con 6 bases internacionales.</div>
      </div>

      <div className="hidden lg:block absolute -right-14 top-64 rounded-2xl bg-white shadow-card ring-1 ring-ink-100 p-4 w-[230px]">
        <div className="flex items-center justify-between">
          <div className="text-ink-400 text-[11px] font-semibold tracking-wide uppercase">Salud de batería</div>
          <span className="text-mint-600 text-[11px] font-semibold">+94%</span>
        </div>
        <div className="mt-3 flex items-end gap-1 h-12">
          {[40,55,48,72,65,80,88,94].map((h,i)=>(
            <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-mint-500/20 to-mint-500" style={{height:`${h}%`}}></div>
          ))}
        </div>
        <div className="mt-2 text-ink-500 text-[11px]">312 ciclos · condición excelente</div>
      </div>

      <div className="hidden md:flex absolute -bottom-4 -right-4 lg:-right-10 items-center gap-3 rounded-full bg-ink-900 text-white px-4 py-2.5 shadow-lift">
        <span className="relative flex w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-mint-500 opacity-75 animate-ping"></span>
          <span className="relative rounded-full w-2 h-2 bg-mint-500"></span>
        </span>
        <span className="text-[12px] font-medium">Tiempo real · 247 ms</span>
      </div>
    </div>
  );
}

function Navbar({ ctaLabel = 'Probar gratis' }) {
  const [open, setOpen] = React.useState(false);
  const links = [
    ['Cómo funciona', '#como-funciona'],
    ['Dispositivos', '#dispositivos'],
    ['Precios', '#precios'],
    ['FAQ', '#faq'],
  ];
  return (
    <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center"><Logo size={28}/></a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([l,h])=>(
            <a key={l} href={h} className="text-[14px] font-medium text-ink-500 hover:text-ink-900 transition">{l}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-[14px] font-medium text-ink-500 hover:text-ink-900">Ingresar</a>
          <a href="#cta" className="group inline-flex items-center gap-1.5 rounded-full bg-ink-900 text-white text-[14px] font-medium px-4 py-2 hover:bg-ink-800 transition">
            {ctaLabel}
            <I.Arrow size={15} className="group-hover:translate-x-0.5 transition-transform"/>
          </a>
        </div>
        <button onClick={()=>setOpen(!open)} className="md:hidden w-9 h-9 rounded-lg border border-ink-100 flex items-center justify-center">
          {open ? <I.X size={18}/> : <I.Menu size={18}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink-100 bg-canvas">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map(([l,h])=><a key={l} href={h} onClick={()=>setOpen(false)} className="text-[15px] font-medium text-ink-700">{l}</a>)}
            <a href="#cta" className="mt-2 inline-flex justify-center rounded-full bg-ink-900 text-white text-[14px] font-medium px-4 py-2.5">{ctaLabel}</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ tweaks }) {
  return (
    <section className="relative hero-gradient overflow-hidden">
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-60 pointer-events-none"></div>
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-ink-100 shadow-soft pl-1.5 pr-3 py-1">
            <span className="rounded-full bg-mint-500/15 text-mint-700 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5">Nuevo</span>
            <span className="text-[12.5px] text-ink-500 font-medium">Verificación de IMEI en 6 bases internacionales</span>
          </div>
          <h1 className="mt-6 font-display font-semibold text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.02] text-ink-900">
            {tweaks.headline || (<>Sabé exactamente <span className="relative whitespace-nowrap">qué hay<span className="absolute left-0 -bottom-1 w-full h-[6px] bg-mint-500/40 -z-10 rounded"></span></span> dentro del equipo.</>)}
          </h1>
          <p className="mt-6 text-[17px] lg:text-[19px] leading-relaxed text-ink-500 max-w-[560px]">
            SmartCheck diagnostica hardware y software de teléfonos, tablets y computadoras paso a paso. Comprá o vendé usados con certeza, no con fe.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#cta" className="group inline-flex items-center gap-2 rounded-full bg-ink-900 text-white font-medium text-[15px] px-5 py-3.5 hover:bg-ink-800 transition shadow-soft">
              Iniciar diagnóstico
              <I.Arrow size={17} className="group-hover:translate-x-0.5 transition-transform"/>
            </a>
            <a href="#demo" className="group inline-flex items-center gap-2 rounded-full bg-white text-ink-900 ring-1 ring-ink-100 font-medium text-[15px] px-5 py-3.5 hover:ring-ink-200 transition">
              <span className="w-6 h-6 rounded-full bg-ink-900 text-white flex items-center justify-center"><I.Play size={11}/></span>
              Ver cómo funciona
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-[520px]">
            {[
              ['+50.000', 'dispositivos analizados'],
              ['Sin instalación', 'corre en el navegador'],
              ['< 5 min', 'diagnóstico completo'],
            ].map(([n,s])=>(
              <div key={s} className="border-l border-ink-100 pl-4">
                <div className="font-display font-semibold text-[20px] text-ink-900">{n}</div>
                <div className="text-[12px] text-ink-400 mt-0.5">{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <HeroDeviceMockup/>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = ['iOS','Android','Windows','Tablet','Laptop','Chip','Wear'];
  const doubled = [...items, ...items];
  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="text-[12px] uppercase tracking-[0.14em] font-semibold text-ink-400 shrink-0 md:w-[220px]">
          Compatible con<br/>
          <span className="text-ink-500 normal-case tracking-normal text-[13px] font-medium">todas las marcas y sistemas operativos</span>
        </div>
        <div className="flex-1 overflow-hidden mask-fade-x">
          <div className="flex gap-12 marquee w-max">
            {doubled.map((it,i)=><DeviceGlyph key={i} label={it}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroDeviceMockup, Navbar, Hero, TrustBar });
