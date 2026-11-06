import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/site";

// Gambar preview saat link dibagikan (LinkedIn, WhatsApp, dll.). Digambar dari kode ini, bukan screenshot halaman.
// Gambar statis hanya bisa satu tema, jadi memakai warna tema gelap dari globals.css (ditulis langsung karena
// ImageResponse tidak membaca CSS). Font sama dengan web: Syne untuk judul, DM Sans untuk teks (assets/fonts).
// Foto diambil dari public/Foto.png, jadi ikut berganti kalau foto di About diganti.
export const alt = `${profile.nickname} — ${profile.fullName}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  page: "#0B0B0B",
  fg: "#DCD9D1",
  muted: "#A9A69E",
  accent: "#E0B457",
};

// Ukuran asli public/Foto.png
const PHOTO = { width: 668, height: 728 };

export default async function Image() {
  const fonts = join(process.cwd(), "assets/fonts");
  const [syne, dmSans, dmSansSemi, photo] = await Promise.all([
    readFile(join(fonts, "Syne-Bold.woff")),
    readFile(join(fonts, "DMSans-Regular.woff")),
    readFile(join(fonts, "DMSans-SemiBold.woff")),
    readFile(join(process.cwd(), "public/Foto.png")),
  ]);
  const photoHeight = 560;
  const photoWidth = Math.round((photoHeight * PHOTO.width) / PHOTO.height);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: colors.page,
          fontFamily: "DM Sans",
        }}
      >
        {/* Foto berdiri di depan lingkaran kuning di kanan */}
        <div style={{ position: "absolute", right: -70, top: 120, width: 600, height: 600, borderRadius: 600, background: colors.accent, display: "flex" }} />
        {/* ImageResponse hanya mengenal <img> biasa, next/image tidak bisa dipakai di sini */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={`data:image/png;base64,${photo.toString("base64")}`}
          width={photoWidth}
          height={photoHeight}
          style={{ position: "absolute", right: 0, bottom: -10 }}
        />

        <div style={{ display: "flex", flexDirection: "column", padding: "64px 0 0 72px", width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: colors.muted, letterSpacing: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: colors.accent }} />
            {`PORTFOLIO · ${new Date().getFullYear()}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40, fontFamily: "Syne", fontWeight: 700, fontSize: 124, lineHeight: 0.95, color: colors.fg }}>
            <span>Hi, I&rsquo;m</span>
            <span style={{ color: colors.accent }}>{`${profile.nickname}.`}</span>
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 30, fontWeight: 600, color: colors.fg }}>{profile.fullName}</div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 24, color: colors.muted, maxWidth: 560 }}>{profile.role}</div>
        </div>

        <div style={{ position: "absolute", left: 72, bottom: 48, display: "flex", fontSize: 22, color: colors.muted }}>
          {`${profile.location}, ID · Open for collaboration`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Syne", data: syne, weight: 700, style: "normal" },
        { name: "DM Sans", data: dmSans, weight: 400, style: "normal" },
        { name: "DM Sans", data: dmSansSemi, weight: 600, style: "normal" },
      ],
    },
  );
}
