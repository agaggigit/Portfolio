import Image from "next/image";
import foto from "@/public/Foto.png";
import { profile, socials } from "@/data/site";
import LocalTime from "./LocalTime";
import Magnetic from "./Magnetic";

// Desktop: ukuran & posisi memakai unit --u (1 piksel Figma pada frame 1440x1024), lihat globals.css.
export default function Footer() {
    return (
        <footer id="contact" data-footer className="relative overflow-hidden bg-footer text-on-card">
            {/* Lengkungan abu-abu (sambungan dari Experience), frame Figma 128:181: tepi atas footer melengkung
                ~110 piksel Figma ke bawah di tengah. Saat animasi aktif lengkungan merata ketika footer sampai atas */}
            <svg
                aria-hidden
                data-footer-cap
                viewBox="0 0 1440 110"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-0 hidden h-[calc(110*var(--u))] w-full origin-top fill-surface md:block"
            >
                <path d="M0,0 H1440 Q720,220 0,0 Z" />
            </svg>
            <div className="md:stage">
                <div data-footer-title className="px-4 pt-20 text-center md:px-0 md:pt-[calc(92*var(--u))]">
                    <h2 className="font-heading text-[2.25rem] leading-[1.2] font-bold md:text-[calc(93*var(--u))]">
                        Let&rsquo;s Work Together
                    </h2>
                    <p className="mx-auto mt-3 max-w-[20rem] text-footer-muted font-heading text-lg leading-tight font-bold md:mt-0 md:max-w-none md:text-[calc(32*var(--u))]">
                        Have a project in mind or just want to chat?
                    </p>
                </div>

                <div data-footer-reveal className="mt-8 flex items-center justify-center gap-4 px-4 md:mt-[calc(38*var(--u))] md:gap-[calc(22*var(--u))] md:px-0">
                    {/* Foto profil: wajah & bahu di dalam lingkaran abu-abu */}
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-chip md:size-[calc(104*var(--u))]">
                        <Image
                            src={foto}
                            alt={`Foto ${profile.fullName}`}
                            sizes="(min-width: 768px) 10vw, 80px"
                            className="absolute top-[8%] left-1/2 h-auto w-[135%] max-w-none -translate-x-1/2"
                        />
                    </span>
                    <div>
                        <p className="font-paragraph text-lg leading-tight font-bold md:text-[calc(26*var(--u))]">Open for collaboration</p>
                        <p className="font-paragraph text-sm text-footer-muted md:text-[calc(19*var(--u))]">
                            {profile.location}, ID. <LocalTime />
                        </p>
                    </div>
                </div>

                <div className="relative mt-14 pb-8 md:static md:mt-0 md:pb-0">
                    {/* Lengkungan kuning. Lebarnya ikut layar supaya tetap menutup sisi kiri-kanan di layar yang sangat lebar */}
                    <div
                        aria-hidden
                        data-footer-rise
                        className="absolute top-0 left-1/2 h-[200%] w-[220vw] -translate-x-1/2 rounded-[50%] bg-cta md:top-[calc(640*var(--u))] md:h-[calc(1200*var(--u))] md:w-[max(calc(1960*var(--u)),136vw)]"
                    />

                    <div data-footer-rise className="relative flex justify-center pt-20 md:absolute md:top-[calc(722*var(--u))] md:left-1/2 md:block md:-translate-x-1/2 md:pt-0">
                        {/* Hover: bidang gelap naik dari bawah seperti kubah lalu mengisi pil, teks jadi kuning.
                            Padding pil diimbangi margin negatif supaya posisi teks sama seperti tanpa pil */}
                        <Magnetic>
                            <a
                                href={`mailto:${profile.email}`}
                                className="group relative -mx-[0.4em] -my-[0.14em] block overflow-hidden rounded-full px-[0.4em] py-[0.14em] font-heading text-[11vw] leading-none font-bold whitespace-nowrap text-ink md:text-[calc(116*var(--u))]"
                            >
                                <span
                                    aria-hidden
                                    className="absolute inset-0 translate-y-[101%] rounded-t-[50%] bg-ink transition-[translate,border-radius] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:rounded-t-none group-focus-visible:translate-y-0 group-focus-visible:rounded-t-none"
                                />
                                <span data-magnetic-inner className="relative inline-block transition-colors duration-300 group-hover:text-cta group-focus-visible:text-cta">
                                    Say Hello &rarr;
                                </span>
                            </a>
                        </Magnetic>
                    </div>

                    <div data-footer-rise className="relative mt-16 flex flex-col-reverse items-center gap-4 px-4 font-paragraph text-sm text-ink md:absolute md:top-[89%] md:right-[7.4%] md:left-[7.4%] md:mt-0 md:flex-row md:justify-between md:px-0 md:text-[max(0.8rem,calc(20*var(--u)))]">
                        <p>&copy;{new Date().getFullYear()} {profile.nickname}. All rights reserved.</p>
                        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-[calc(26*var(--u))]">
                            {socials.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        {...(s.href.startsWith("http") || s.href.endsWith(".pdf")
                                            ? { target: "_blank", rel: "noreferrer" }
                                            : {})}
                                        className="hover:underline"
                                    >
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
