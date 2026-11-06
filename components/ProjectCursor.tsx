"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { whenMouse } from "@/lib/mouse";

// Label kursor di atas kartu project yang punya link (elemen [data-project-link], lihat Projects):
// nama project + tujuan link yang sebenarnya (domain), jadi jelas klik ini membuka apa.
// - Mengikuti kursor dengan sedikit telat.
// - Saat scroll memutar roda ke project lain, label TIDAK hilang di celah antar panel: label lama bertahan,
//   lalu langsung berganti begitu kartu project berikutnya ada di bawah kursor. Label baru hilang kalau
//   kursor sengaja digerakkan keluar dari kartu, atau roda sudah sampai About/Experience.
// Aktif setelah gerakan mouse/trackpad pertama (lib/mouse) dan kalau animasi tidak dimatikan.
export default function ProjectCursor() {
    const bubble = useRef<HTMLDivElement>(null);
    const label = useRef<HTMLSpanElement>(null);
    const nameEl = useRef<HTMLSpanElement>(null);
    const hostEl = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const el = bubble.current;
        if (!el) return;
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () =>
            whenMouse(() => {
                gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
                // Kursor asli disembunyikan di atas kartu selama label ini aktif (globals.css)
                document.documentElement.dataset.viewCursor = "on";
                const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
                const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
                let shown = false;
                let current: Element | null = null;
                let last: { x: number; y: number } | null = null;

                const show = (link: HTMLElement) => {
                    if (link !== current) {
                        current = link;
                        if (nameEl.current) nameEl.current.textContent = link.dataset.projectName ?? "";
                        if (hostEl.current) hostEl.current.textContent = link.dataset.projectHost ?? "";
                        // Ganti project saat label sudah tampil: isi baru naik cepat, tanda bahwa tujuannya berubah
                        if (shown) gsap.fromTo(label.current, { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out", overwrite: true });
                    }
                    if (shown) return;
                    shown = true;
                    gsap.to(el, { scale: 1, duration: 0.5, ease: "back.out(1.7)", overwrite: "auto" });
                };
                const hide = () => {
                    if (!shown) return;
                    shown = false;
                    current = null;
                    gsap.to(el, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
                };
                // fromScroll: kursor diam, yang bergerak halamannya
                // Kartu yang masih berputar sengaja tidak menerima pointer (pointer-events: none, lihat ScrollAnimations),
                // jadi elementFromPoint tidak melihatnya. Cari juga lewat posisi di layar, supaya label sudah berganti
                // begitu kartu baru masuk ke bawah kursor; kalau bertumpuk, ambil muka yang paling dekat ke tengah roda.
                const linkAt = (x: number, y: number, hit: Element | null) => {
                    const direct = hit?.closest<HTMLElement>("[data-project-link]");
                    if (direct) return direct;
                    let best: HTMLElement | null = null;
                    let bestZ = -Infinity;
                    document.querySelectorAll<HTMLElement>("[data-project-link]").forEach((link) => {
                        const face = link.closest<HTMLElement>("[data-drum-face]");
                        if (face?.style.visibility === "hidden") return;
                        const r = link.getBoundingClientRect();
                        if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;
                        // z-index muka = 1000 - sudutnya (ScrollAnimations). Muka yang sudah berguling jauh (> 45°) punya kotak
                        // proyeksi yang sangat besar dan menipu, jadi diabaikan
                        const z = face ? Number(face.style.zIndex) || 0 : 1000;
                        if (face && z < 1000 - 45) return;
                        if (z > bestZ) [best, bestZ] = [link, z];
                    });
                    return best;
                };
                const check = (x: number, y: number, fromScroll: boolean) => {
                    const hit = document.elementFromPoint(x, y);
                    // About/Experience di depan: bukan project, sembunyikan
                    if (hit?.closest("[data-about], [data-exp]")) return hide();
                    const link = linkAt(x, y, hit);
                    if (link) return show(link);
                    // Di tengah putaran antar project (masih di drum, belum sampai About/Experience): pertahankan label lama
                    if (fromScroll && hit?.closest("[data-drum]") && !hit.closest("[data-about], [data-exp]")) return;
                    hide();
                };
                const onMove = (e: PointerEvent) => {
                    // Selama tersembunyi label langsung menempel ke kursor, jadi saat muncul tidak meluncur dari jauh
                    if (!shown) gsap.set(el, { x: e.clientX, y: e.clientY });
                    moveX(e.clientX);
                    moveY(e.clientY);
                    last = { x: e.clientX, y: e.clientY };
                    check(e.clientX, e.clientY, false);
                };
                // Saat scroll, panel bergerak di bawah kursor yang diam (tanpa pointermove), jadi dicek ulang
                const onScroll = () => last && check(last.x, last.y, true);
                window.addEventListener("pointermove", onMove);
                window.addEventListener("scroll", onScroll, { passive: true });
                return () => {
                    delete document.documentElement.dataset.viewCursor;
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("scroll", onScroll);
                };
            }),
        );
        return () => mm.revert();
    });

    return (
        <div
            ref={bubble}
            aria-hidden
            style={{ transform: "scale(0)" }}
            className="pointer-events-none fixed top-0 left-0 z-[3000] hidden overflow-hidden rounded-full bg-cta px-[1.3em] py-[0.75em] text-ink md:block"
        >
            <span ref={label} className="flex flex-col items-center whitespace-nowrap">
                <span ref={nameEl} className="font-heading text-[max(1rem,calc(24*var(--u)))] leading-tight font-bold" />
                <span className="font-paragraph text-[max(0.75rem,calc(15*var(--u)))] leading-tight">
                    <span ref={hostEl} /> &#8599;
                </span>
            </span>
        </div>
    );
}
