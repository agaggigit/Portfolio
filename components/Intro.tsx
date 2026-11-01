"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Welcome intro sesuai frame Figma: logo -> "Welcome" -> tirai hitam naik dengan tepi bawah melengkung.
// Hanya diputar sekali per tab (sessionStorage), bisa di-skip dengan klik atau tombol apa saja.
export default function Intro() {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const html = document.documentElement;
            if (html.dataset.intro !== "play") return;

            const finish = () => {
                delete html.dataset.intro;
                try {
                    sessionStorage.setItem("intro-seen", "1");
                } catch {}
                window.dispatchEvent(new Event("intro:done"));
            };

            const tl = gsap.timeline({ onComplete: finish });
            tl.from("[data-intro-logo]", { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(1.6)" })
                .to("[data-intro-logo]", { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.35")
                .fromTo("[data-intro-welcome]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" })
                .to("[data-intro-welcome]", { opacity: 0, duration: 0.25 }, "+=0.35")
                .to("[data-intro-curtain]", { yPercent: -165, duration: 1, ease: "power3.inOut" }, "-=0.1")
                // Teks Hero ada di luar scope komponen ini, jadi dipilih langsung dari document
                .from(document.querySelectorAll("[data-hero-text]"), { y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.55");

            const skip = () => tl.progress(1);
            window.addEventListener("keydown", skip, { once: true });
            root.current?.addEventListener("click", skip, { once: true });
            return () => window.removeEventListener("keydown", skip);
        },
        { scope: root },
    );

    return (
        <div
            id="intro"
            ref={root}
            aria-hidden
            className="pointer-events-auto fixed inset-0 z-[60] items-center justify-center text-[#FFFAFF]"
        >
            <div data-intro-curtain className="absolute inset-0 bg-black">
                {/* Tepi bawah tirai yang melengkung (Ellipse 3 di Figma) */}
                <div className="absolute top-full left-1/2 h-[60svh] w-[174vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black" />
                <p className="absolute right-6 bottom-6 font-paragraph text-sm text-white/50">Click or press any key to skip</p>
            </div>
            <img
                data-intro-logo
                src="/logo-aga.svg"
                alt=""
                className="relative size-[max(6rem,calc(212*var(--u)))]"
            />
            <p data-intro-welcome className="absolute font-heading text-[max(2.5rem,calc(93*var(--u)))] font-bold opacity-0">
                Welcome
            </p>
        </div>
    );
}
