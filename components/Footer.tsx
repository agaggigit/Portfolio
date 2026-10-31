import Image from "next/image";
import fotoFooter from "@/public/foto-footer.png";
import { profile, socials } from "@/data/site";
import LocalTime from "./LocalTime";

// Desktop: posisi mengikuti frame Figma "Footer 2" (1440x1024) dalam persen/vw.
export default function Footer() {
    return (
        <footer id="contact" className="relative overflow-hidden bg-black px-4 pt-20 pb-8 text-white md:h-[71.11vw] md:p-0">
            <div className="text-center md:pt-[8.4vw]">
                <h2 className="font-heading text-[clamp(2.25rem,6.46vw,6rem)] leading-[1.2] font-bold">
                    Let&rsquo;s Work Together
                </h2>
                <p className="mx-auto mt-3 max-w-[55.2vw] min-w-[16rem] font-heading md:mt-0 text-[clamp(1.125rem,2.78vw,2.5rem)] leading-[0.85] font-bold">
                    Have a project in mind or just want to chat?
                </p>
            </div>

            <div className="mt-12 flex flex-col items-center gap-10 md:contents">
                <div className="text-center md:absolute md:top-[38.4%] md:left-[calc(50%-3px)] md:w-[23.3vw] md:-translate-x-1/2">
                    <p className="font-paragraph text-[clamp(1.125rem,2.08vw,1.9rem)] font-bold">Open for collaboration</p>
                    <p className="font-paragraph text-[clamp(0.875rem,1.53vw,1.4rem)]">
                        {profile.location}, ID. <LocalTime />
                    </p>
                </div>

                <a
                    href={`mailto:${profile.email}`}
                    className="grid size-[clamp(11rem,26.3vw,24rem)] place-items-center rounded-full bg-yellow text-center font-heading text-[clamp(2.5rem,6.67vw,6rem)] leading-[0.96] font-bold text-black transition-transform hover:scale-105 md:absolute md:top-[41.7%] md:left-[64.6%]"
                >
                    <span>
                        Say <br /> Hello <br /> &rarr;
                    </span>
                </a>

                {/* Foto dalam bingkai lengkung putih, kepala sengaja keluar dari bingkai */}
                <div className="relative h-[clamp(16rem,33.9vw,30.5rem)] w-[clamp(13rem,28.3vw,25.5rem)] md:absolute md:top-[31.05%] md:left-[9.03%]">
                    <div className="absolute inset-x-0 bottom-0 h-[68.3%] rounded-t-full rounded-b-[clamp(0.75rem,1.39vw,1.25rem)] bg-white" />
                    <Image
                        src={fotoFooter}
                        alt={`Foto ${profile.fullName}`}
                        sizes="(min-width: 768px) 25vw, 12rem"
                        className="absolute bottom-0 left-[7.45%] h-full w-[87.65%] object-cover object-bottom"
                    />
                </div>
            </div>

            <div className="mt-16 flex flex-col-reverse items-center gap-4 font-paragraph text-[clamp(0.875rem,1.53vw,1.4rem)] md:absolute md:top-[87.7%] md:right-[9.1%] md:left-[7.36%] md:mt-0 md:flex-row md:justify-between">
                <p>&copy;{new Date().getFullYear()} {profile.nickname}. All rights reserved.</p>
                <ul className="flex flex-wrap justify-center gap-x-[1.6vw] gap-y-2 max-md:gap-x-5">
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
        </footer>
    );
}
