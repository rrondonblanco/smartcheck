function PhoneShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-ink-900 flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-[1100px]">
        <div className="hidden md:flex flex-col gap-3 text-white/70 max-w-[260px]">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
              <rect x="4" y="4" width="64" height="64" rx="15" fill="#C6FFAD"/>
              <text x="36" y="47" textAnchor="middle" fontFamily="Geist, Inter, sans-serif" fontSize="32" fontWeight="800" fill="#151930" letterSpacing="-1.2">SC</text>
              <circle cx="54" cy="14" r="5" fill="#151930"/>
            </svg>
            <span className="font-display font-semibold text-[16px] text-white">SmartCheck</span>
          </div>
          <div className="font-display font-semibold text-[22px] text-white leading-tight mt-2">Vista previa del flujo</div>
          <div className="text-[13.5px] leading-relaxed">Navegá las pantallas como si fuese un smartphone real. Todo es funcional: tocá, escuchá y completá un diagnóstico entero.</div>
          <a href="index.html" className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-mint-400 font-medium">
            <I.ChevronRight size={13} className="rotate-180"/> Volver al landing
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[380px]">
          <div className="relative rounded-[46px] bg-black p-2 sm:p-2.5 shadow-2xl ring-1 ring-white/10">
            <div className="relative rounded-[38px] overflow-hidden bg-ink-900" style={{aspectRatio:'9/19.5'}}>
              <div className="absolute left-1/2 top-2 -translate-x-1/2 h-[22px] w-[92px] rounded-full bg-black z-30"></div>
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 pt-1.5 pb-1 text-[11px] font-medium text-white">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M0 8h2v2H0zM3 6h2v4H3zM6 4h2v6H6zM9 2h2v8H9zM12 0h2v10h-2z"/></svg>
                  <div className="relative ml-0.5">
                    <div className="w-6 h-2.5 rounded-[3px] border border-white/70 flex items-center"><div className="bg-white h-[7px] m-[1px] rounded-[1.5px]" style={{width:'80%'}}></div></div>
                    <div className="absolute right-[-3px] top-[3px] w-[2px] h-[3px] bg-white/70 rounded-r"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[220px]"></div>
      </div>
    </div>
  );
}

function AppBar({ title, onBack, step, total, right }) {
  return (
    <div className="relative z-20 pt-9 pb-3 px-5">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-white hover:bg-white/15">
            <I.ChevronRight size={16} className="rotate-180"/>
          </button>
        ) : <div className="w-9"/>}
        <div className="flex-1 min-w-0 text-center">
          {title && <div className="text-[13px] font-semibold text-white truncate">{title}</div>}
          {step && <div className="text-[10.5px] font-mono text-white/50 mt-0.5">Paso {step} de {total}</div>}
        </div>
        <div className="w-9 flex items-center justify-end">{right}</div>
      </div>
      {step && (
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-mint-500 transition-all duration-500" style={{width:`${(step/total)*100}%`}}/>
        </div>
      )}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, variant='primary' }) {
  const styles = {
    primary: 'bg-mint-500 text-ink-900 hover:bg-mint-400',
    dark: 'bg-white text-ink-900 hover:bg-white/90',
    ghost: 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl font-semibold text-[15px] px-5 py-4 transition ${styles} disabled:opacity-40 disabled:cursor-not-allowed`}>
      {children}
    </button>
  );
}

function BottomBar({ children }) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-20 px-5 pt-3 pb-6 bg-gradient-to-t from-ink-900 via-ink-900/95 to-transparent">
      {children}
    </div>
  );
}

function ResultBadge({ ok }) {
  if (ok === 'pass' || ok === true) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint-500/15 text-mint-400 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5">
      <I.Check size={10} stroke={3}/> OK
    </span>
  );
  if (ok === 'fail') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-400 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5">
      <I.X size={10} stroke={3}/> FALLA
    </span>
  );
  if (ok === 'skip') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white/50 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5">
      OMITIDO
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white/60 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5">
      Pendiente
    </span>
  );
}

Object.assign(window, { PhoneShell, AppBar, PrimaryBtn, BottomBar, ResultBadge });
