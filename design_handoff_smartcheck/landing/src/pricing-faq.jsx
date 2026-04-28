function Pricing({ tweaks }) {
  const [annual, setAnnual] = React.useState(true);
  const plans = [
    {
      name: 'Gratis', price: { m: '$0', y: '$0' }, desc: 'Para quien quiere probar antes de comprar.',
      cta: 'Empezar gratis',
      features: ['1 diagnóstico rápido por día', 'Verificación IMEI básica', 'Reporte en pantalla', 'Sin tarjeta de crédito'],
      highlight: false,
    },
    {
      name: 'Pro', price: { m: '$9.99', y: '$7.99' }, desc: 'Para vendedores y compradores frecuentes.',
      cta: 'Probar Pro 7 días',
      features: ['Diagnósticos ilimitados', 'IMEI con cruce internacional', 'Reporte PDF + link compartible', 'Historial de hasta 50 reportes', 'Soporte prioritario'],
      highlight: true,
    },
    {
      name: 'Negocio', price: { m: '$29.99', y: '$24.99' }, desc: 'Para talleres, tiendas y reacondicionadores.',
      cta: 'Hablar con ventas',
      features: ['Todo lo del plan Pro', 'Hasta 10 técnicos', 'Branding del reporte', 'Panel de control multi-equipo', 'API y exportación CSV', 'SLA y onboarding dedicado'],
      highlight: false,
    },
  ];
  return (
    <section id="precios" className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="Precios"
          title="Simple. Por lo que realmente usás."
          subtitle="Empezá gratis. Escalá cuando tu volumen lo pida. Cancelás cuando quieras."
          align="center"
        />
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-ink-100 p-1 shadow-soft">
            <button onClick={()=>setAnnual(false)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition ${!annual ? 'bg-ink-900 text-white' : 'text-ink-500'}`}>Mensual</button>
            <button onClick={()=>setAnnual(true)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition ${annual ? 'bg-ink-900 text-white' : 'text-ink-500'}`}>
              Anual <span className={`ml-1 text-[10.5px] ${annual ? 'text-mint-400' : 'text-mint-600'}`}>−20%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 lg:gap-6">
          {plans.map(p => (
            <div key={p.name}
              className={`relative rounded-3xl p-8 ring-1 transition ${p.highlight ? 'bg-ink-900 text-white ring-ink-900 shadow-lift lg:-translate-y-2' : 'bg-white ring-ink-100'}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 chip rounded-full bg-mint-500 text-ink-900 text-[10.5px] font-semibold tracking-wide uppercase px-3 py-1 border-0 ring-0">
                  Más popular
                </div>
              )}
              <div className={`text-[13px] font-semibold tracking-wide uppercase ${p.highlight ? 'text-mint-400' : 'text-ink-400'}`}>{p.name}</div>
              <div className="mt-4 flex items-end gap-1">
                <span className={`font-display text-[44px] font-semibold leading-none ${p.highlight ? 'text-white' : 'text-ink-900'}`}>{annual ? p.price.y : p.price.m}</span>
                <span className={`text-[13px] pb-1.5 ${p.highlight ? 'text-white/60' : 'text-ink-400'}`}>/ mes</span>
              </div>
              <div className={`mt-2 text-[13.5px] ${p.highlight ? 'text-white/70' : 'text-ink-500'}`}>{p.desc}</div>
              <a href="#cta" className={`mt-6 inline-flex w-full justify-center items-center gap-1.5 rounded-full text-[14px] font-medium px-5 py-3 transition ${p.highlight ? 'bg-mint-500 text-ink-900 hover:bg-mint-400' : 'bg-ink-900 text-white hover:bg-ink-800'}`}>
                {p.cta} <I.Arrow size={15}/>
              </a>
              <div className={`mt-7 border-t pt-6 space-y-3 ${p.highlight ? 'border-white/10' : 'border-ink-100'}`}>
                {p.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${p.highlight ? 'bg-mint-500/20 text-mint-400' : 'bg-mint-500/15 text-mint-600'}`}>
                      <I.Check size={10} stroke={3.5}/>
                    </span>
                    <span className={`text-[13.5px] ${p.highlight ? 'text-white/85' : 'text-ink-700'}`}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-[13px] text-ink-400">
          Sin registro para la prueba · Cancelás cuando quieras · Facturación en USD, pagos en moneda local
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: 'Compré un equipo por Marketplace y el vendedor me mandó el reporte de SmartCheck. Pagué con confianza. Cero sorpresas.',
      n: 'María Fernanda Ortiz', r: 'Compradora', l: 'Ciudad de México, MX',
      stat: ['−1', 'hora de inspección'],
    },
    {
      q: 'Adjunto el link del reporte a cada publicación. Vendo los equipos un 20% más rápido y nadie regatea tanto.',
      n: 'Diego Rojas', r: 'Vendedor particular', l: 'Bogotá, CO',
      stat: ['+23%', 'velocidad de venta'],
    },
    {
      q: 'En el taller procesamos 60 equipos por semana. SmartCheck estandarizó nuestro QC y ahorra una persona completa.',
      n: 'Camila Vera', r: 'Gerente de operaciones', l: 'Santiago, CL',
      stat: ['−35 min', 'por equipo'],
    },
  ];
  return (
    <section className="py-24 lg:py-32 bg-white border-y border-ink-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="Testimonios"
          title="Gente real. Resultados medibles."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((t,i)=>(
            <div key={i} className="rounded-3xl bg-canvas ring-1 ring-ink-100 p-7 flex flex-col">
              <div className="flex gap-0.5 text-mint-500">
                {Array.from({length:5}).map((_,k)=><I.Star key={k} size={14} stroke={1.5}/>)}
              </div>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-800 font-display font-medium">"{t.q}"</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-900 text-white flex items-center justify-center font-display font-semibold text-[13px]">
                    {t.n.split(' ').map(x=>x[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink-900">{t.n}</div>
                    <div className="text-[11.5px] text-ink-400">{t.r} · {t.l}</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-ink-100 flex items-baseline gap-2">
                <span className="font-display font-semibold text-[22px] text-ink-900">{t.stat[0]}</span>
                <span className="text-[12px] text-ink-400">{t.stat[1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qas = [
    ['¿Funciona sin internet?', 'Necesitás conexión para el chequeo de IMEI (que consulta bases online). El resto del diagnóstico de hardware funciona offline en el navegador del propio dispositivo.'],
    ['¿Necesito instalar algo?', 'No. SmartCheck corre desde el navegador en teléfonos, tablets, laptops y PCs. Sin apps, sin permisos intrusivos, sin cuentas para empezar.'],
    ['¿Qué tan confiable es el chequeo de IMEI?', 'Consultamos seis bases internacionales, incluyendo registros de operadores, GSMA y listas de reporte por robo. Los resultados se actualizan en tiempo real y quedan firmados en el reporte.'],
    ['¿Y si falla un componente?', 'El reporte marca exactamente qué falló, con evidencia técnica y severidad. Podés usarlo para negociar el precio, rechazar la compra o llevarlo a reparación con un diagnóstico claro.'],
    ['¿En qué países funciona?', 'Funciona en cualquier país con internet. El cruce de IMEI tiene cobertura específica en México, Colombia, Chile, Argentina, Perú, Brasil, Ecuador, Uruguay y España.'],
    ['¿Es seguro para mi privacidad?', 'No extraemos datos personales del dispositivo. Las pruebas son sensoriales (tocar, escuchar, mover) y nunca accedemos a fotos, contactos o mensajes. El reporte es tuyo.'],
    ['¿SmartCheck desbloquea dispositivos?', 'No. SmartCheck verifica; no modifica el equipo. Detectamos bloqueos pero no los removemos — eso corresponde al dueño legítimo vía el fabricante o el operador.'],
    ['¿Puedo cancelar en cualquier momento?', 'Sí. Cancelás desde tu panel en un click. Sin llamadas, sin retenciones, sin preguntas. Los reportes generados siguen siendo tuyos para siempre.'],
  ];
  return (
    <section id="faq" className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-24 h-max">
          <SectionHeader
            eyebrow="Dudas frecuentes"
            title="Objeciones, resueltas."
            subtitle="Si algo no está acá, escribinos. Respondemos en menos de 4 horas hábiles."
          />
          <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-900 hover:gap-2.5 transition-all">
            Contactar soporte <I.Arrow size={15}/>
          </a>
        </div>
        <div className="divide-y divide-ink-100 border-y border-ink-100">
          {qas.map(([q,a], i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-start justify-between gap-4 cursor-pointer">
                <span className="font-display font-semibold text-[17px] text-ink-900 leading-snug">{q}</span>
                <span className="shrink-0 w-8 h-8 rounded-full bg-white ring-1 ring-ink-100 flex items-center justify-center text-ink-500 group-open:bg-ink-900 group-open:text-white transition">
                  <I.Plus size={14} className="group-open:rotate-45 transition-transform"/>
                </span>
              </summary>
              <div className="mt-3 text-[14.5px] leading-relaxed text-ink-500 pr-12">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="relative rounded-[32px] cta-gradient overflow-hidden p-10 lg:p-20 text-white">
          <div className="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-mint-500/20 blur-3xl"></div>
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[12px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span>
                Probá gratis. Sin tarjeta.
              </div>
              <h2 className="mt-5 font-display font-semibold text-[40px] sm:text-[56px] leading-[1.02] tracking-tight">
                El próximo equipo<br/> que compres o vendas<br/>
                <span className="text-mint-400">verificalo bien.</span>
              </h2>
              <p className="mt-5 text-white/70 text-[17px] leading-relaxed max-w-[540px]">
                Empezá con un diagnóstico gratis. Te lleva menos tiempo que leer las respuestas de una publicación.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#" className="group inline-flex items-center gap-2 rounded-full bg-mint-500 text-ink-900 font-semibold text-[15px] px-6 py-3.5 hover:bg-mint-400 transition">
                  Iniciar diagnóstico gratis
                  <I.Arrow size={17} className="group-hover:translate-x-0.5 transition-transform"/>
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 text-white font-medium text-[15px] px-6 py-3.5 hover:bg-white/15 transition">
                  Hablar con ventas
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Sin registro','para la prueba', <I.Lock size={18}/>],
                ['Cancelás','cuando quieras', <I.Swap size={18}/>],
                ['< 5 min','al diagnóstico', <I.Clock size={18}/>],
                ['Reporte','firmado y fechado', <I.File size={18}/>],
              ].map(([a,b,ic])=>(
                <div key={a} className="rounded-2xl bg-white/[0.05] ring-1 ring-white/10 p-5">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-mint-400 flex items-center justify-center">{ic}</div>
                  <div className="mt-4 font-display font-semibold text-[18px]">{a}</div>
                  <div className="text-[12.5px] text-white/60">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ['Producto', ['Cómo funciona','Dispositivos','Precios','Demo','Changelog']],
    ['Empresa', ['Sobre nosotros','Clientes','Prensa','Contacto','Empleos']],
    ['Recursos', ['Centro de ayuda','Guías','Estado del servicio','API','Integraciones']],
    ['Legal', ['Términos','Privacidad','Cookies','Compatibilidad','Aviso legal']],
  ];
  return (
    <footer className="bg-ink-900 text-white/70">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_2fr] gap-12">
          <div>
            <div className="flex items-center gap-2">
              <svg width="30" height="30" viewBox="0 0 72 72" fill="none">
                <rect x="4" y="4" width="64" height="64" rx="15" fill="#C6FFAD"/>
                <text x="36" y="47" textAnchor="middle" fontFamily="Geist, Inter, sans-serif" fontSize="32" fontWeight="800" fill="#151930" letterSpacing="-1.2">SC</text>
                <circle cx="54" cy="14" r="5" fill="#151930"/>
              </svg>
              <span className="font-display font-semibold text-[17px] text-white">SmartCheck</span>
            </div>
            <p className="mt-5 text-[14px] max-w-xs leading-relaxed">Diagnóstico profesional de dispositivos. Verificación objetiva para comprar y vender con certeza.</p>
            <div className="mt-6 flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-[12.5px]">
                <I.Globe size={13}/> Español (LATAM)
                <I.ChevronDown size={13}/>
              </button>
            </div>
            <div className="mt-5 flex gap-2">
              {['X','In','Yt','Gh'].map(s=>(
                <a key={s} href="#" className="w-9 h-9 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-[11px] font-semibold hover:bg-white/10 transition">{s}</a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map(([t,ls])=>(
              <div key={t}>
                <div className="text-[12px] font-semibold tracking-wide uppercase text-white">{t}</div>
                <ul className="mt-4 space-y-2.5 text-[13.5px]">
                  {ls.map(l=><li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[12.5px] text-white/50">© 2026 SmartCheck Labs. Compatibilidad no implica afiliación con marcas de terceros.</div>
          <div className="text-[12.5px] text-white/50 font-mono">v2.4.1 · todos los sistemas operativos</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Pricing, Testimonials, FAQ, FinalCTA, Footer });
