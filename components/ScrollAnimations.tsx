"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Semua animasi scroll ada di sini, elemen dipilih lewat atribut data-* di tiap section.
// Hanya aktif di desktop dan kalau pengguna tidak mematikan animasi (prefers-reduced-motion).
export default function ScrollAnimations() {
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
            // 1. Hero -> About: Hero ditahan, tonjolan abu-abu membesar sampai menutupi layar
            const hero = document.querySelector<HTMLElement>("[data-hero]");
            const dome = document.querySelector<HTMLElement>("[data-hero-dome]");
            if (hero && dome) {
                // Skala minimal supaya elips (pusatnya di bawah layar) menutupi seluruh layar
                const coverScale = () => {
                    const a = dome.offsetWidth / 2;
                    const b = dome.offsetHeight / 2;
                    const dx = window.innerWidth / 2;
                    const dy = window.innerHeight + b * 0.26;
                    return Math.sqrt((dx / a) ** 2 + (dy / b) ** 2) * 1.05;
                };

                // Beri tahu Navbar kapan layar sudah tertutup abu-abu (pill diganti tombol hamburger)
                let covered = false;
                const reportCovered = (progress: number) => {
                    if (progress > 0.55 === covered) return;
                    covered = !covered;
                    window.dispatchEvent(new CustomEvent("hero:covered", { detail: covered }));
                };

                gsap.timeline({
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "+=80%",
                        pin: true,
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => reportCovered(self.progress),
                    },
                })
                    .to("[data-hero-content]", { y: () => -window.innerHeight * 0.45, opacity: 0, ease: "power1.in" }, 0)
                    .to(dome, { scale: coverScale, ease: "power1.in" }, 0);
            }

            // 2. About: judul "About Me" mulai di tengah layar lalu naik ke posisinya, isi muncul bertahap
            const about = document.querySelector<HTMLElement>("[data-about]");
            const title = document.querySelector<HTMLElement>("[data-about-title]");
            if (about && title) {
                const toCenter = () => window.innerHeight / 2 - (title.offsetTop + title.offsetHeight / 2);

                gsap.timeline({
                    scrollTrigger: { trigger: about, start: "top top", end: "+=110%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
                })
                    .from(title, { y: toCenter, scale: 1.15, duration: 1, ease: "power2.inOut" }, 0)
                    .from("[data-about-badge]", { xPercent: -110, duration: 0.6 }, 0.4)
                    .from("[data-about-text]", { y: 40, opacity: 0, duration: 0.6 }, 0.6)
                    .from("[data-about-photo]", { yPercent: 70, opacity: 0, duration: 0.9, ease: "power2.out" }, 0.7)
                    .from("[data-about-col]", { y: 50, opacity: 0, stagger: 0.15, duration: 0.6 }, 0.9)
                    .from("[data-about-name]", { y: 60, opacity: 0, duration: 0.6 }, 1.2)
                    // Jeda sebentar di akhir supaya isi About sempat terbaca sebelum lanjut scroll
                    .to({}, { duration: 0.4 });
            }
        });

        // Posisi pin dihitung ulang setelah intro selesai (scroll sebelumnya dikunci)
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("intro:done", refresh);
        return () => {
            window.removeEventListener("intro:done", refresh);
            mm.revert();
        };
    });

    return null;
}
