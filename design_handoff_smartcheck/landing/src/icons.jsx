// Minimal icon set drawn inline (stroke-based, lucide-like, original)
const Icon = ({ children, size=20, className='', stroke=1.75 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">{children}</svg>
);

const I = {
  Check: (p) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>,
  CheckCircle: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></Icon>,
  Arrow: (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>,
  Play: (p) => <Icon {...p}><path d="M7 5v14l12-7z"/></Icon>,
  Shield: (p) => <Icon {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></Icon>,
  Scan: (p) => <Icon {...p}><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 12h16"/></Icon>,
  Phone: (p) => <Icon {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></Icon>,
  Tablet: (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/></Icon>,
  Laptop: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></Icon>,
  Battery: (p) => <Icon {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4"/><path d="M9 10v4"/><path d="M12 10v4"/></Icon>,
  Mic: (p) => <Icon {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></Icon>,
  Speaker: (p) => <Icon {...p}><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/></Icon>,
  Camera: (p) => <Icon {...p}><path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></Icon>,
  Wifi: (p) => <Icon {...p}><path d="M5 12a11 11 0 0 1 14 0M8 15a7 7 0 0 1 8 0"/><circle cx="12" cy="18" r="1"/></Icon>,
  Bluetooth: (p) => <Icon {...p}><path d="m7 7 10 10-5 4V3l5 4L7 17"/></Icon>,
  Gps: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></Icon>,
  Sensor: (p) => <Icon {...p}><circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 7 3M12 2a10 10 0 0 0-7 3M12 22a10 10 0 0 0 7-3M12 22a10 10 0 0 1-7-3"/></Icon>,
  Plug: (p) => <Icon {...p}><path d="M9 2v4M15 2v4"/><path d="M7 6h10v4a5 5 0 0 1-10 0z"/><path d="M12 15v7"/></Icon>,
  Button: (p) => <Icon {...p}><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="16" cy="12" r="2"/></Icon>,
  Touch: (p) => <Icon {...p}><path d="M9 11V5a2 2 0 1 1 4 0v6"/><path d="M9 11V8a2 2 0 1 0-4 0v5a8 8 0 0 0 8 8h1a5 5 0 0 0 5-5v-3a2 2 0 1 0-4 0"/><path d="M17 11V9a2 2 0 1 0-4 0v2"/></Icon>,
  Screen: (p) => <Icon {...p}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></Icon>,
  Cpu: (p) => <Icon {...p}><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></Icon>,
  Ram: (p) => <Icon {...p}><rect x="2" y="8" width="20" height="8" rx="1"/><path d="M6 8v8M10 8v8M14 8v8M18 8v8"/></Icon>,
  Disk: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></Icon>,
  Keyboard: (p) => <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></Icon>,
  Track: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></Icon>,
  Gpu: (p) => <Icon {...p}><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/></Icon>,
  Thermo: (p) => <Icon {...p}><path d="M14 14V4a2 2 0 1 0-4 0v10a4 4 0 1 0 4 0z"/></Icon>,
  File: (p) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 14h6M9 18h4"/></Icon>,
  Share: (p) => <Icon {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></Icon>,
  Download: (p) => <Icon {...p}><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></Icon>,
  Zap: (p) => <Icon {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></Icon>,
  Lock: (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></Icon>,
  Clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  User: (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>,
  Store: (p) => <Icon {...p}><path d="M3 9h18l-1-5H4z"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></Icon>,
  Wrench: (p) => <Icon {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3-2-2z"/></Icon>,
  Building: (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/></Icon>,
  Swap: (p) => <Icon {...p}><path d="M7 4 4 7l3 3M4 7h11a4 4 0 0 1 4 4M17 20l3-3-3-3M20 17H9a4 4 0 0 1-4-4"/></Icon>,
  ChevronDown: (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  ChevronRight: (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>,
  Plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Globe: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></Icon>,
  Star: (p) => <Icon {...p}><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/></Icon>,
  Sparkles: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></Icon>,
  Dot: (p) => <Icon {...p}><circle cx="12" cy="12" r="3" fill="currentColor"/></Icon>,
  X: (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>,
  Menu: (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>,
  Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
};

window.I = I;
window.Icon = Icon;
