import { ImageResponse } from "next/og";
import { profile } from "@/data/site";

// Gambar preview saat link dibagikan (LinkedIn, WhatsApp, dll.).
// Gambar statis hanya bisa satu tema, jadi memakai warna tema gelap dari globals.css (ditulis langsung karena
// ImageResponse tidak membaca CSS). Lengkungan kuning di bawah meniru footer.
export const alt = `${profile.nickname} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  page: "#0B0B0B",
  fg: "#DCD9D1",
  fgMuted: "#A9A69E",
  accent: "#E0B457",
};

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
          paddingBottom: 90,
          background: colors.page,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", fontSize: 140, fontWeight: 700, color: colors.fg }}>
          Hi, I&rsquo;m&nbsp;<span style={{ color: colors.accent }}>{profile.nickname}</span>
        </div>
        <div style={{ fontSize: 40, color: colors.fg, marginTop: 12 }}>{profile.fullName}</div>
        <div style={{ fontSize: 28, color: colors.fgMuted, marginTop: 8 }}>{profile.role}</div>
        <div
          style={{
            position: "absolute",
            bottom: -330,
            width: 1700,
            height: 460,
            borderRadius: "50%",
            background: colors.accent,
          }}
        />
      </div>
    ),
    size,
  );
}
