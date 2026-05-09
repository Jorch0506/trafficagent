// components/LogoSVG.jsx
// Logo vectorial de CAEVIK reutilizable en toda la app

export function LogoSVG({ id = "logo", width = 200, height = 52 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B61FF" />
          <stop offset="100%" stopColor="#00C2FF" />
        </linearGradient>
      </defs>
      <path d="M70 15 C45 15 25 35 25 60 C25 85 70 125 70 125 C70 125 115 85 115 60 C115 35 95 15 70 15 Z" fill={`url(#${id})`} />
      <path d="M70 85 C60 85 52 78 52 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M70 85 C80 85 88 78 88 70" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M70 85 C55 85 43 73 43 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      <path d="M70 85 C85 85 97 73 97 60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      <circle cx="70" cy="85" r="5" fill="white" />
      <polygon points="70,2 58,22 82,22" fill="#9B6FFF" />
      <rect x="64" y="18" width="12" height="18" fill="#9B6FFF" rx="2" />
      <text x="130" y="82" fontFamily="Arial Black, sans-serif" fontSize="56" fontWeight="900" fill="white" letterSpacing="4">CAEVIK</text>
      <line x1="130" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="158" y="104" fontFamily="Arial, sans-serif" fontSize="13" fill="#94a3b8" letterSpacing="3">AI · TRAFFIC · AGENT</text>
      <line x1="380" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
    </svg>
  );
}
