"use client";

import { Moon, Sun } from "./icons";
import Magnetic from "./Magnetic";

// Ganti tema terang/gelap. Tema awal & ikut-sistem diatur skrip di <head> (app/layout.tsx); tombol ini hanya
// membalik tema yang sedang tampil dan menyimpan pilihan. Ikon dipilih lewat CSS (varian dark:), jadi tidak
// perlu state dan tidak ada hydration mismatch.
// Animasi: tema baru menyebar sebagai lingkaran dari tengah tombol yang diklik sampai menutup layar
// (View Transitions API; gaya dasarnya di globals.css bagian "Ganti tema").
function toggleTheme(button: HTMLElement) {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
        html.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {}
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();

    const b = button.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
        html.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 700, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        );
    });
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    return (
        <button type="button" onClick={(e) => toggleTheme(e.currentTarget)} aria-label="Switch light/dark theme" title="Switch theme" className={className}>
            {/* Magnetik; padding + margin negatif memperbesar area tarik tanpa mengubah tata letak */}
            <Magnetic className="-m-[0.6em] p-[0.6em]" strength={0.5}>
                <Moon className="size-[1em] dark:hidden" />
                <Sun className="hidden size-[1em] dark:block" />
            </Magnetic>
        </button>
    );
}
