"use client";

import { Moon, Sun } from "./icons";

// Ganti tema terang/gelap. Tema awal & ikut-sistem diatur skrip di <head> (app/layout.tsx); tombol ini hanya
// membalik tema yang sedang tampil dan menyimpan pilihan. Ikon dipilih lewat CSS (varian dark:), jadi tidak
// perlu state dan tidak ada hydration mismatch.
function toggleTheme() {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
        html.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {}
    };
    // Transisi silang halus kalau browser mendukung dan pengguna tidak mematikan animasi
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(apply);
    } else {
        apply();
    }
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    return (
        <button type="button" onClick={toggleTheme} aria-label="Switch light/dark theme" title="Switch theme" className={className}>
            <Moon className="size-[1em] dark:hidden" />
            <Sun className="hidden size-[1em] dark:block" />
        </button>
    );
}
