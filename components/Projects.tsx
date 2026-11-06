import Image from "next/image";
import { moreProjectsHref, projects, type Project } from "@/data/site";

// Tiap project = satu panel abu-abu. Di desktop (animasi aktif) tiap panel jadi satu "muka" drum yang
// diputar oleh ScrollAnimations (lihat globals.css bagian "Drum"). Tanpa animasi / di HP: panel ditumpuk ke bawah.
// Ukuran panel = frame Figma "Project Wheel": 1128 x 713 piksel Figma (unit --u).

// Seberapa dalam sisi kiri-kanan panel melengkung ke dalam, dalam piksel Figma (dari lebar panel 1128).
// 0 = lurus, desain Figma asli ~38. Bentuk ikut melar mengikuti ukuran panel.
const PANEL_CURVE = 14;
const W = 1128;
const H = 713;
const R = 26; // radius sudut
const c = PANEL_CURVE * 2; // titik kontrol kurva kuadrat = 2x kedalaman lengkungan
const panelPath = `M${R},0 H${W - R} Q${W},0 ${W},${R} Q${W - c},${H / 2} ${W},${H - R} Q${W},${H} ${W - R},${H} H${R} Q0,${H} 0,${H - R} Q${c},${H / 2} 0,${R} Q0,0 ${R},0 Z`;

function PanelShape() {
    return (
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 hidden size-full fill-surface md:block">
            <path d={panelPath} />
        </svg>
    );
}

function Screen({ project }: { project: Project }) {
    return (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#0d1117] shadow-2xl md:aspect-auto md:min-h-0 md:flex-1 md:rounded-[calc(44*var(--u))]">
            {project.image ? (
                <Image src={project.image} alt={`Screenshot ${project.name}`} fill sizes="(min-width: 768px) 70vw, 95vw" className="object-cover object-top" />
            ) : (
                // Placeholder sampai screenshot project diisi di data/site.ts
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(#ffffff0d_1px,transparent_1px),linear-gradient(90deg,#ffffff0d_1px,transparent_1px)] bg-[size:2rem_2rem] p-[6%]"
                >
                    <p className="font-heading text-[2rem] leading-none font-extrabold text-white/10 uppercase md:text-[calc(88*var(--u))]">{project.name}</p>
                </div>
            )}
        </div>
    );
}

function ProjectPanel({ project }: { project: Project }) {
    return (
        <li data-drum-face className="flex justify-center md:items-center">
            <article className="relative flex w-full max-w-3xl flex-col rounded-3xl bg-surface px-[5%] pt-[6%] pb-[7%] md:h-[calc(713*var(--u))] md:w-[calc(1128*var(--u))] md:max-w-none md:rounded-none md:bg-transparent md:pt-[2.5%] md:pb-[3%]">
                <PanelShape />
                <Screen project={project} />

                <div className="relative mt-5 grid grid-cols-1 items-center md:grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-fg md:mt-[2.2%]">
                    <h3 className="font-heading text-2xl leading-tight font-bold uppercase md:text-[calc(48*var(--u))]">{project.name}</h3>
                    <ul className="flex flex-wrap gap-[0.6em] text-[0.55rem] md:text-[max(0.55rem,calc(11*var(--u)))]" aria-label="Tech stack">
                        {project.tech.map((t) => (
                            <li
                                key={t}
                                title={t}
                                className={`grid h-9 min-w-9 place-items-center rounded-[0.9rem] px-[0.7em] text-center border border-current font-heading leading-tight font-bold md:h-[max(2.25rem,calc(50*var(--u)))] md:min-w-[max(2.25rem,calc(50*var(--u)))] md:rounded-[calc(20*var(--u))]`}
                            >
                                {t}
                            </li>
                        ))}
                    </ul>
                    <p className="font-paragraph text-sm md:text-[calc(22*var(--u))]">{project.role}</p>
                    {project.href ? (
                        <a href={project.href} target="_blank" rel="noreferrer" className="group font-paragraph md:justify-self-end text-sm md:text-[calc(22*var(--u))]">
                            Learn more <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                        </a>
                    ) : (
                        <span />
                    )}
                    <p className="mt-2 max-w-3xl md:col-span-2 font-paragraph text-sm text-fg-muted md:mt-[calc(8*var(--u))] md:max-w-[calc(820*var(--u))] md:text-[max(0.8rem,calc(17*var(--u)))]">
                        {project.description}
                    </p>
                </div>
            </article>
        </li>
    );
}

export default function Projects() {
    return (
        <section id="work" data-projects aria-labelledby="work-title" className="relative bg-page px-4 py-16 md:px-0 md:py-[calc(120*var(--u))]">
            {/* Label & indikator: di atas/bawah daftar saat statis, menempel di kiri/kanan drum saat animasi aktif */}
            <h2
                id="work-title"
                data-projects-label
                className="text-center font-heading text-[2rem] leading-none font-bold text-fg uppercase md:text-[calc(64*var(--u))]"
            >
                Projects
            </h2>

            <ol className="mt-10 space-y-8 md:mt-[calc(64*var(--u))] md:space-y-[calc(48*var(--u))]">
                {projects.map((project) => (
                    <ProjectPanel key={project.name} project={project} />
                ))}
            </ol>

            <a
                href={moreProjectsHref}
                target="_blank"
                rel="noreferrer"
                data-projects-more
                className="group mx-auto mt-10 flex w-fit items-center gap-3 font-heading text-xl leading-none font-bold whitespace-nowrap text-fg uppercase md:mt-[calc(64*var(--u))] md:text-[calc(48*var(--u))]"
            >
                See More <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>

            {/* Indikator project aktif, hanya tampil saat drum berputar (diatur ScrollAnimations) */}
            <ol data-projects-dots aria-hidden className="hidden gap-[calc(12*var(--u))] rounded-full bg-card px-[calc(16*var(--u))] py-[calc(10*var(--u))]">
                {projects.map((project) => (
                    <li key={project.name} className="size-[max(0.5rem,calc(12*var(--u)))] rounded-full bg-on-card/30 transition-colors data-[active]:bg-cta" />
                ))}
            </ol>
        </section>
    );
}
