import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "I Scream, You Scream — Request the Ice Cream Truck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #FFF9F5 0%, #F0FAFB 50%, #FFF5F8 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Truck SVG inline */}
        <svg viewBox="0 0 160 88" width={320} height={176} fill="none">
          <rect x="4" y="18" width="104" height="46" rx="5" fill="#FFFFFF" stroke="#3A2D1E" strokeWidth="2.5" />
          <path d="M4 48 Q17 42 30 48 T56 48 T82 48 T108 48 L108 64 L4 64 Z" fill="#6EC6CE" opacity="0.85" />
          <path d="M4 52 Q14 47 26 52 T50 52 T74 52 T98 52 T108 52 L108 64 L4 64 Z" fill="#6EC6CE" opacity="0.35" />
          <rect x="14" y="24" width="38" height="20" rx="3" fill="#E8F6F8" stroke="#3A2D1E" strokeWidth="1.5" />
          <rect x="16" y="26" width="34" height="16" rx="2" fill="#F0FAFB" />
          <rect x="12" y="43" width="42" height="3" rx="1.5" fill="#3A2D1E" opacity="0.6" />
          <rect x="60" y="24" width="16" height="12" rx="2" fill="#FFF0E8" stroke="#3A2D1E" strokeWidth="1" opacity="0.7" />
          <rect x="80" y="24" width="16" height="12" rx="2" fill="#E8F6F8" stroke="#3A2D1E" strokeWidth="1" opacity="0.7" />
          <path d="M108 30 L108 64 L148 64 L148 36 Q148 30 142 30 Z" fill="#FFFFFF" stroke="#3A2D1E" strokeWidth="2.5" />
          <path d="M116 34 L140 34 Q142 34 142 36 L142 48 L116 48 Z" fill="#B8E4F0" stroke="#3A2D1E" strokeWidth="1.5" />
          <path d="M120 36 L126 36 L120 46 Z" fill="#fff" opacity="0.4" />
          <rect x="36" y="12" width="28" height="8" rx="3" fill="#E8E4E0" stroke="#3A2D1E" strokeWidth="1.5" />
          <rect x="42" y="14" width="16" height="4" rx="1" fill="#D4DDE2" />
          <polygon points="72,26 82,26 77,42" fill="#D4A056" stroke="#3A2D1E" strokeWidth="1.2" />
          <ellipse cx="77" cy="24" rx="7" ry="5.5" fill="#F4A7BA" stroke="#3A2D1E" strokeWidth="1.2" />
          <ellipse cx="74" cy="22" rx="4.5" ry="4" fill="#E8729A" stroke="#3A2D1E" strokeWidth="0.8" />
          <ellipse cx="80" cy="22" rx="4" ry="3.5" fill="#FCD5DF" stroke="#3A2D1E" strokeWidth="0.8" />
          <path d="M74 21 Q77 18 80 21" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5" />
          <polygon points="24,25 28,25 26,31" fill="#D4A056" stroke="#3A2D1E" strokeWidth="0.8" />
          <circle cx="26" cy="24" r="3" fill="#F4A7BA" stroke="#3A2D1E" strokeWidth="0.8" />
          <circle cx="25" cy="23.5" r="0.8" fill="#fff" opacity="0.4" />
          <circle cx="30" cy="66" r="9" fill="#444" stroke="#3A2D1E" strokeWidth="2.5" />
          <circle cx="30" cy="66" r="4.5" fill="#888" />
          <circle cx="30" cy="66" r="1.5" fill="#bbb" />
          <circle cx="130" cy="66" r="9" fill="#444" stroke="#3A2D1E" strokeWidth="2.5" />
          <circle cx="130" cy="66" r="4.5" fill="#888" />
          <circle cx="130" cy="66" r="1.5" fill="#bbb" />
          <rect x="144" y="56" width="8" height="4" rx="2" fill="#ddd" stroke="#3A2D1E" strokeWidth="1" />
          <circle cx="150" cy="50" r="3" fill="#FFE566" stroke="#3A2D1E" strokeWidth="1" />
          <ellipse cx="80" cy="78" rx="68" ry="4" fill="#3A2D1E" opacity="0.06" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#E8729A",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            I Scream, You Scream
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#6B7C88",
              marginTop: 12,
            }}
          >
            Request the Ice Cream Man to cruise your street
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 20,
              background: "linear-gradient(90deg, #6EC6CE, #5BB8C0)",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              padding: "8px 28px",
              borderRadius: 50,
              textTransform: "uppercase" as const,
              letterSpacing: "2px",
            }}
          >
            Cedar City & Surrounding Areas
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
