function WelcomeScreen({ next }) {
  return (
    <div className="absolute inset-0 bg-ink-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60"></div>
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-mint-500/15 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-mint-500/10 blur-3xl"></div>

      <div className="relative h-full flex flex-col px-6 pt-16 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 72 72" fill="none">
              <rect x="4" y="4" width="64" height="64" rx="15" fill="#C6FFAD"/>
              <text x="36" y="47" textAnchor="middle" fontFamily="Geist, Inter, sans-serif" fontSize="32" fontWeight="800" fill="#151930" letterSpacing="-1.2">SC</text>
              <circle cx="54" cy="14" r="5" fill="#151930"/>
            </svg>
            <span className="font-display font-semibold text-[15px] text-white">SmartCheck</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">v2.4.1</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="relative w-[140px] h-[140px] mx-auto">
            <div className="absolute inset-0 rounded-full bg-mint-500/20 ping-soft"></div>
            <div className="absolute inset-4 rounded-full bg-mint-500/10"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-mint-500 to-mint-600 flex items-center justify-center text-ink-900 shadow-xl">
              <I.Shield size={56} stroke={2}/>
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="font-display text-white text-[28px] font-semibold leading-tight">Diagnóstico<br/>profesional, en 5 minutos.</div>
            <div className="mt-3 text-white/60 text-[14px] leading-relaxed">Verificá hardware, software y estado legal de cualquier dispositivo antes de comprar o vender.</div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 text-center">
            {[['Sin', 'registro'],['5 min','diagnóstico'],['30+','pruebas']].map(([a,b])=>(
              <div key={b} className="rounded-xl bg-white/5 ring-1 ring-white/10 py-3">
                <div className="font-display text-white text-[14px] font-semibold">{a}</div>
                <div className="text-[10px] text-white/50 mt-0.5">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <PrimaryBtn onClick={next}>Empezar diagnóstico <I.Arrow size={16}/></PrimaryBtn>
          <button className="w-full text-white/50 text-[12.5px] py-2">Ya tengo cuenta · Ingresar</button>
        </div>
      </div>
    </div>
  );
}

function DeviceTypeScreen({ state, set, next, back }) {
  const types = [
    { id:'phone', label:'Teléfono', sub:'iPhone, Android', icon:<I.Phone size={22}/>, available:true },
    { id:'tablet', label:'Tablet', sub:'iPad, Android', icon:<I.Tablet size={22}/>, available:false },
    { id:'laptop', label:'Laptop o PC', sub:'Win, macOS, Linux', icon:<I.Laptop size={22}/>, available:false },
  ];
  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Nuevo diagnóstico" onBack={back} step={1} total={8}/>
      <div className="flex-1 px-5 overflow-y-auto pb-32 hide-scroll">
        <div className="mt-2 font-display text-white text-[22px] font-semibold leading-tight">¿Qué dispositivo vamos a probar?</div>
        <div className="mt-1.5 text-white/60 text-[13.5px]">Personalizamos las pruebas según el tipo.</div>

        <div className="mt-6 space-y-2.5">
          {types.map(t => (
            <button key={t.id} disabled={!t.available} onClick={()=>set({ deviceType:t.id })}
              className={`w-full text-left rounded-2xl p-4 ring-1 transition flex items-center gap-4 ${state.deviceType===t.id ? 'bg-mint-500/10 ring-mint-500' : 'bg-white/5 ring-white/10 hover:ring-white/20'} ${!t.available && 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${state.deviceType===t.id ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white'}`}>
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-[15px] flex items-center gap-2">
                  {t.label}
                  {!t.available && <span className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/60">pronto</span>}
                </div>
                <div className="text-white/50 text-[12px] mt-0.5">{t.sub}</div>
              </div>
              <div className={`w-5 h-5 rounded-full ring-1 ${state.deviceType===t.id ? 'bg-mint-500 ring-mint-500' : 'ring-white/20'} flex items-center justify-center`}>
                {state.deviceType===t.id && <I.Check size={12} stroke={3} className="text-ink-900"/>}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-mint-500/15 text-mint-400 flex items-center justify-center shrink-0"><I.Shield size={14}/></div>
          <div className="text-[12px] text-white/70 leading-relaxed">
            El diagnóstico <span className="text-white font-semibold">corre en este mismo dispositivo</span>. No accedemos a fotos, contactos ni mensajes.
          </div>
        </div>
      </div>
      <BottomBar>
        <PrimaryBtn onClick={next} disabled={!state.deviceType}>Continuar <I.Arrow size={16}/></PrimaryBtn>
      </BottomBar>
    </div>
  );
}

function ImeiScreen({ state, set, next, back }) {
  const [val, setVal] = React.useState(state.imei || '');
  const [scan, setScan] = React.useState(false);
  const ok = val.replace(/\s/g,'').length === 15;
  const formatted = val.replace(/\s/g,'').replace(/(\d{3})(?=\d)/g,'$1 ').trim();

  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Verificación IMEI" onBack={back} step={2} total={8}/>
      <div className="flex-1 px-5 overflow-y-auto pb-32 hide-scroll">
        <div className="mt-2 font-display text-white text-[22px] font-semibold leading-tight">Ingresá el número IMEI.</div>
        <div className="mt-1.5 text-white/60 text-[13.5px]">Marcá <span className="font-mono text-white">*#06#</span> en el teclado telefónico o mirá en Ajustes → Acerca del teléfono.</div>

        <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
          <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">IMEI</div>
          <input inputMode="numeric" value={formatted}
            onChange={e=>setVal(e.target.value.replace(/[^0-9]/g,'').slice(0,15))}
            placeholder="000 000 000 000 000"
            className="w-full mt-1 bg-transparent outline-none font-mono text-white text-[20px] tracking-wider placeholder:text-white/20"/>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[11px] font-mono text-white/40">{val.replace(/\s/g,'').length} / 15</div>
            {ok && <div className="text-[11px] text-mint-400 font-mono flex items-center gap-1"><I.Check size={11} stroke={3}/> formato válido</div>}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button onClick={()=>{setScan(true); setTimeout(()=>{setVal('359123456789012'); setScan(false);}, 1400);}}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col items-center gap-2 text-white hover:bg-white/10">
            <I.Camera size={20}/>
            <span className="text-[12px] font-medium">{scan ? 'Escaneando…' : 'Escanear código'}</span>
          </button>
          <button onClick={()=>setVal('359123456789012')}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col items-center gap-2 text-white hover:bg-white/10">
            <I.Sparkles size={20}/>
            <span className="text-[12px] font-medium">Usar IMEI demo</span>
          </button>
        </div>

        <div className="mt-6 text-[12px] text-white/50">
          Al continuar aceptás nuestra <span className="text-white underline">Política de privacidad</span>. El IMEI se cruza con 6 bases internacionales.
        </div>
      </div>
      <BottomBar>
        <PrimaryBtn onClick={()=>{ set({ imei: val }); next(); }} disabled={!ok}>Verificar <I.Arrow size={16}/></PrimaryBtn>
      </BottomBar>
    </div>
  );
}

function ImeiCheckScreen({ state, set, next, back }) {
  const bases = ['GSMA registry', 'Reporte robo LATAM', 'Lista negra carrier', 'Bloqueo iCloud / FRP', 'Estado garantía', 'ICCID cross'];
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(t); setDone(true); return 100; }
        return p + 2;
      });
    }, 70);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Verificando IMEI" onBack={back} step={2} total={8}/>
      <div className="flex-1 px-5 overflow-y-auto pb-32 hide-scroll">
        <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">IMEI</div>
              <div className="font-mono text-white text-[16px] tracking-wider mt-0.5">{state.imei.replace(/(\d{3})(?=\d)/g,'$1 ')}</div>
            </div>
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                <circle cx="20" cy="20" r="17" fill="none" stroke="#C6FFAD" strokeWidth="3"
                  strokeDasharray={`${(progress/100)*106.8} 106.8`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-white">{progress}%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {bases.map((b,i) => {
            const state_i = progress > (i+1)*16.6 ? 'done' : progress > i*16.6 ? 'loading' : 'pending';
            return (
              <div key={b} className={`fade-up flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition ${state_i==='done' ? 'bg-mint-500/10 ring-mint-500/30' : state_i==='loading' ? 'bg-white/[0.06] ring-white/15' : 'bg-white/[0.02] ring-white/5'}`} style={{animationDelay:`${i*60}ms`}}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${state_i==='done' ? 'bg-mint-500 text-ink-900' : 'bg-white/10 text-white/60'}`}>
                  {state_i==='done' ? <I.Check size={14} stroke={3}/> : state_i==='loading' ? <div className="w-3 h-3 border-2 border-white/60 border-t-transparent rounded-full spin-slow"/> : <span className="w-1.5 h-1.5 bg-white/40 rounded-full"/>}
                </div>
                <div className="flex-1 text-white text-[13px] font-medium">{b}</div>
                <div className={`text-[10.5px] font-mono ${state_i==='done' ? 'text-mint-400' : 'text-white/30'}`}>
                  {state_i==='done' ? 'limpio' : state_i==='loading' ? 'consultando…' : '···'}
                </div>
              </div>
            );
          })}
        </div>

        {done && (
          <div className="mt-5 rounded-2xl bg-mint-500 text-ink-900 p-5 fade-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink-900 text-mint-500 flex items-center justify-center"><I.CheckCircle size={22} stroke={2.4}/></div>
              <div className="flex-1">
                <div className="font-display font-semibold text-[16px]">IMEI verificado</div>
                <div className="text-[12px] opacity-75">Equipo libre · sin reportes · habilitado</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {done && (
        <BottomBar>
          <PrimaryBtn onClick={() => { set({ imeiOk: true }); next(); }}>Comenzar pruebas <I.Arrow size={16}/></PrimaryBtn>
        </BottomBar>
      )}
    </div>
  );
}

Object.assign(window, { WelcomeScreen, DeviceTypeScreen, ImeiScreen, ImeiCheckScreen });
