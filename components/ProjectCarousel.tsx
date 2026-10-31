"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/site";
import { ChevronLeft, ChevronRight } from "./icons";

// Warna kotak tech stack bergantian sesuai desain
const techColors = ["bg-red", "bg-yellow", "bg-blue"];

function Placeholder({ name }: { name: string }) {
    return (
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(#ffffff0d_1px,transparent_1px),linear-gradient(90deg,#ffffff0d_1px,transparent_1px)] bg-[size:2rem_2rem] p-[6%]"
        >
            <p className="font-heading text-[2rem] leading-none font-extrabold text-white/10 uppercase md:text-[calc(88*var(--u))]">{name}</p>
        </div>
    );
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
    const [active, setActive] = useState(0);
    const project = projects[active];
    const goTo = (index: number) => setActive((index + projects.length) % projects.length);

    return (
        <div
            aria-roledescription="carousel"
            aria-label="Projects"
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") goTo(active + 1);
                if (e.key === "ArrowLeft") goTo(active - 1);
            }}
            className="relative flex flex-col px-[5%] pt-[6%] pb-[7%] md:h-full md:pt-[2.5%] md:pb-[3.5%]"
        >
            {/* Layar dibuat sedikit miring (perspektif) seperti mockup di Figma, nanti dianimasikan jadi "roda" */}
            <div className="[perspective:1400px] md:min-h-0 md:flex-1">
                <div
                    key={project.name}
                    aria-live="polite"
                    className="relative aspect-[16/10] w-full origin-center [transform:rotateX(-10deg)] overflow-hidden rounded-2xl bg-[#0d1117] md:rounded-[calc(44*var(--u))] shadow-2xl motion-safe:animate-[fade-in_400ms_ease-out] md:aspect-auto md:h-full"
                >
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={`Screenshot ${project.name}`}
                            fill
                            sizes="(min-width: 768px) 70vw, 95vw"
                            className="object-cover object-top"
                        />
                    ) : (
                        <Placeholder name={project.name} />
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-white md:mt-[2.2%]">
                <h3 className="font-heading text-2xl leading-tight font-bold uppercase md:text-[calc(48*var(--u))]">{project.name}</h3>
                <ul className="flex gap-[0.6em] text-[0.55rem] md:text-[max(0.55rem,calc(11*var(--u)))]" aria-label="Tech stack">
                    {project.tech.map((t, i) => (
                        <li
                            key={t}
                            title={t}
                            className={`grid h-9 min-w-9 place-items-center rounded-[0.9rem] px-[0.7em] text-center font-heading leading-tight font-bold text-black md:h-[max(2.25rem,calc(50*var(--u)))] md:min-w-[max(2.25rem,calc(50*var(--u)))] md:rounded-[calc(20*var(--u))] ${techColors[i % techColors.length]}`}
                        >
                            {t}
                        </li>
                    ))}
                </ul>
                <p className="font-paragraph text-sm md:text-[calc(22*var(--u))]">{project.role}</p>
                {project.href ? (
                    <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group justify-self-end font-paragraph text-sm md:text-[calc(22*var(--u))]"
                    >
                        Learn more <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                ) : (
                    <span />
                )}
                <p className="col-span-2 mt-2 max-w-3xl font-paragraph text-sm text-white/85 md:mt-[calc(8*var(--u))] md:max-w-[calc(820*var(--u))] md:text-[max(0.8rem,calc(17*var(--u)))]">
                    {project.description}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 md:absolute md:right-0 md:bottom-[calc(-24*var(--u))] md:left-0 md:mt-0 md:translate-y-full">
                <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label="Previous project"
                    className="grid size-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <p className="min-w-12 text-center font-heading text-sm font-bold text-black" aria-live="polite">
                    {active + 1} / {projects.length}
                </p>
                <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label="Next project"
                    className="grid size-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    );
}
