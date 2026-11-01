"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/site";
import { Close } from "./icons";

const links = [
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
];

const menuLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    // Pill di atas hanya tampil selama Hero terlihat, setelah itu diganti tombol hamburger
    const [atHero, setAtHero] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hero = document.getElementById("home");
        if (!hero) return;
        const observer = new IntersectionObserver(([entry]) => setAtHero(entry.isIntersecting), {
            threshold: 0.4,
        });
        observer.observe(hero);
        // Saat Hero di-pin oleh animasi scroll, ia tetap "terlihat", jadi ScrollAnimations memberi sinyal sendiri
        const onCovered = (e: Event) => setAtHero(!(e as CustomEvent<boolean>).detail);
        window.addEventListener("hero:covered", onCovered);
        return () => {
            observer.disconnect();
            window.removeEventListener("hero:covered", onCovered);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <header
                className={`fixed top-[calc(28*var(--u))] left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-300 md:block ${
                    atHero ? "opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
                }`}
            >
                <nav aria-label="Main" className="flex h-[max(2.75rem,calc(58*var(--u)))] w-[max(26rem,calc(640*var(--u)))] items-center justify-around rounded-full bg-black font-paragraph text-[max(1rem,calc(26*var(--u)))] text-[#FFFAFF]">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="transition-colors hover:text-yellow">
                            {l.label}
                        </a>
                    ))}
                </nav>
            </header>

            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="site-menu"
                className={`fixed top-4 right-4 z-40 size-14 rounded-full shadow-[0_0_0_2px_rgb(255_250_255/0.25)] transition-all duration-300 hover:scale-105 md:top-[calc(28*var(--u))] md:right-[calc(28*var(--u))] md:size-[max(3.5rem,calc(104*var(--u)))] ${
                    atHero ? "md:pointer-events-none md:scale-75 md:opacity-0" : ""
                }`}
            >
                <img src="/hamburger.svg" alt="" className="block size-full" />
            </button>

            <div
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className={`fixed inset-0 z-50 flex flex-col bg-black px-6 py-6 text-white transition-opacity duration-300 md:px-12 ${
                    open ? "opacity-100" : "pointer-events-none invisible opacity-0"
                }`}
            >
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="ml-auto grid size-12 place-items-center rounded-full bg-white text-black md:size-14"
                >
                    <Close className="size-6" />
                </button>
                <nav aria-label="Menu" className="my-auto">
                    <ul className="space-y-2">
                        {menuLinks.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="font-heading text-[clamp(2.5rem,9vw,6rem)] leading-tight font-bold transition-colors hover:text-yellow"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <a href={profile.cv} target="_blank" rel="noreferrer" className="font-paragraph text-lg underline-offset-4 hover:underline">
                    Read CV &rarr;
                </a>
            </div>
        </>
    );
}
