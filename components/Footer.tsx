import Image from "next/image";
import fotoFooter from "@/public/foto-footer.png";
import { profile, socials } from "@/data/site";
import LocalTime from "./LocalTime";

// Desktop: posisi persen di dalam "stage" = posisi di frame Figma "Footer 2" (1440x1024).
// Ukuran memakai unit --u (1 piksel Figma), lihat globals.css.
export default function Footer() {
    return (
        <footer id="contact" className="relative overflow-hidden bg-black px-4 pt-20 pb-8 text-white md:p-0">
            <div className="md:stage">
                <div className="text-center md:pt-[calc(121*var(--u))]">
                    <h2 className="font-heading text-[2.25rem] leading-[1.2] font-bold md:text-[calc(93*var(--u))]">
                        Let&rsquo;s Work Together
                    </h2>
                    <p className="mx-auto mt-3 max-w-[20rem] font-heading text-lg leading-[0.85] font-bold md:mt-0 md:max-w-[calc(795*var(--u))] md:text-[calc(40*var(--u))]">
                        Have a project in mind or just want to chat?
                    </p>
                </div>

                <div className="mt-12 flex flex-col items-center gap-10 md:contents">
                    <div className="text-center md:absolute md:top-[38.4%] md:left-[calc(50%-3*var(--u))] md:w-[calc(336*var(--u))] md:-translate-x-1/2">
                        <p className="font-paragraph text-lg font-bold md:text-[calc(30*var(--u))]">Open for collaboration</p>
                        <p className="font-paragraph text-sm md:text-[calc(22*var(--u))]">
                            {profile.location}, ID. <LocalTime />
                        </p>
                    </div>

                    <a
                        href={`mailto:${profile.email}`}
                        className="grid size-44 place-items-center rounded-full bg-yellow text-center font-heading text-[2.5rem] leading-[0.96] font-bold text-black transition-transform hover:scale-105 md:absolute md:top-[41.7%] md:left-[64.6%] md:size-[calc(379*var(--u))] md:text-[calc(96*var(--u))]"
                    >
                        <span>
                            Say <br /> Hello <br /> &rarr;
                        </span>
                    </a>

                    {/* Foto dalam bingkai lengkung putih, kepala sengaja keluar dari bingkai */}
                    <div className="relative h-64 w-52 md:absolute md:top-[31.05%] md:left-[9.03%] md:h-[calc(488*var(--u))] md:w-[calc(408*var(--u))]">
                        <div className="absolute inset-x-0 bottom-0 h-[68.3%] rounded-t-full rounded-b-xl bg-white md:rounded-b-[calc(20*var(--u))]" />
                        <Image
                            src={fotoFooter}
                            alt={`Foto ${profile.fullName}`}
                            sizes="(min-width: 768px) 25vw, 12rem"
                            className="absolute bottom-0 left-[7.45%] h-full w-[87.65%] object-cover object-bottom"
                        />
                    </div>
                </div>

                <div className="mt-16 flex flex-col-reverse items-center gap-4 font-paragraph text-sm md:absolute md:top-[87.7%] md:right-[9.1%] md:left-[7.36%] md:mt-0 md:flex-row md:justify-between md:text-[max(0.8rem,calc(22*var(--u)))]">
                    <p>&copy;{new Date().getFullYear()} {profile.nickname}. All rights reserved.</p>
                    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-[calc(23*var(--u))]">
                        {socials.map((s) => (
                            <li key={s.label}>
                                <a
                                    href={s.href}
                                    {...(s.href.startsWith("http") || s.href.endsWith(".pdf")
                                        ? { target: "_blank", rel: "noreferrer" }
                                        : {})}
                                    className="transition-colors hover:text-yellow"
                                >
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
