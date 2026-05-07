import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Serv-Itz — Encontre Profissionais de Confiança em Imperatriz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #120630 0%, #05010a 60%, #0d0118 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple glow left */}
        <div
          style={{
            position: "absolute",
            left: -120,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(138,92,255,0.35) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Pink glow bottom right */}
        <div
          style={{
            position: "absolute",
            right: 200,
            bottom: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Purple glow behind icon area */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 120,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(138,92,255,0.4) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #8A5CFF 0%, #d946ef 100%)",
            display: "flex",
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 200,
            width: 4,
            height: 180,
            borderRadius: 2,
            background: "linear-gradient(180deg, #8A5CFF 0%, #d946ef 100%)",
            display: "flex",
          }}
        />

        {/* App icon box */}
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 165,
            width: 220,
            height: 220,
            borderRadius: 44,
            background: "#0d0520",
            border: "1.5px solid rgba(138,92,255,0.4)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.servitz.com.br/icons/icon-512x512.png"
            width={220}
            height={220}
            alt="Serv-Itz logo"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            position: "absolute",
            left: 116,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 40,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: -3,
              color: "white",
              lineHeight: 1,
              marginBottom: 16,
              display: "flex",
            }}
          >
            <span style={{ color: "#ffffff" }}>Serv-</span>
            <span style={{ color: "#8A5CFF" }}>Itz</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(177,140,255,0.85)",
              marginBottom: 20,
              display: "flex",
            }}
          >
            Conectando Imperatriz
          </div>

          {/* Divider */}
          <div
            style={{
              width: 480,
              height: 1.5,
              background: "rgba(138,92,255,0.25)",
              marginBottom: 24,
              display: "flex",
            }}
          />

          {/* Headline */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "white",
              marginBottom: 16,
              display: "flex",
            }}
          >
            Encontre Profissionais de Confiança
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              color: "rgba(200,190,230,0.65)",
              marginBottom: 40,
              display: "flex",
            }}
          >
            Profissionais verificados · Rápido · Seguro · Moderno
          </div>

          {/* Badges row */}
          <div style={{ display: "flex", gap: 16 }}>
            {/* URL badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 24,
                paddingRight: 24,
                height: 44,
                borderRadius: 22,
                background: "rgba(138,92,255,0.15)",
                border: "1px solid rgba(138,92,255,0.4)",
                fontSize: 18,
                fontWeight: 600,
                color: "#B18CFF",
              }}
            >
              www.servitz.com.br
            </div>

            {/* Pros badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 20,
                paddingRight: 20,
                height: 44,
                borderRadius: 22,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(52,211,153,0.9)",
              }}
            >
              500+ Pro&apos;s
            </div>

            {/* Rating badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 20,
                paddingRight: 20,
                height: 44,
                borderRadius: 22,
                background: "rgba(255,217,102,0.1)",
                border: "1px solid rgba(255,217,102,0.3)",
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(255,217,102,0.9)",
              }}
            >
              ⭐ 4.9 / 5.0
            </div>
          </div>
        </div>

        {/* Border frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid rgba(138,92,255,0.12)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
