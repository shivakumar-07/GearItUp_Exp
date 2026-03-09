export const T = {
  bg: "#0A0F1D",   // Deep navy background
  surface: "#121B2F",   // Progressive slate surface
  card: "#1A253D",   // Elevated card surface
  cardHover: "#23314F",
  border: "#2A3B59",
  borderHi: "#3B5075",
  // Amber — primary brand
  amber: "#F59E0B",
  amberDim: "#92400E",
  amberGlow: "rgba(245,158,11,0.12)",
  amberSoft: "rgba(245,158,11,0.06)",
  // Emerald — profit/success (fitment/stock)
  emerald: "#10B981",
  emeraldDim: "#065F46",
  emeraldBg: "rgba(16,185,129,0.1)",
  // Crimson — loss/danger (incompatible/no stock)
  crimson: "#EF4444",
  crimsonDim: "#7F1D1D",
  crimsonBg: "rgba(239,68,68,0.1)",
  // Sky — info/purchase (universal fit)
  sky: "#38BDF8",
  skyDim: "#0C4A6E",
  skyBg: "rgba(56,189,248,0.1)",
  // Violet — accent secondary
  violet: "#A78BFA",
  violetBg: "rgba(167,139,250,0.1)",
  // Text hierarchy
  t1: "#F0F4F8",   // headings
  t2: "#94A3B8",   // secondary
  t3: "#64748B",   // muted
  t4: "#334155",   // very muted
};

export const FONT = {
  ui: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${T.bg}; color: ${T.t1}; font-family: ${FONT.ui}; }

  /* ── Scrollbars ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }

  .custom-scroll::-webkit-scrollbar { width: 3px; }
  .custom-scroll::-webkit-scrollbar-track { background: transparent; }
  .custom-scroll::-webkit-scrollbar-thumb { background: ${T.t4}; border-radius: 10px; }

  /* ── Form Resets ── */
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input::placeholder, textarea::placeholder { color: ${T.t3}; }
  select option { background: ${T.card}; color: ${T.t1}; }
  * { -webkit-tap-highlight-color: transparent; }

  /* ═══════ ANIMATIONS ═══════ */

  /* Page & Element Entrances */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:none; } }
  @keyframes slideRight { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:none; } }
  @keyframes slideLeft  { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:none; } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
  @keyframes toastSlide { from { opacity:0; transform:translateX(24px) scale(0.96); } to { opacity:1; transform:none; } }

  /* Loading & Feedback */
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
  @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Ambient Effects */
  @keyframes float    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px rgba(245,158,11,0.1); } 50% { box-shadow: 0 0 30px rgba(245,158,11,0.25); } }
  @keyframes borderGlow { 0%,100% { border-color: ${T.border}; } 50% { border-color: ${T.borderHi}; } }

  /* ═══════ UTILITY CLASSES ═══════ */

  /* Page transitions */
  .page-in   { animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
  .modal-in  { animation: scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
  .toast-in  { animation: toastSlide 0.3s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-in   { animation: fadeIn 0.2s ease both; }

  /* Row hover (tables, lists) */
  .row-hover { transition: background 0.15s ease; }
  .row-hover:hover { background: ${T.cardHover} !important; }

  /* Nav items */
  .nav-item { transition: all 0.2s ease; position: relative; }
  .nav-item:hover:not(.nav-active) { background: ${T.amberGlow} !important; color: ${T.amber} !important; }
  .nav-active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: ${T.amber};
    border-radius: 2px;
  }

  /* Button hover — ghost/subtle buttons */
  .btn-hover { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); }
  .btn-hover:hover:not(:disabled) {
    filter: brightness(1.15);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .btn-hover:active:not(:disabled) { transform: translateY(0); filter: brightness(1); }

  /* Button hover — solid primary CTA buttons */
  .btn-hover-solid { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); }
  .btn-hover-solid:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(245,158,11,0.35), 0 2px 8px rgba(245,158,11,0.2);
    filter: brightness(1.08);
  }
  .btn-hover-solid:active:not(:disabled) { transform: translateY(0) scale(1); }

  /* Button hover — subtle/ghost */
  .btn-hover-subtle { transition: background 0.2s, color 0.2s, transform 0.2s; }
  .btn-hover-subtle:hover { background: ${T.amberGlow} !important; color: ${T.amber} !important; }

  /* Card hover — shop-owner cards */
  .card-hover { transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
  .card-hover:hover {
    border-color: ${T.borderHi} !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${T.borderHi} !important;
    transform: translateY(-2px);
  }

  /* Marketplace product card hover — premium lift effect */
  .mp-card-hover { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
  .mp-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${T.borderHi};
    border-color: ${T.borderHi} !important;
  }

  /* Glow utilities */
  .glow-amber   { box-shadow: 0 0 24px rgba(245,158,11,0.2), 0 0 48px rgba(245,158,11,0.05); }
  .glow-emerald { box-shadow: 0 0 24px rgba(16,185,129,0.15); }
  .glow-crimson { box-shadow: 0 0 24px rgba(239,68,68,0.15); }
  .glow-sky     { box-shadow: 0 0 24px rgba(56,189,248,0.15); }

  /* Glassmorphism utility */
  .glass {
    background: rgba(18,27,47,0.75) !important;
    backdrop-filter: blur(16px) saturate(1.2);
    -webkit-backdrop-filter: blur(16px) saturate(1.2);
    border: 1px solid rgba(59,80,117,0.4) !important;
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, ${T.amber}, #FBBF24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Skeleton loader shimmer */
  .skeleton-shimmer {
    background: linear-gradient(90deg, ${T.card} 25%, ${T.cardHover} 50%, ${T.card} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease infinite;
  }

  /* Subtle ambient float */
  .float { animation: float 4s ease-in-out infinite; }
  .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
`;
