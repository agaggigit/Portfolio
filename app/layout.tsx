import type { Metadata } from "next";
import { syne, inter } from "./fonts";
import { profile, siteUrl } from "@/data/site";
import Intro from "@/components/Intro";
import ScrollAnimations from "@/components/ScrollAnimations";
import "lenis/dist/lenis.css";
import "./globals.css";

const description = `${profile.fullName} (${profile.nickname}) — ${profile.role}. Software engineering, data, and machine learning projects.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.nickname} — ${profile.fullName}`,
    template: `%s | ${profile.nickname}`,
  },
  description,
  authors: [{ name: profile.fullName, url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${profile.nickname} — Portfolio`,
    description,
    siteName: `${profile.nickname}'s Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.nickname} — Portfolio`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} h-full antialiased motion-safe:scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Jalan sebelum halaman tampil: tandai kalau intro perlu diputar, supaya Hero tidak sempat "flash" */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="play"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white" suppressHydrationWarning>
        <Intro />
        {children}
        <ScrollAnimations />
      </body>
    </html>
  );
}
