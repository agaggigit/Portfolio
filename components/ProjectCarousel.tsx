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
            <p className="font-heading text-[clamp(2rem,6vw,5.5rem)] leading-none font-extrabold text-white/10 uppercase">{name}</p>
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
                    className="relative aspect-[16/10] w-full origin-center [transform:rotateX(-10deg)] overflow-hidden rounded-[clamp(1rem,3vw,2.75rem)] bg-[#0d1117] shadow-2xl motion-safe:animate-[fade-in_400ms_ease-out] md:aspect-auto md:h-full"
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
                <h3 className="font-heading text-[clamp(1.5rem,3.33vw,3rem)] leading-tight font-bold uppercase">{project.name}</h3>
                <ul className="flex gap-[0.6em] text-[clamp(0.5rem,0.63vw,0.6rem)]" aria-label="Tech stack">
                    {project.tech.map((t, i) => (
                        <li
                            key={t}
                            title={t}
                            className={`grid h-[clamp(2.25rem,3.48vw,3.2rem)] min-w-[clamp(2.25rem,3.48vw,3.2rem)] place-items-center rounded-[clamp(0.9rem,1.43vw,1.3rem)] px-[0.7em] text-center font-heading leading-tight font-bold text-black ${techColors[i % techColors.length]}`}
                        >
                            {t}
                        </li>
                    ))}
                </ul>
                <p className="font-paragraph text-[clamp(0.875rem,1.53vw,1.4rem)]">{project.role}</p>
                {project.href ? (
                    <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group justify-self-end font-paragraph text-[clamp(0.875rem,1.53vw,1.4rem)]"
                    >
                        Learn more <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                ) : (
                    <span />
                )}
                <p className="col-span-2 mt-2 max-w-3xl font-paragraph text-[clamp(0.8rem,1.1vw,1rem)] text-white/85">
                    {project.description}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 md:absolute md:right-0 md:bottom-[-1.6vw] md:left-0 md:mt-0 md:translate-y-full">
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
