import { ImageResponse } from "next/og";

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
          background: "#FFF9F5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, marginBottom: 16 }}>
          🍦
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
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
            display: "flex",
            fontSize: 32,
            color: "#6B7C88",
            marginTop: 16,
          }}
        >
          Request the Ice Cream Man to cruise your street
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 24,
            background: "#6EC6CE",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            padding: "10px 32px",
            borderRadius: 50,
            letterSpacing: "2px",
          }}
        >
          CEDAR CITY &amp; SURROUNDING AREAS
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 30,
            fontSize: 18,
            color: "#B0BEC5",
          }}
        >
          cedarcitywebdesign.com
        </div>
      </div>
    ),
    { ...size }
  );
}
