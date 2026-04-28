const INITIAL_STATE = { deviceType: null, imei: '', imeiOk: false, results: {} };

function App() {
  const [screen, setScreen] = React.useState(() => localStorage.getItem('sc_screen') || 'welcome');
  const [state, setState] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('sc_state')) || INITIAL_STATE; }
    catch { return INITIAL_STATE; }
  });

  React.useEffect(()=>{ localStorage.setItem('sc_screen', screen); }, [screen]);
  React.useEffect(()=>{ localStorage.setItem('sc_state', JSON.stringify(state)); }, [state]);

  const set = (patch) => setState(s => ({ ...s, ...patch }));
  const saveResult = (key, data) => {
    setState(s => ({ ...s, results: { ...s.results, [key]: data } }));
    setScreen('tests');
  };
  const reset = () => { setState(INITIAL_STATE); setScreen('welcome'); };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen next={()=>setScreen('device')}/>;
      case 'device': return <DeviceTypeScreen state={state} set={set} next={()=>setScreen('imei')} back={()=>setScreen('welcome')}/>;
      case 'imei': return <ImeiScreen state={state} set={set} next={()=>setScreen('imei-check')} back={()=>setScreen('device')}/>;
      case 'imei-check': return <ImeiCheckScreen state={state} set={set} next={()=>setScreen('tests')} back={()=>setScreen('imei')}/>;
      case 'tests': return <TestMenuScreen state={state} next={()=>setScreen('summary')} back={()=>setScreen('imei-check')} goTo={(t)=>setScreen('test-'+t)}/>;
      case 'test-touch': return <TouchTest back={()=>setScreen('tests')} skip={()=>saveResult('touch',{status:'skip'})} save={saveResult}/>;
      case 'test-display': return <DisplayTest back={()=>setScreen('tests')} skip={()=>saveResult('display',{status:'skip'})} save={saveResult}/>;
      case 'test-audio': return <AudioTest back={()=>setScreen('tests')} skip={()=>saveResult('audio',{status:'skip'})} save={saveResult}/>;
      case 'test-camera': return <CameraTest back={()=>setScreen('tests')} skip={()=>saveResult('camera',{status:'skip'})} save={saveResult}/>;
      case 'test-sensors': return <SensorsTest back={()=>setScreen('tests')} skip={()=>saveResult('sensors',{status:'skip'})} save={saveResult}/>;
      case 'test-battery': return <BatteryTest back={()=>setScreen('tests')} skip={()=>saveResult('battery',{status:'skip'})} save={saveResult}/>;
      case 'test-connectivity': return <ConnectivityTest back={()=>setScreen('tests')} skip={()=>saveResult('connectivity',{status:'skip'})} save={saveResult}/>;
      case 'test-buttons': return <ButtonsTest back={()=>setScreen('tests')} skip={()=>saveResult('buttons',{status:'skip'})} save={saveResult}/>;
      case 'summary': return <SummaryScreen state={state} next={()=>setScreen('report')} back={()=>setScreen('tests')}/>;
      case 'report': return <ReportScreen state={state} back={()=>setScreen('summary')} restart={reset}/>;
      default: return <WelcomeScreen next={()=>setScreen('device')}/>;
    }
  };

  return (
    <div data-screen-label={screen}>
      <PhoneShell>{renderScreen()}</PhoneShell>
      <DebugNav screen={screen} setScreen={setScreen} reset={reset}/>
    </div>
  );
}

function DebugNav({ screen, setScreen, reset }) {
  const [open, setOpen] = React.useState(false);
  const screens = [
    ['welcome','Bienvenida'],['device','Dispositivo'],['imei','IMEI entrada'],['imei-check','IMEI chequeo'],
    ['tests','Menú pruebas'],
    ['test-touch','— Táctil'],['test-display','— Pantalla'],['test-audio','— Audio'],['test-camera','— Cámaras'],
    ['test-sensors','— Sensores'],['test-battery','— Batería'],['test-connectivity','— Conectividad'],['test-buttons','— Botones'],
    ['summary','Resumen'],['report','Reporte final'],
  ];
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-2 w-[240px] max-h-[70vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-ink-200 p-3 text-ink-900">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-ink-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Saltar a pantalla</div>
            <button onClick={()=>setOpen(false)} className="text-ink-400"><I.X size={14}/></button>
          </div>
          <div className="mt-2 space-y-0.5">
            {screens.map(([id,l])=>(
              <button key={id} onClick={()=>{setScreen(id); setOpen(false);}}
                className={`w-full text-left text-[12.5px] px-2.5 py-1.5 rounded-lg ${screen===id ? 'bg-ink-900 text-white' : 'hover:bg-ink-50 text-ink-700'}`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={reset} className="mt-2 w-full text-[12px] text-red-500 py-1.5 border-t border-ink-100 pt-2">
            Reiniciar estado
          </button>
        </div>
      )}
      <button onClick={()=>setOpen(v=>!v)} className="rounded-full bg-white text-ink-900 px-4 py-2.5 text-[12px] font-semibold shadow-lg ring-1 ring-black/5 hover:bg-ink-50">
        {open ? 'Cerrar' : 'Navegar pantallas'}
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
