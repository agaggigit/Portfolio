"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { whenMouse } from "@/lib/mouse";

// Efek magnetik (seperti Dennis Snellenberg): selama kursor di atas elemen, elemen tertarik ke arah kursor,
// lalu memantul balik saat ditinggal. Anak dengan atribut data-magnetic-inner ikut tertarik lebih jauh,
// jadi isi terasa "lebih ringan" dari wadahnya.
// Aktif setelah gerakan mouse/trackpad pertama (lib/mouse; media query tidak bisa diandalkan di laptop layar sentuh)
// dan kalau pengguna tidak mematikan animasi.

const PULL = 0.35; // bagian dari jarak kursor ke tengah elemen yang diikuti wadah
const INNER_PULL = 0.45; // sama, untuk isi (data-magnetic-inner); selisihnya dengan PULL = seberapa jauh isi bergeser di dalam wadah

export default function Magnetic({
    children,
    className = "",
    strength = 1,
}: {
    children: React.ReactNode;
    className?: string;
    /** Pengali tarikan; < 1 untuk elemen kecil supaya tidak terlalu jauh berpindah */
    strength?: number;
}) {
    const zone = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const el = zone.current;
            if (!el) return;
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () =>
                whenMouse(() => {
                    const inner = el.querySelectorAll<HTMLElement | SVGElement>("[data-magnetic-inner]");
                    const follow = { duration: 0.6, ease: "power3.out" };
                    const outerX = gsap.quickTo(el, "x", follow);
                    const outerY = gsap.quickTo(el, "y", follow);
                    const innerX = inner.length ? gsap.quickTo(inner, "x", follow) : null;
                    const innerY = inner.length ? gsap.quickTo(inner, "y", follow) : null;

                    const followers = [outerX, outerY, innerX, innerY].filter((f) => f !== null);
                    let back: gsap.core.Tween[] = [];

                    const onMove = (e: PointerEvent) => {
                        back.forEach((t) => t.kill()); // batalkan pantulan balik kalau kursor kembali
                        // Ukuran tanpa transform yang sedang berjalan, supaya tarikan tidak "mengejar" dirinya sendiri
                        const r = el.getBoundingClientRect();
                        const cx = r.left + r.width / 2 - (gsap.getProperty(el, "x") as number);
                        const cy = r.top + r.height / 2 - (gsap.getProperty(el, "y") as number);
                        const dx = e.clientX - cx;
                        const dy = e.clientY - cy;
                        outerX(dx * PULL * strength);
                        outerY(dy * PULL * strength);
                        innerX?.(dx * (INNER_PULL - PULL) * strength);
                        innerY?.(dy * (INNER_PULL - PULL) * strength);
                    };
                    const onLeave = () => {
                        // Hentikan gerak mengikuti kursor, lalu pantulkan balik ke tempat semula
                        followers.forEach((f) => f.tween.pause());
                        const home = { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" };
                        back = [gsap.to(el, home), ...(inner.length ? [gsap.to(inner, home)] : [])];
                    };
                    el.addEventListener("pointermove", onMove);
                    el.addEventListener("pointerleave", onLeave);
                    return () => {
                        el.removeEventListener("pointermove", onMove);
                        el.removeEventListener("pointerleave", onLeave);
                    };
                }),
            );
            return () => mm.revert();
        },
        { scope: zone },
    );

    return (
        <span ref={zone} className={`inline-block ${className}`}>
            {children}
        </span>
    );
}
