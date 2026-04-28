function TweaksPanel({ tweaks, setTweak }) {
  const [open, setOpen] = React.useState(false);
  const [available, setAvailable] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') { setAvailable(true); setOpen(true); }
      if (e.data.type === '__deactivate_edit_mode') { setAvailable(false); setOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const persist = (edits) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  const onChange = (k, v) => { setTweak(k, v); persist({ [k]: v }); };

  if (!available) return null;

  const accents = [
    { name: 'Lima',    value: '#C6FFAD' },
    { name: 'Cian',    value: '#06B6D4' },
    { name: 'Violeta', value: '#8B5CF6' },
    { name: 'Coral',   value: '#F97066' },
    { name: 'Amarillo',value: '#FACC15' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <div className={`mb-3 w-[320px] rounded-2xl bg-white ring-1 ring-ink-100 shadow-lift p-5 transition-all ${open ? 'tweaks-open' : 'tweaks-closed'}`}>
        <div className="flex items-center justify-between">
          <div className="font-display font-semibold text-[15px] text-ink-900">Tweaks</div>
          <button onClick={()=>setOpen(false)} className="text-ink-400 hover:text-ink-900"><I.X size={16}/></button>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Headline</div>
          <div className="mt-2 grid gap-1.5">
            {[
              'Sabé exactamente qué hay dentro del equipo.',
              'Comprá y vendé usados con certeza, no con fe.',
              'El diagnóstico que un técnico haría, en tu mano.',
            ].map(h => (
              <button key={h} onClick={()=>onChange('headline', h)}
                className={`text-left text-[12.5px] rounded-lg px-3 py-2 ring-1 transition ${tweaks.headline===h ? 'ring-ink-900 bg-ink-50' : 'ring-ink-100 hover:ring-ink-300'}`}>
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Acento</div>
          <div className="mt-2 flex gap-2">
            {accents.map(a => (
              <button key={a.value} onClick={()=>onChange('accent', a.value)}
                className={`w-9 h-9 rounded-full ring-2 transition ${tweaks.accent===a.value ? 'ring-ink-900' : 'ring-transparent'}`}
                style={{background:a.value}} title={a.name}/>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">CTA primario</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {['Probar gratis','Iniciar diagnóstico','Empezar ahora','Ver demo'].map(t => (
              <button key={t} onClick={()=>onChange('cta', t)}
                className={`text-[12px] rounded-lg px-2 py-1.5 ring-1 transition ${tweaks.cta===t ? 'ring-ink-900 bg-ink-50' : 'ring-ink-100 hover:ring-ink-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Fondo</div>
          <div className="mt-2 flex gap-2">
            {[['Claro','#FAFAF7'],['Crema','#F7F3EC'],['Frío','#F2F5FA']].map(([n,v])=>(
              <button key={v} onClick={()=>onChange('bg', v)}
                className={`flex-1 text-[11.5px] rounded-lg px-2 py-2 ring-1 transition ${tweaks.bg===v ? 'ring-ink-900 bg-ink-50' : 'ring-ink-100'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={()=>setOpen(v=>!v)} className="ml-auto block rounded-full bg-ink-900 text-white px-4 py-2.5 text-[13px] font-medium shadow-lift hover:bg-ink-800 transition">
        {open ? 'Cerrar Tweaks' : 'Abrir Tweaks'}
      </button>
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
