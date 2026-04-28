function SectionHeader({ eyebrow, title, subtitle, align='left' }) {
  return (
    <div className={`max-w-2xl ${align==='center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-mint-700">
          <span className="w-5 h-px bg-mint-500"></span>{eyebrow}
        </div>
      )}
      <h2 className="mt-3 font-display font-semibold text-[34px] sm:text-[44px] leading-[1.05] text-ink-900 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-[17px] leading-relaxed text-ink-500">{subtitle}</p>}
    </div>
  );
}

function ProblemSolution() {
  const pains = [
    { t: 'Bloqueado por iCloud o cuenta Google', s: 'Te das cuenta cuando ya pagaste.' },
    { t: 'Reportado como robado', s: 'Equipo imposible de usar con tu línea.' },
    { t: 'Batería al 60% de su vida', s: 'Dura horas, no un día completo.' },
    { t: 'Pantalla con zonas muertas', s: 'Aparecen días después de la compra.' },
  ];
  return (
    <section className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeader
              eyebrow="El problema"
              title={<>Comprar un usado no debería ser un acto de fe.</>}
              subtitle="El 38% de los compradores de equipos de segunda mano en Latinoamérica reportan al menos una falla oculta en los primeros 30 días. No se trata de mala suerte: se trata de falta de información."
            />
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {pains.map(p => (
                <div key={p.t} className="rounded-xl bg-white ring-1 ring-ink-100 p-4 flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                    <I.X size={16} stroke={2.2}/>
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-ink-900">{p.t}</div>
                    <div className="text-[12.5px] text-ink-500 mt-0.5">{p.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: before / after visual */}
          <div className="relative">
            <div className="rounded-3xl bg-white ring-1 ring-ink-100 shadow-card p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div className="chip rounded-full text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 text-ink-500">Antes · Después</div>
                <div className="text-[11px] font-mono text-ink-400">intercambio seguro</div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-ink-50 p-5">
                  <div className="text-[11px] font-semibold tracking-wide uppercase text-ink-400">Sin SmartCheck</div>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-ink-500">
                    {['Confías en una foto','No verificás el IMEI','No probás sensores','Sin registro del estado'].map(x=>(
                      <li key={x} className="flex items-start gap-2">
                        <I.X size={14} className="mt-0.5 text-ink-300 shrink-0"/>{x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-ink-900 text-white p-5 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-mint-500/20 blur-2xl"></div>
                  <div className="text-[11px] font-semibold tracking-wide uppercase text-mint-400">Con SmartCheck</div>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-white/80">
                    {['IMEI cruzado internacional','30+ componentes probados','Reporte firmado y fechado','Acuerdo con evidencia'].map(x=>(
                      <li key={x} className="flex items-start gap-2">
                        <I.Check size={14} className="mt-0.5 text-mint-400 shrink-0" stroke={3}/>{x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-mint-50 ring-1 ring-mint-200 p-4">
                <div className="w-9 h-9 rounded-full bg-mint-500 text-ink-900 flex items-center justify-center">
                  <I.Swap size={16} stroke={2.2}/>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-ink-900">Cerrá el trato con evidencia, no con suerte.</div>
                  <div className="text-[12px] text-ink-500">Compartí el reporte con un link antes de pagar.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsHow() {
  const steps = [
    { n: '01', t: 'Elegís el tipo de dispositivo', d: 'Teléfono, tablet, laptop o PC. Personalizamos las pruebas para cada uno.', icon: <I.Phone size={20}/> },
    { n: '02', t: 'Verificamos IMEI / número de serie', d: 'Cruce internacional: robo, bloqueo, lista negra, estado de garantía.', icon: <I.Shield size={20}/> },
    { n: '03', t: 'Seguís los pasos guiados', d: 'Tocás, hablás, escuchás. SmartCheck confirma cada componente en tiempo real.', icon: <I.Touch size={20}/> },
    { n: '04', t: 'Recibís un reporte firmado', d: 'PDF descargable y link compartible con fecha, hora y evidencia técnica.', icon: <I.File size={20}/> },
  ];
  return (
    <section id="como-funciona" className="py-24 lg:py-32 bg-white border-y border-ink-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            eyebrow="Cómo funciona"
            title={<>Cuatro pasos. Sin instalar nada.</>}
            subtitle="Todo corre desde el navegador. SmartCheck te guía como lo haría un técnico experimentado."
          />
          <a href="#demo" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-900 hover:gap-2.5 transition-all">
            Ver demo <I.Arrow size={15}/>
          </a>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100 rounded-3xl overflow-hidden ring-1 ring-ink-100">
          {steps.map((s,i)=>(
            <div key={s.n} className="group relative bg-white p-7 lg:p-8 hover:bg-ink-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-ink-900 text-white flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="font-mono text-[12px] text-ink-300 tracking-wider">{s.n}</span>
              </div>
              <div className="mt-6 font-display font-semibold text-[19px] text-ink-900 leading-tight">{s.t}</div>
              <div className="mt-2 text-[14px] text-ink-500 leading-relaxed">{s.d}</div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 z-10 w-6 h-6 bg-white ring-1 ring-ink-100 rounded-full items-center justify-center flex text-ink-300">
                  <I.ChevronRight size={12}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeAnalyze() {
  const [tab, setTab] = React.useState('phones');
  const tabs = [
    { id: 'phones', label: 'Teléfonos', icon: <I.Phone size={16}/> },
    { id: 'tablets', label: 'Tablets', icon: <I.Tablet size={16}/> },
    { id: 'laptops', label: 'Laptops y PCs', icon: <I.Laptop size={16}/> },
  ];
  const sets = {
    phones: [
      ['Pantalla táctil', <I.Touch/>], ['Pantalla LED/OLED', <I.Screen/>], ['Bocinas', <I.Speaker/>],
      ['Micrófono', <I.Mic/>], ['Cámaras', <I.Camera/>], ['Batería', <I.Battery/>],
      ['Giroscopio', <I.Sensor/>], ['Acelerómetro', <I.Sensor/>], ['Proximidad', <I.Sensor/>],
      ['GPS', <I.Gps/>], ['Wi-Fi', <I.Wifi/>], ['Bluetooth', <I.Bluetooth/>],
      ['Botones físicos', <I.Button/>], ['Puerto de carga', <I.Plug/>], ['IMEI', <I.Shield/>],
    ],
    tablets: [
      ['Pantalla táctil', <I.Touch/>], ['Pantalla LED/OLED', <I.Screen/>], ['Bocinas', <I.Speaker/>],
      ['Micrófono', <I.Mic/>], ['Cámaras', <I.Camera/>], ['Batería', <I.Battery/>],
      ['Sensores', <I.Sensor/>], ['Wi-Fi', <I.Wifi/>], ['Bluetooth', <I.Bluetooth/>],
      ['Lápiz óptico', <I.Touch/>], ['Puerto de carga', <I.Plug/>], ['Botones físicos', <I.Button/>],
    ],
    laptops: [
      ['CPU', <I.Cpu/>], ['RAM', <I.Ram/>], ['Disco / SSD', <I.Disk/>],
      ['Pantalla', <I.Screen/>], ['Teclado', <I.Keyboard/>], ['Trackpad', <I.Track/>],
      ['Batería', <I.Battery/>], ['Webcam', <I.Camera/>], ['Parlantes', <I.Speaker/>],
      ['Micrófono', <I.Mic/>], ['Wi-Fi', <I.Wifi/>], ['GPU', <I.Gpu/>],
      ['Temperatura', <I.Thermo/>], ['Puertos', <I.Plug/>],
    ],
  };
  const current = sets[tab];
  return (
    <section id="dispositivos" className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            eyebrow="Qué analizamos"
            title={<>30+ componentes. Una sola herramienta.</>}
            subtitle="Filtrá por tipo de dispositivo. Cada prueba guiada. Cada resultado, verificable."
          />
          <div className="inline-flex rounded-full bg-white ring-1 ring-ink-100 p-1 shadow-soft self-start md:self-end">
            {tabs.map(t=>(
              <button
                key={t.id}
                onClick={()=>setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full text-[13.5px] font-medium px-4 py-2 transition ${tab===t.id ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {current.map(([name, icon], i) => (
            <div key={name+i} className="group relative rounded-2xl bg-white ring-1 ring-ink-100 p-5 hover:ring-ink-900 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-ink-50 text-ink-900 flex items-center justify-center group-hover:bg-mint-500 transition-colors">
                  {React.cloneElement(icon, { size: 18 })}
                </div>
                <div className="w-5 h-5 rounded-full bg-mint-500/10 text-mint-600 flex items-center justify-center">
                  <I.Check size={11} stroke={3}/>
                </div>
              </div>
              <div className="mt-4 font-medium text-[14px] text-ink-900">{name}</div>
              <div className="mt-1 text-[11px] font-mono text-ink-400">prueba guiada</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { t: 'Evitá estafas', d: 'Detectamos bloqueos, reportes de robo y piezas no originales antes de que pagues.', icon: <I.Shield/> },
    { t: 'Diagnóstico en minutos', d: 'Un análisis completo en menos de 5 minutos. Tu tiempo vale más que eso.', icon: <I.Clock/> },
    { t: 'Sin conocimientos técnicos', d: 'SmartCheck te dice qué tocar y qué decir. Lo complejo queda en nuestra parte.', icon: <I.Zap/> },
    { t: 'Reporte compartible', d: 'PDF descargable y link público con fecha, hora y evidencia fotográfica.', icon: <I.Share/> },
    { t: 'Compatible universal', d: 'Android, iOS, Windows, macOS. Funciona en el mismo dispositivo que querés probar.', icon: <I.Globe/> },
    { t: 'Precisión profesional', d: 'La misma batería de pruebas que usan técnicos certificados. Sin jerga.', icon: <I.Sparkles/> },
  ];
  return (
    <section className="py-24 lg:py-32 bg-white border-y border-ink-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="Beneficios clave"
          title={<>Lo que un técnico hace en 1 hora, en tu mano.</>}
        />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(b => (
            <div key={b.t} className="group rounded-2xl bg-canvas ring-1 ring-ink-100 p-7 hover:bg-white hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-ink-900 text-white flex items-center justify-center group-hover:bg-mint-500 group-hover:text-ink-900 transition-colors">
                {React.cloneElement(b.icon, { size: 20 })}
              </div>
              <div className="mt-5 font-display font-semibold text-[19px] text-ink-900">{b.t}</div>
              <div className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{b.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { t: 'Comprador', d: 'Pedile al vendedor un reporte SmartCheck antes de transferir.', icon: <I.User/>, stat: '98% evitan estafas' },
    { t: 'Vendedor', d: 'Adjuntá el reporte a tu publicación. Vendé más rápido y al precio justo.', icon: <I.Store/>, stat: '+23% velocidad de venta' },
    { t: 'Técnico', d: 'Recibí el equipo con un diagnóstico de partida. Ahorrá tiempo de inspección.', icon: <I.Wrench/>, stat: '−35 min por equipo' },
    { t: 'Taller / Reacondicionador', d: 'Estandarizá el QC de tu inventario con reportes firmados por unidad.', icon: <I.Building/>, stat: '100% trazable' },
    { t: 'Aseguradora', d: 'Documentá el estado del equipo al inicio y cierre de póliza.', icon: <I.Shield/>, stat: 'evidencia auditable' },
  ];
  return (
    <section className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="Para quién"
          title="Cinco formas de usar SmartCheck."
          subtitle="Desde una venta entre particulares hasta un taller con cientos de equipos por mes."
        />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cases.map((c,i) => (
            <div key={c.t} className={`rounded-2xl p-6 ring-1 ${i===0 ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-100'} transition-all hover:-translate-y-0.5`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i===0 ? 'bg-mint-500 text-ink-900' : 'bg-ink-50 text-ink-900'}`}>
                {React.cloneElement(c.icon, { size: 18 })}
              </div>
              <div className={`mt-5 font-display font-semibold text-[17px] ${i===0 ? 'text-white' : 'text-ink-900'}`}>{c.t}</div>
              <div className={`mt-2 text-[13.5px] leading-relaxed ${i===0 ? 'text-white/70' : 'text-ink-500'}`}>{c.d}</div>
              <div className={`mt-5 text-[11px] font-mono ${i===0 ? 'text-mint-400' : 'text-mint-600'}`}>{c.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SectionHeader, ProblemSolution, StepsHow, WhatWeAnalyze, Benefits, UseCases });
