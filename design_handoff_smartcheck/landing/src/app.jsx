const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline": "Sabé exactamente qué hay dentro del equipo.",
  "accent": "#C6FFAD",
  "cta": "Probar gratis",
  "bg": "#FAFAF7"
}/*EDITMODE-END*/;

function applyAccent(hex) {
  // Swap mint-500 usage via CSS variable injection
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
}

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const setTweak = (k, v) => setTweaks(t => ({ ...t, [k]: v }));

  React.useEffect(() => {
    document.body.style.background = tweaks.bg;
  }, [tweaks.bg]);

  React.useEffect(() => {
    // live apply accent via dynamic stylesheet
    const id = 'accent-override';
    let s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
    const a = tweaks.accent || '#C6FFAD';
    s.textContent = `
      .bg-mint-500{background-color:${a} !important}
      .text-mint-500{color:${a} !important}
      .text-mint-400{color:${a} !important}
      .text-mint-600{color:#529a33 !important}
      .text-mint-700{color:#3d7826 !important}
      .ring-mint-500\\/30{--tw-ring-color:${a}55 !important}
      .ring-mint-400{--tw-ring-color:${a} !important}
      .ring-mint-200{--tw-ring-color:${a}44 !important}
      .bg-mint-500\\/10{background-color:${a}1A !important}
      .bg-mint-500\\/15{background-color:${a}26 !important}
      .bg-mint-500\\/20{background-color:${a}33 !important}
      .bg-mint-500\\/30{background-color:${a}4D !important}
      .bg-mint-500\\/40{background-color:${a}66 !important}
      .bg-mint-500\\/60{background-color:${a}99 !important}
      .bg-mint-50{background-color:${a}14 !important}
      .bg-mint-400{background-color:${a}CC !important}
      .hover\\:bg-mint-400:hover{background-color:${a}CC !important}
      .from-mint-500\\/30{--tw-gradient-from:${a}4D var(--tw-gradient-from-position) !important}
      .to-mint-500{--tw-gradient-to:${a} var(--tw-gradient-to-position) !important}
      .from-mint-500\\/20{--tw-gradient-from:${a}33 var(--tw-gradient-from-position) !important}
    `;
  }, [tweaks.accent]);

  return (
    <>
      <Navbar ctaLabel={tweaks.cta}/>
      <main>
        <Hero tweaks={tweaks}/>
        <TrustBar/>
        <ProblemSolution/>
        <StepsHow/>
        <WhatWeAnalyze/>
        <Benefits/>
        <InteractiveDemo/>
        <UseCases/>
        <Pricing tweaks={tweaks}/>
        <Testimonials/>
        <FAQ/>
        <FinalCTA/>
      </main>
      <Footer/>
      <TweaksPanel tweaks={tweaks} setTweak={setTweak}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
