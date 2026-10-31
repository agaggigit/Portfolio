import { ImageResponse } from "next/og";
import { profile } from "@/data/site";

// Gambar preview saat link dibagikan (LinkedIn, WhatsApp, dll.)
export const alt = `${profile.nickname} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#E7E7E7",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", fontSize: 140, fontWeight: 700, color: "#010400" }}>
          Hi, I&rsquo;m&nbsp;<span style={{ color: "#3C6997" }}>{profile.nickname}</span>
        </div>
        <div style={{ fontSize: 40, color: "#010400", marginTop: 12 }}>{profile.fullName}</div>
        <div style={{ fontSize: 28, color: "#555", marginTop: 8 }}>{profile.role}</div>
        <div
          style={{
            position: "absolute",
            bottom: -260,
            width: 900,
            height: 400,
            borderRadius: "50%",
            background: "#A5A5A5",
          }}
        />
      </div>
    ),
    size,
  );
}
