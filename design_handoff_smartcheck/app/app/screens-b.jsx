function TestMenuScreen({ state, next, back, goTo }) {
  const tests = [
    { id:'touch', label:'Pantalla táctil', sub:'digitalizador · multitouch', icon:<I.Touch size={18}/>, time:'40s' },
    { id:'display', label:'Pantalla LED', sub:'color, brillo, píxeles muertos', icon:<I.Screen size={18}/>, time:'30s' },
    { id:'audio', label:'Audio', sub:'bocinas + micrófono', icon:<I.Speaker size={18}/>, time:'20s' },
    { id:'camera', label:'Cámaras', sub:'frontal y trasera', icon:<I.Camera size={18}/>, time:'25s' },
    { id:'sensors', label:'Sensores', sub:'giroscopio, acelerómetro, proximidad', icon:<I.Sensor size={18}/>, time:'30s' },
    { id:'battery', label:'Batería', sub:'salud, ciclos, temperatura', icon:<I.Battery size={18}/>, time:'15s' },
    { id:'connectivity', label:'Conectividad', sub:'Wi-Fi, Bluetooth, GPS', icon:<I.Wifi size={18}/>, time:'20s' },
    { id:'buttons', label:'Botones y carga', sub:'físicos + puerto', icon:<I.Plug size={18}/>, time:'25s' },
  ];
  const results = state.results || {};
  const completed = tests.filter(t => results[t.id]).length;
  const allDone = completed === tests.length;

  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title="Pruebas de hardware" onBack={back} step={3} total={8}/>
      <div className="flex-1 px-5 overflow-y-auto pb-32 hide-scroll">
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="font-display text-white text-[22px] font-semibold leading-tight">Tu lista de pruebas</div>
            <div className="text-white/60 text-[13px] mt-1">Tocá una prueba para ejecutarla.</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-white text-[18px]">{completed}/{tests.length}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wide">completas</div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {tests.map(t => {
            const r = results[t.id];
            const ok = r?.status;
            return (
              <button key={t.id} onClick={()=>goTo(t.id)}
                className="w-full text-left rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center gap-3 hover:bg-white/[0.08] transition">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ok==='pass' ? 'bg-mint-500/15 text-mint-400' : ok==='fail' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white'}`}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-[14px]">{t.label}</div>
                  <div className="text-white/50 text-[11.5px]">{t.sub} · {t.time}</div>
                </div>
                <ResultBadge ok={ok}/>
              </button>
            );
          })}
        </div>
      </div>
      <BottomBar>
        <PrimaryBtn onClick={next} disabled={!allDone}>
          {allDone ? <>Ver reporte <I.Arrow size={16}/></> : `Completá las ${tests.length - completed} restantes`}
        </PrimaryBtn>
      </BottomBar>
    </div>
  );
}

function TestShell({ title, back, children, onPass, onFail, onSkip, canPass=true }) {
  return (
    <div className="absolute inset-0 bg-ink-900 flex flex-col">
      <AppBar title={title} onBack={back} right={
        onSkip && <button onClick={onSkip} className="text-[11.5px] text-white/50 hover:text-white">Omitir</button>
      }/>
      <div className="flex-1 overflow-y-auto pb-36 hide-scroll">
        {children}
      </div>
      <BottomBar>
        <div className="flex gap-2">
          <button onClick={onFail} className="flex-1 rounded-2xl bg-red-500/15 text-red-300 ring-1 ring-red-500/30 font-semibold text-[14px] py-4 hover:bg-red-500/20">
            Falló
          </button>
          <button onClick={onPass} disabled={!canPass}
            className="flex-[2] rounded-2xl bg-mint-500 text-ink-900 font-semibold text-[14px] py-4 hover:bg-mint-400 disabled:opacity-40">
            Marcar OK <I.Check size={15} stroke={3} className="inline -mt-0.5 ml-1"/>
          </button>
        </div>
      </BottomBar>
    </div>
  );
}

