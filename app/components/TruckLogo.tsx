interface TruckLogoProps {
  size?: number;
  color?: string;
}

export default function TruckLogo({ size = 90, color = "#E84B3A" }: TruckLogoProps) {
  const h = (size * 52) / 120;

  return (
    <svg
      viewBox="0 0 120 52"
      width={size}
      height={h}
      fill="none"
      className="drop-shadow-sm"
    >
      {/* Main body */}
      <rect
        x="2"
        y="8"
        width="80"
        height="32"
        rx="4"
        fill="#F9F4EE"
        stroke="#3A2D1E"
        strokeWidth="2"
      />

      {/* Cabin */}
      <rect
        x="82"
        y="16"
        width="30"
        height="24"
        rx="3"
        fill={color}
        stroke="#3A2D1E"
        strokeWidth="2"
      />

      {/* Window */}
      <rect x="88" y="20" width="18" height="10" rx="2" fill="#B8E4F9" />

      {/* Ice cream display windows */}
      <rect x="8" y="12" width="12" height="14" rx="2" fill="#FFD93D" />
      <rect x="24" y="12" width="12" height="14" rx="2" fill="#FF8FAB" />
      <rect x="40" y="12" width="12" height="14" rx="2" fill="#8FD8A8" />
      <rect x="56" y="12" width="12" height="14" rx="2" fill="#B8E4F9" />

      {/* Text */}
      <text
        x="18"
        y="36"
        fontSize="7"
        fill="#3A2D1E"
        fontWeight="bold"
        textAnchor="middle"
      >
        ICE
      </text>
      <text
        x="44"
        y="36"
        fontSize="7"
        fill="#3A2D1E"
        fontWeight="bold"
        textAnchor="middle"
      >
        CREAM
      </text>

      {/* Wheels */}
      <circle cx="24" cy="44" r="6" fill="#555" stroke="#3A2D1E" strokeWidth="2" />
      <circle cx="24" cy="44" r="2.5" fill="#999" />
      <circle cx="94" cy="44" r="6" fill="#555" stroke="#3A2D1E" strokeWidth="2" />
      <circle cx="94" cy="44" r="2.5" fill="#999" />

      {/* Roof/Flag */}
      <polygon points="38,8 44,8 41,1" fill="#FFD93D" stroke="#3A2D1E" strokeWidth="1" />
      <circle
        cx="41"
        cy="1"
        r="4"
        fill="#FF8FAB"
        stroke="#3A2D1E"
        strokeWidth="1"
      />
    </svg>
  );
}
