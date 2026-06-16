interface TruckLogoProps {
  size?: number;
  className?: string;
  muted?: boolean;
}

export default function TruckLogo({ size = 120, className = "", muted = false }: TruckLogoProps) {
  const w = size;
  const h = (size * 88) / 160;
  const aqua = muted ? "#C8D8DC" : "#6EC6CE";
  const pink = muted ? "#D8C8CC" : "#F4A7BA";
  const darkPink = muted ? "#C0B0B4" : "#E8729A";
  const cone = muted ? "#C8BEB0" : "#D4A056";
  const body = muted ? "#E8E4E0" : "#FFFFFF";
  const trim = muted ? "#B0AAA0" : "#3A2D1E";

  return (
    <svg viewBox="0 0 160 88" width={w} height={h} fill="none" className={className}>
      {/* --- Truck body --- */}
      <rect x="4" y="18" width="104" height="46" rx="5" fill={body} stroke={trim} strokeWidth="2.5" />

      {/* Aqua wave band across lower body */}
      <path
        d="M4 48 Q17 42 30 48 T56 48 T82 48 T108 48 L108 64 L4 64 Z"
        fill={aqua}
        opacity={muted ? 0.4 : 0.85}
      />
      <path
        d="M4 52 Q14 47 26 52 T50 52 T74 52 T98 52 T108 52 L108 64 L4 64 Z"
        fill={aqua}
        opacity={muted ? 0.2 : 0.35}
      />

      {/* Serving window */}
      <rect x="14" y="24" width="38" height="20" rx="3" fill="#E8F6F8" stroke={trim} strokeWidth="1.5" />
      <rect x="16" y="26" width="34" height="16" rx="2" fill={muted ? "#F0EEEC" : "#F0FAFB"} />
      {/* Window shelf */}
      <rect x="12" y="43" width="42" height="3" rx="1.5" fill={trim} opacity="0.6" />

      {/* Side panel decorative squares (menu board) */}
      <rect x="60" y="24" width="16" height="12" rx="2" fill={muted ? "#E0DCD8" : "#FFF0E8"} stroke={trim} strokeWidth="1" opacity="0.7" />
      <rect x="80" y="24" width="16" height="12" rx="2" fill={muted ? "#E0DCD8" : "#E8F6F8"} stroke={trim} strokeWidth="1" opacity="0.7" />

      {/* --- Cabin --- */}
      <path
        d="M108 30 L108 64 L148 64 L148 36 Q148 30 142 30 Z"
        fill={body}
        stroke={trim}
        strokeWidth="2.5"
      />
      {/* Cabin windshield */}
      <path
        d="M116 34 L140 34 Q142 34 142 36 L142 48 L116 48 Z"
        fill={muted ? "#D4DDE2" : "#B8E4F0"}
        stroke={trim}
        strokeWidth="1.5"
      />
      {/* Windshield glare */}
      {!muted && <path d="M120 36 L126 36 L120 46 Z" fill="#fff" opacity="0.4" />}

      {/* --- AC unit on roof --- */}
      <rect x="36" y="12" width="28" height="8" rx="3" fill="#E8E4E0" stroke={trim} strokeWidth="1.5" />
      <rect x="42" y="14" width="16" height="4" rx="1" fill="#D4DDE2" />

      {/* --- Big ice cream cone (right side of body) --- */}
      {/* Cone */}
      <polygon points="72,26 82,26 77,42" fill={cone} stroke={trim} strokeWidth="1.2" />
      {/* Waffle pattern */}
      <line x1="74" y1="30" x2="80" y2="30" stroke={trim} strokeWidth="0.6" opacity="0.3" />
      <line x1="74.5" y1="33" x2="79.5" y2="33" stroke={trim} strokeWidth="0.6" opacity="0.3" />
      <line x1="75" y1="30" x2="78" y2="38" stroke={trim} strokeWidth="0.5" opacity="0.2" />
      <line x1="79" y1="30" x2="76" y2="38" stroke={trim} strokeWidth="0.5" opacity="0.2" />
      {/* Ice cream scoops */}
      <ellipse cx="77" cy="24" rx="7" ry="5.5" fill={pink} stroke={trim} strokeWidth="1.2" />
      <ellipse cx="74" cy="22" rx="4.5" ry="4" fill={darkPink} stroke={trim} strokeWidth="0.8" />
      <ellipse cx="80" cy="22" rx="4" ry="3.5" fill="#FCD5DF" stroke={trim} strokeWidth="0.8" />
      {/* Swirl highlight */}
      {!muted && <path d="M74 21 Q77 18 80 21" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5" />}

      {/* --- Small ice cream cone (near serving window) --- */}
      <polygon points="24,25 28,25 26,31" fill={cone} stroke={trim} strokeWidth="0.8" />
      <circle cx="26" cy="24" r="3" fill={pink} stroke={trim} strokeWidth="0.8" />
      {!muted && <circle cx="25" cy="23.5" r="0.8" fill="#fff" opacity="0.4" />}

      {/* --- Wheels --- */}
      <circle cx="30" cy="66" r="9" fill="#444" stroke={trim} strokeWidth="2.5" />
      <circle cx="30" cy="66" r="4.5" fill="#888" />
      <circle cx="30" cy="66" r="1.5" fill="#bbb" />

      <circle cx="130" cy="66" r="9" fill="#444" stroke={trim} strokeWidth="2.5" />
      <circle cx="130" cy="66" r="4.5" fill="#888" />
      <circle cx="130" cy="66" r="1.5" fill="#bbb" />

      {/* --- Bumper --- */}
      <rect x="144" y="56" width="8" height="4" rx="2" fill="#ddd" stroke={trim} strokeWidth="1" />

      {/* --- Headlight --- */}
      <circle cx="150" cy="50" r="3" fill={muted ? "#D4D0CC" : "#FFE566"} stroke={trim} strokeWidth="1" />

      {/* Ground shadow */}
      <ellipse cx="80" cy="78" rx="68" ry="4" fill="#3A2D1E" opacity="0.06" />
    </svg>
  );
}