function TouchTest({ save, back, skip }) {
  const [touched, setTouched] = React.useState(new Set());
  const allDone = touched.size === 9;
  return (
    <TestShell title="Pantalla táctil" back={back} onSkip={skip} canPass={allDone}
      onPass={()=>save('touch', { status:'pass', detail:`9/9 zonas verificadas`})}
      onFail={()=>save('touch', { status:'fail', detail:'Zonas sin respuesta'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">Tocá cada cuadrante.</div>
        <div className="text-white/60 text-[13px] mt-1">Verifica el digitalizador. {touched.size}/9 completos.</div>
      </div>
      <div className="px-5 mt-5">
        <div className="relative w-full aspect-[3/4] rounded-2xl bg-black/50 ring-1 ring-white/10 p-2">
          <div className="grid grid-cols-3 grid-rows-3 gap-1.5 h-full">
            {Array.from({length:9}).map((_,i)=>{
              const on = touched.has(i);
              return (
                <button key={i} onClick={()=>setTouched(s=>new Set([...s,i]))}
                  className={`relative rounded-lg flex items-center justify-center transition ${on ? 'bg-mint-500/30 ring-1 ring-mint-400' : 'bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.07]'}`}>
                  {on ? (
                    <div className="w-8 h-8 rounded-full bg-mint-500 text-ink-900 flex items-center justify-center">
                      <I.Check size={15} stroke={3}/>
                    </div>
                  ) : <span className="font-mono text-white/30 text-[11px]">Q{i+1}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </TestShell>
  );
}

function DisplayTest({ save, back, skip }) {
  const colors = ['#FF0000','#00FF00','#0000FF','#FFFFFF','#000000'];
  const [idx, setIdx] = React.useState(0);
  const color = colors[idx];
  const last = idx === colors.length - 1;
  const lightBg = color==='#FFFFFF'||color==='#00FF00';
  return (
    <div className="absolute inset-0" style={{background: color}}>
      <div className="absolute top-0 inset-x-0 pt-9 px-5 flex items-center justify-between z-20">
        <button onClick={back} className={`w-9 h-9 rounded-full flex items-center justify-center ${lightBg ? 'bg-black/15 text-black' : 'bg-white/15 text-white'}`}>
          <I.ChevronRight size={16} className="rotate-180"/>
        </button>
        <div className={`text-[11px] font-mono ${lightBg ? 'text-black/70' : 'text-white/70'}`}>
          {idx+1}/{colors.length} · {color}
        </div>
        <button onClick={skip} className={`text-[11px] ${lightBg ? 'text-black/70' : 'text-white/70'}`}>Omitir</button>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-5 pb-7 z-20">
        <div className={`rounded-2xl p-4 ${lightBg ? 'bg-black/80 text-white' : 'bg-white/10 backdrop-blur text-white ring-1 ring-white/20'}`}>
          <div className="text-[13px] font-semibold">¿Ves el color uniforme, sin píxeles muertos?</div>
          <div className="text-[11.5px] opacity-70 mt-1">Detectá manchas, líneas o zonas oscuras.</div>
          <div className="mt-3 flex gap-2">
            <button onClick={()=>save('display',{status:'fail',detail:`Defecto en ${color}`})}
              className="flex-1 rounded-xl bg-red-500 text-white font-semibold text-[13px] py-3">Veo un defecto</button>
            <button onClick={()=>{ if (last) save('display',{status:'pass',detail:'5 tonos uniformes'}); else setIdx(i=>i+1); }}
              className="flex-[2] rounded-xl bg-mint-500 text-ink-900 font-semibold text-[13px] py-3">
              {last ? 'Todo bien · finalizar' : 'Siguiente color'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioTest({ save, back, skip }) {
  const [stage, setStage] = React.useState('speaker');
  const [playing, setPlaying] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [recorded, setRecorded] = React.useState(false);
  const [bars, setBars] = React.useState(new Array(20).fill(0.2));

  React.useEffect(()=>{
    if (recording) {
      const t = setInterval(()=>setBars(new Array(20).fill(0).map(()=>Math.random()*0.8+0.2)), 120);
      return () => clearInterval(t);
    }
  }, [recording]);

  function playTone() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 440; osc.type = 'sine';
      gain.gain.value = 0.18;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      setPlaying(true);
      setTimeout(()=>{ osc.stop(); ctx.close(); setPlaying(false); }, 1800);
    } catch(e) { setPlaying(true); setTimeout(()=>setPlaying(false), 1800); }
  }

  return (
    <TestShell title="Audio" back={back} onSkip={skip}
      canPass={stage==='mic' && recorded}
      onPass={()=>save('audio',{status:'pass',detail:'Bocinas y micrófono OK'})}
      onFail={()=>save('audio',{status:'fail',detail:'Audio con anomalías'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">
          {stage==='speaker' ? 'Reproducí un tono' : 'Grabá tu voz'}
        </div>
        <div className="text-white/60 text-[13px] mt-1">
          {stage==='speaker' ? '440 Hz. Subí el volumen.' : 'Decí tu nombre o contá hasta cinco.'}
        </div>
      </div>

      {stage==='speaker' && (
        <div className="px-5 mt-8">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 flex flex-col items-center">
            <div className="relative w-28 h-28">
              {playing && <div className="absolute inset-0 rounded-full bg-mint-500/30 ping-soft"></div>}
              <button onClick={playTone} className="relative w-full h-full rounded-full bg-mint-500 text-ink-900 flex items-center justify-center shadow-lg hover:bg-mint-400">
                <I.Speaker size={40} stroke={1.8}/>
              </button>
            </div>
            <div className="mt-5 text-white font-semibold text-[14px]">{playing ? 'Reproduciendo…' : 'Tocá para reproducir'}</div>
          </div>
          <button onClick={()=>setStage('mic')} className="mt-5 w-full rounded-2xl bg-white/10 text-white ring-1 ring-white/15 py-3 font-medium text-[13.5px]">
            Escuché bien · continuar al micrófono
          </button>
        </div>
      )}

      {stage==='mic' && (
        <div className="px-5 mt-8">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
            <div className="h-[120px] flex items-center justify-center gap-1">
              {bars.map((v,i)=>(
                <div key={i} className={`w-1.5 rounded-full transition-all duration-150 ${recording ? 'bg-gradient-to-t from-mint-500/30 to-mint-500' : 'bg-white/15'}`} style={{height:`${recording ? v*90+10 : 15}%`}}/>
              ))}
            </div>
            <button onClick={()=>{ setRecording(true); setTimeout(()=>{ setRecording(false); setRecorded(true); }, 3000); }}
              disabled={recording}
              className={`mt-4 w-full rounded-2xl font-semibold text-[14px] py-3.5 ${recorded ? 'bg-mint-500/20 text-mint-400' : 'bg-mint-500 text-ink-900 hover:bg-mint-400'} disabled:opacity-70`}>
              {recording ? 'Grabando… habla ahora' : recorded ? 'Grabación completa' : 'Tocá y hablá'}
            </button>
          </div>
        </div>
      )}
    </TestShell>
  );
}

function CameraTest({ save, back, skip }) {
  const [stage, setStage] = React.useState('rear');
  const [captured, setCaptured] = React.useState(false);
  return (
    <TestShell title="Cámaras" back={back} onSkip={skip}
      canPass={stage==='front' && captured}
      onPass={()=>save('camera',{status:'pass',detail:'Cámaras nominales'})}
      onFail={()=>save('camera',{status:'fail',detail:'Anomalía en cámara'})}>
      <div className="px-5 pt-2">
        <div className="text-white font-display text-[20px] font-semibold">
          Cámara {stage==='rear' ? 'trasera' : 'frontal'}
        </div>
        <div className="text-white/60 text-[13px] mt-1">Apuntá y capturá.</div>
      </div>
      <div className="px-5 mt-4">
        <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-black ring-1 ring-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black"></div>
          <div className="absolute inset-0 bg-grid opacity-40"></div>
          {captured && <div className="absolute inset-0 bg-white/30 pulse-soft"></div>}
          <div className="absolute inset-5 pointer-events-none">
            {['top-0 left-0 border-l-2 border-t-2','top-0 right-0 border-r-2 border-t-2','bottom-0 left-0 border-l-2 border-b-2','bottom-0 right-0 border-r-2 border-b-2'].map((c,i)=>(
              <div key={i} className={`absolute ${c} border-white/70 w-5 h-5 rounded-sm`}></div>
            ))}
          </div>
          <div className="absolute top-3 inset-x-0 flex justify-center">
            <div className="rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-mono px-2 py-1 ring-1 ring-white/10">
              {stage==='rear' ? '1x · 48MP · f/1.8' : '1x · 12MP · f/2.2'}
            </div>
          </div>
          <div className="absolute bottom-5 inset-x-0 flex justify-center">
            <button onClick={()=>{ setCaptured(true); setTimeout(()=>setCaptured(false), 300);}}
              className="w-16 h-16 rounded-full bg-white ring-4 ring-white/30 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white ring-2 ring-ink-900"></div>
            </button>
          </div>
        </div>
        <button onClick={()=>{ if (stage==='rear') { setStage('front'); setCaptured(false);} }}
          disabled={stage==='front'}
          className="mt-5 w-full rounded-2xl bg-white/10 text-white ring-1 ring-white/15 py-3 font-medium text-[13.5px] disabled:opacity-50">
          {stage==='rear' ? 'Siguiente · cámara frontal' : 'Cámara frontal OK'}
        </button>
      </div>
    </TestShell>
  );
}

Object.assign(window, { TestMenuScreen, TouchTest, DisplayTest, AudioTest, CameraTest, TestShell });
