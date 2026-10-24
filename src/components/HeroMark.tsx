const steps = [
  { x: 92, y: 430 },
  { x: 180, y: 430 },
  { x: 180, y: 352 },
  { x: 286, y: 352 },
  { x: 286, y: 274 },
  { x: 392, y: 274 },
  { x: 392, y: 196 },
  { x: 498, y: 196 },
  { x: 498, y: 118 },
  { x: 590, y: 118 },
];

const markers = [steps[0], steps[2], steps[4], steps[6], steps[8], steps[9]];

const elevations = [118, 196, 274, 352, 430];

const path = steps.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

export function HeroMark() {
  return (
    <svg
      viewBox="0 0 680 520"
      className="h-auto w-full"
      role="img"
      aria-label="Abstract diagram of a baseline rising in steps toward a higher standard."
    >
      <title>Baseline rising toward a higher standard</title>
      <g className="hero-grid">
        {Array.from({ length: 16 }, (_, index) => (
          <line
            key={`v-${index}`}
            x1={40 + index * 40}
            y1="36"
            x2={40 + index * 40}
            y2="484"
            stroke="rgba(245,243,238,0.045)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 12 }, (_, index) => (
          <line
            key={`h-${index}`}
            x1="36"
            y1={40 + index * 40}
            x2="644"
            y2={40 + index * 40}
            stroke="rgba(245,243,238,0.045)"
            strokeWidth="1"
          />
        ))}
      </g>

      <g className="hero-frame" fill="none" stroke="#C9A227" strokeWidth="1.25">
        <path d="M36 78 V36 H78" />
        <path d="M602 36 H644 V78" />
        <path d="M36 442 V484 H78" />
        <path d="M602 484 H644 V442" />
      </g>

      <line x1="58" y1="118" x2="58" y2="430" stroke="rgba(201,162,39,0.45)" strokeWidth="1" />
      {elevations.map((y) => (
        <line key={y} x1="52" y1={y} x2="64" y2={y} stroke="#C9A227" strokeWidth="1" />
      ))}

      {elevations.slice(0, -1).map((y) => (
        <line key={`level-${y}`} x1="84" y1={y} x2="612" y2={y} stroke="rgba(245,243,238,0.14)" strokeWidth="1" />
      ))}

      <path className="hero-baseline" d="M84 430 H612" pathLength={1} fill="none" stroke="#C9A227" strokeWidth="1.5" />
      <path className="hero-ascent" d={path} pathLength={1} fill="none" stroke="#E0C15A" strokeWidth="1.5" />
      <path className="hero-flow" d={path} pathLength={1} fill="none" stroke="#FFF6C2" strokeWidth="2.4" />

      {markers.map((point, index) => (
        <rect
          key={`${point.x}-${point.y}-${index}`}
          className="hero-node"
          x={point.x - 5}
          y={point.y - 5}
          width="10"
          height="10"
          fill="#0B0B0D"
          stroke="#C9A227"
          strokeWidth="1.25"
        />
      ))}

      <text x="84" y="458" fill="#A5A5A5" fontSize="12" letterSpacing="3.2" fontFamily="Inter, Segoe UI, sans-serif">
        BASELINE
      </text>
      <text x="300" y="262" fill="#A5A5A5" fontSize="12" letterSpacing="3.2" fontFamily="Inter, Segoe UI, sans-serif">
        MOMENTUM
      </text>
      <text x="506" y="102" fill="#E0C15A" fontSize="12" letterSpacing="3.2" fontFamily="Inter, Segoe UI, sans-serif">
        STANDARD
      </text>
    </svg>
  );
}
