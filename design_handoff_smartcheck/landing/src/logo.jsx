function Logo({ size = 32, mark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-label="SmartCheck">
        <rect x="4" y="4" width="64" height="64" rx="15" fill="#151930"/>
        <text x="36" y="47" textAnchor="middle" fontFamily="Geist, Inter, sans-serif" fontSize="32" fontWeight="800" fill="#C6FFAD" letterSpacing="-1.2">SC</text>
        <circle cx="54" cy="14" r="5" fill="#C6FFAD"/>
      </svg>
      {!mark && (
        <span className="font-display font-semibold text-[18px] tracking-tight text-ink-900">
          SmartCheck
        </span>
      )}
    </div>
  );
}
window.Logo = Logo;

// Brand-compatibility glyphs (generic, non-branded device silhouettes)
function DeviceGlyph({ label }) {
  const map = {
    ios: <><rect x="9" y="2" width="14" height="28" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M13 5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
    android: <><rect x="9" y="4" width="14" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8h8" stroke="currentColor" strokeWidth="1.2"/><circle cx="16" cy="25" r="0.8" fill="currentColor"/></>,
    windows: <><rect x="3" y="6" width="26" height="18" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M16 6v18M3 15h26" stroke="currentColor" strokeWidth="1"/></>,
    tablet: <><rect x="5" y="3" width="22" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
    laptop: <><path d="M5 8h22v13H5z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M2 23h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    chip: <><rect x="8" y="8" width="16" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="12" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4" stroke="currentColor" strokeWidth="1"/></>,
    wear: <><rect x="10" y="8" width="12" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M13 4h6l-1 4h-4zM13 28h6l-1-4h-4z" fill="none" stroke="currentColor" strokeWidth="1.2"/></>,
  };
  return (
    <div className="flex items-center gap-2.5 text-ink-400">
      <svg width="30" height="30" viewBox="0 0 32 32">{map[label.toLowerCase()] || map.chip}</svg>
      <span className="text-[13px] font-medium text-ink-500">{label}</span>
    </div>
  );
}
window.DeviceGlyph = DeviceGlyph;
