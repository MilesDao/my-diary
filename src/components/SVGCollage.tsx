import React from 'react';

// A pushpin / thumb tack holding down the avatar
export const Pushpin: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-8 h-8 drop-shadow-md select-none pointer-events-none ${className}`}
  >
    {/* Metal needle shadow */}
    <path d="M50 45 L50 85" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    {/* Metal needle */}
    <path d="M50 40 L50 80" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
    {/* Brass cap collar */}
    <ellipse cx="50" cy="40" rx="14" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
    {/* Pin body (copper/amber glass dome) */}
    <path
      d="M36 40 C36 30, 40 20, 50 18 C60 20, 64 30, 64 40 Z"
      fill="url(#pin-gradient)"
      stroke="#78350f"
      strokeWidth="1.5"
    />
    {/* Pin top knob */}
    <circle cx="50" cy="18" r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
    {/* Highlight shine */}
    <ellipse cx="46" cy="28" rx="4" ry="8" fill="#fef08a" opacity="0.6" transform="rotate(-15, 46, 28)" />
    <defs>
      <radialGradient id="pin-gradient" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="70%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </radialGradient>
    </defs>
  </svg>
);

// Tape holding elements
export const PaperTape: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`relative px-6 py-2 select-none ${className}`}>
    {/* Absolute Background with Filter */}
    <div
      className="absolute inset-0 bg-vintage-tape/90 border border-stone-300/40 pointer-events-none"
      style={{ filter: 'url(#torn-paper-subtle)' }}
    />
    {/* Subtle wood fiber / paper texture */}
    <div className="absolute inset-0 bg-repeat opacity-[0.06] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2c251e 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
    {/* Deckled / torn tape side effects */}
    <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-stone-400/20 to-transparent pointer-events-none" />
    <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-stone-400/20 to-transparent pointer-events-none" />
    {/* Crisp content layer */}
    <div className="relative z-10">{children}</div>
  </div>
);

// Lined Paper Page Container (The journal binder area)
export const LinedPaperPage: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`relative p-6 md:p-10 min-h-[400px] text-vintage-dark ${className}`}>
    {/* Absolute Background with Filter */}
    <div
      className="absolute inset-0 bg-vintage-cream border border-stone-300/50 shadow-lg pointer-events-none"
      style={{ filter: 'url(#torn-paper)' }}
    />
    {/* Subtle paper noise texture */}
    <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
    {/* Vertical margin line (red notebook margin) */}
    <div className="absolute left-8 md:left-14 top-0 bottom-0 w-[1.5px] bg-red-400/40 pointer-events-none" />
    {/* Binder ring hole markers (top or left side) */}
    <div className="absolute left-3 md:left-6 top-0 bottom-0 flex flex-col justify-around py-10 pointer-events-none opacity-40">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-3 h-3 rounded-full bg-stone-700/30 border border-stone-800/20 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-vintage-sepia" />
        </div>
      ))}
    </div>
    {/* Content layer */}
    <div className="pl-6 md:pl-10 relative z-10 h-full">{children}</div>
  </div>
);

// Vintage Moon illustration
export const MoonIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" className={`w-36 h-36 opacity-75 mix-blend-darken select-none pointer-events-none ${className}`}>
    <circle cx="100" cy="100" r="85" fill="#c2b8a3" stroke="#8c8069" strokeWidth="1.5" />
    {/* Craters with shadows and highlights */}
    <circle cx="70" cy="70" r="16" fill="#aba08a" stroke="#8c8069" strokeWidth="1" opacity="0.8" />
    <circle cx="120" cy="110" r="22" fill="#aba08a" stroke="#8c8069" strokeWidth="1" opacity="0.8" />
    <circle cx="130" cy="65" r="12" fill="#aba08a" stroke="#8c8069" strokeWidth="1" opacity="0.8" />
    <circle cx="75" cy="125" r="14" fill="#aba08a" stroke="#8c8069" strokeWidth="1" opacity="0.8" />
    <circle cx="100" cy="150" r="8" fill="#aba08a" stroke="#8c8069" strokeWidth="1" opacity="0.8" />
    {/* Crater details */}
    <path d="M70 54 A16 16 0 0 1 86 70" stroke="#f4edd8" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M120 88 A22 22 0 0 1 142 110" stroke="#f4edd8" strokeWidth="1.5" fill="none" opacity="0.5" />
    {/* Shading/scratches on moon */}
    <path d="M40 100 Q60 120 160 100" stroke="#786d56" strokeWidth="0.75" strokeDasharray="3 3" fill="none" />
    <path d="M50 70 Q100 80 150 70" stroke="#786d56" strokeWidth="0.75" strokeDasharray="4 2" fill="none" />
    <path d="M50 130 Q100 140 140 130" stroke="#786d56" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
  </svg>
);

// Sketchy Asian Pagoda
export const PagodaIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 400" className={`w-32 h-64 opacity-80 mix-blend-darken select-none pointer-events-none ${className}`}>
    {/* Base structure */}
    <path d="M40 380 L160 380 L150 350 L50 350 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="50" y1="380" x2="50" y2="350" stroke="#4e3e31" strokeWidth="1.5" />
    <line x1="150" y1="380" x2="150" y2="350" stroke="#4e3e31" strokeWidth="1.5" />
    <line x1="100" y1="380" x2="100" y2="350" stroke="#4e3e31" strokeWidth="1" strokeDasharray="2 2" />

    {/* Level 1 */}
    <rect x="60" y="300" width="80" height="50" fill="none" stroke="#4e3e31" strokeWidth="2" />
    <line x1="100" y1="300" x2="100" y2="350" stroke="#4e3e31" strokeWidth="1.5" />
    <line x1="80" y1="300" x2="80" y2="350" stroke="#4e3e31" strokeWidth="1" />
    <line x1="120" y1="300" x2="120" y2="350" stroke="#4e3e31" strokeWidth="1" />
    {/* Roof 1 */}
    <path d="M50 300 C40 300, 45 285, 60 280 L140 280 C155 285, 160 300, 150 300 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinejoin="round" />

    {/* Level 2 */}
    <rect x="68" y="240" width="64" height="40" fill="none" stroke="#4e3e31" strokeWidth="2" />
    <line x1="100" y1="240" x2="100" y2="280" stroke="#4e3e31" strokeWidth="1.5" />
    <line x1="84" y1="240" x2="84" y2="280" stroke="#4e3e31" strokeWidth="1" />
    <line x1="116" y1="240" x2="116" y2="280" stroke="#4e3e31" strokeWidth="1" />
    {/* Roof 2 */}
    <path d="M58 240 C50 240, 54 228, 68 223 L132 223 C146 228, 150 240, 142 240 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinejoin="round" />

    {/* Level 3 */}
    <rect x="75" y="190" width="50" height="33" fill="none" stroke="#4e3e31" strokeWidth="2" />
    <line x1="100" y1="190" x2="100" y2="223" stroke="#4e3e31" strokeWidth="1.5" />
    {/* Roof 3 */}
    <path d="M65 190 C58 190, 62 180, 75 175 L125 175 C138 180, 142 190, 135 190 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinejoin="round" />

    {/* Level 4 */}
    <rect x="80" y="145" width="40" height="30" fill="none" stroke="#4e3e31" strokeWidth="2" />
    {/* Roof 4 */}
    <path d="M72 145 C66 145, 70 137, 80 132 L120 132 C130 137, 134 145, 128 145 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinejoin="round" />

    {/* Level 5 (Top) */}
    <rect x="86" y="105" width="28" height="27" fill="none" stroke="#4e3e31" strokeWidth="2" />
    {/* Roof 5 */}
    <path d="M78 105 C73 105, 77 98, 86 94 L114 94 C123 98, 127 105, 122 105 Z" fill="none" stroke="#4e3e31" strokeWidth="2" strokeLinejoin="round" />

    {/* Spire / Finial */}
    <line x1="100" y1="94" x2="100" y2="40" stroke="#4e3e31" strokeWidth="2" />
    <circle cx="100" cy="75" r="5" fill="none" stroke="#4e3e31" strokeWidth="1.5" />
    <circle cx="100" cy="63" r="4" fill="none" stroke="#4e3e31" strokeWidth="1.5" />
    <circle cx="100" cy="53" r="3" fill="none" stroke="#4e3e31" strokeWidth="1.5" />
    <path d="M96 43 L104 43 M98 40 L102 40" stroke="#4e3e31" strokeWidth="1.5" />

    {/* Hand-drawn sketchy shading lines on the floors */}
    <path d="M60 365 L75 365 M125 365 L140 365" stroke="#4e3e31" strokeWidth="1" />
    <path d="M68 320 L74 320 M126 320 L132 320" stroke="#4e3e31" strokeWidth="1" />
    <path d="M85 260 L92 260 M108 260 L115 260" stroke="#4e3e31" strokeWidth="1" />

    {/* Ground landscape sketches below the pagoda */}
    <path d="M10 380 C30 378, 60 382, 90 380 C120 378, 170 383, 190 380 Q150 390, 100 390 Q50 390, 10 380 Z" fill="none" stroke="#4e3e31" strokeWidth="1.5" />
    <path d="M25 380 Q40 370 60 380" stroke="#4e3e31" strokeWidth="1" fill="none" />
    <path d="M140 380 Q160 372 175 380" stroke="#4e3e31" strokeWidth="1" fill="none" />
  </svg>
);

// Pink Cosmos Flower
export const PinkFlowerIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" className={`w-28 h-28 opacity-85 select-none pointer-events-none ${className}`}>
    {/* Stem */}
    <path d="M100 100 Q80 140 60 180" stroke="#5f6d45" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Leaf */}
    <path d="M85 130 Q110 120 120 105 Q100 125 80 140 Z" fill="#6c7a4d" stroke="#4b5534" strokeWidth="1" />

    {/* Flower center */}
    <circle cx="100" cy="100" r="14" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="10" fill="#fbbf24" />
    {/* Anthers (stamen dots) */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * 360) / 12;
      const rad = (angle * Math.PI) / 180;
      const x = 100 + Math.cos(rad) * 11;
      const y = 100 + Math.sin(rad) * 11;
      return <circle key={i} cx={x} cy={y} r="2" fill="#78350f" />;
    })}

    {/* Petals */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * 360) / 8 + 15;
      return (
        <path
          key={i}
          d="M100 100 C80 65, 75 40, 100 30 C125 40, 120 65, 100 100 Z"
          fill="url(#pink-petal-gradient)"
          stroke="#be185d"
          strokeWidth="1"
          opacity="0.9"
          transform={`rotate(${angle}, 100, 100)`}
          className="mix-blend-multiply"
        />
      );
    })}

    <defs>
      <radialGradient id="pink-petal-gradient" cx="50%" cy="80%" r="80%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="60%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </radialGradient>
    </defs>
  </svg>
);

// Purple Delphinium Flowers
export const PurpleFlowersIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" className={`w-36 h-36 opacity-85 select-none pointer-events-none ${className}`}>
    {/* Branch/Stem */}
    <path d="M120 180 Q105 110 50 50" stroke="#4d5f35" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Small flower buds */}
    <circle cx="60" cy="62" r="5" fill="#818cf8" stroke="#4f46e5" strokeWidth="1" />
    <circle cx="70" cy="50" r="6" fill="#818cf8" stroke="#4f46e5" strokeWidth="1" />

    {/* Blending multiple flowers along the branch */}
    <g transform="translate(85, 95) rotate(-15)">
      {/* Flower 1 */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * 360) / 5;
        return (
          <path
            key={i}
            d="M0 0 C-10 -25, 10 -25, 0 0 Z"
            fill="#6366f1"
            stroke="#4338ca"
            strokeWidth="0.75"
            transform={`rotate(${angle})`}
            opacity="0.95"
          />
        );
      })}
      <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
    </g>

    <g transform="translate(105, 130) rotate(10)">
      {/* Flower 2 */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * 360) / 5;
        return (
          <path
            key={i}
            d="M0 0 C-12 -28, 12 -28, 0 0 Z"
            fill="#4f46e5"
            stroke="#312e81"
            strokeWidth="0.75"
            transform={`rotate(${angle})`}
            opacity="0.95"
          />
        );
      })}
      <circle cx="0" cy="0" r="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
    </g>

    <g transform="translate(70, 78) rotate(-45)">
      {/* Flower 3 */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * 360) / 5;
        return (
          <path
            key={i}
            d="M0 0 C-8 -20, 8 -20, 0 0 Z"
            fill="#818cf8"
            stroke="#4f46e5"
            strokeWidth="0.75"
            transform={`rotate(${angle})`}
            opacity="0.95"
          />
        );
      })}
      <circle cx="0" cy="0" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
    </g>
  </svg>
);

// Flying Hawk on Cardboard / Etching
export const HawkIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 150" className={`w-36 h-28 opacity-80 mix-blend-darken select-none pointer-events-none ${className}`}>
    {/* Flying hawk line sketch */}
    {/* Body */}
    <path d="M90 65 Q100 70 110 65 Q100 80 90 65 Z" fill="#2c251e" stroke="#2c251e" strokeWidth="1" />
    {/* Tail */}
    <path d="M107 68 L130 85 L122 90 L103 72 Z" fill="none" stroke="#2c251e" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Feathers detail on tail */}
    <line x1="110" y1="73" x2="124" y2="84" stroke="#2c251e" strokeWidth="1" />
    <line x1="114" y1="76" x2="120" y2="87" stroke="#2c251e" strokeWidth="1" />

    {/* Left wing (pointing top-left) */}
    <path d="M92 66 C70 45, 40 30, 20 40 C35 50, 50 60, 88 68" fill="none" stroke="#2c251e" strokeWidth="2" strokeLinecap="round" />
    {/* Wing feathers left */}
    <path d="M20 40 C22 45, 30 52, 40 55 M30 45 C34 50, 44 56, 52 59 M42 50 C46 54, 58 61, 68 63" stroke="#2c251e" strokeWidth="1" fill="none" />

    {/* Right wing (pointing top-right) */}
    <path d="M106 66 C125 42, 155 24, 175 30 C162 42, 148 54, 110 67" fill="none" stroke="#2c251e" strokeWidth="2" strokeLinecap="round" />
    {/* Wing feathers right */}
    <path d="M175 30 C170 36, 160 45, 150 49 M165 36 C158 42, 146 50, 138 54 M152 42 C144 48, 130 56, 120 60" stroke="#2c251e" strokeWidth="1" fill="none" />

    {/* Head and beak */}
    <path d="M88 63 C85 62, 82 58, 85 55 C88 56, 91 60, 91 63 Z M82 55 Q78 57 81 59" stroke="#2c251e" strokeWidth="1.5" fill="none" />

    {/* Flight motion lines */}
    <path d="M15 30 Q10 32 8 36 M185 20 Q190 22 192 26" stroke="#4e3e31" strokeWidth="1" opacity="0.4" fill="none" />
  </svg>
);

// Vintage stamps and clippings
export const ScrapbookStamp: React.FC<{
  className?: string;
  text?: string;
  date?: string;
}> = ({ className = '', text = 'DIARY', date = '1926' }) => (
  <div
    className={`w-20 h-20 rounded-full border-2 border-dashed border-stone-600/40 flex flex-col items-center justify-center text-center opacity-45 select-none pointer-events-none rotate-12 ${className}`}
  >
    <div className="text-[9px] font-typewriter tracking-widest leading-none font-bold text-stone-700">{text}</div>
    <div className="w-12 h-[1px] bg-stone-600/30 my-1" />
    <div className="text-[10px] font-mono font-bold text-stone-700">{date}</div>
    <div className="text-[8px] uppercase tracking-wider text-stone-600">OFFICIAL</div>
  </div>
);

// An SVG Filter component placed once at the root
export const TornPaperFilters: React.FC = () => (
  <svg className="absolute w-0 h-0 pointer-events-none">
    <defs>
      {/* Heavy torn paper filter */}
      <filter id="torn-paper" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* Subtle torn tape filter */}
      <filter id="torn-paper-subtle" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);
