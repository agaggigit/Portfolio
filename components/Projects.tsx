import { moreProjectsHref, projects } from "@/data/site";
import ProjectCarousel from "./ProjectCarousel";

// Desktop: posisi persen di dalam "stage" = posisi di frame Figma "Project Wheel" (1440x1024).
// Ditulis utuh supaya Tailwind bisa mendeteksi class-nya
const vertical = "md:[writing-mode:vertical-rl] md:[text-orientation:upright]";

export default function Projects() {
    return (
        <section id="work" aria-labelledby="work-title" className="relative overflow-hidden bg-white px-4 py-16 md:p-0">
            <div className="flex flex-col items-center gap-6 md:stage md:block">
                {/* Potongan abu-abu atas & bawah (bagian dari "roda") */}
                <div aria-hidden className="absolute top-[-15.14%] left-[-3.26%] hidden h-[28.42%] w-[106.36%] md:block">
                    <img src="/shapes/project-top.svg" alt="" className="block size-full max-w-none" />
                </div>
                <div aria-hidden className="absolute top-[86.62%] left-[-3.49%] hidden h-[29.59%] w-[106.7%] -scale-y-100 md:block">
                    <img src="/shapes/project-bottom.svg" alt="" className="block size-full max-w-none" />
                </div>

                <h2
                    id="work-title"
                    className={`font-heading text-[2rem] leading-none font-bold tracking-[0.15em] text-black uppercase md:absolute md:top-1/2 md:left-[5.24%] md:-translate-x-1/2 md:-translate-y-1/2 md:text-[calc(48*var(--u))] md:tracking-normal ${vertical}`}
                >
                    Projects
                </h2>

                <div className="relative w-full md:absolute md:top-[15.14%] md:left-[10.89%] md:h-[69.63%] md:w-[78.33%]">
                    <img src="/shapes/project-panel.svg" alt="" aria-hidden className="absolute inset-0 block size-full max-w-none" />
                    <ProjectCarousel projects={projects} />
                </div>

                <a
                    href={moreProjectsHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center gap-3 font-heading text-xl leading-none font-bold whitespace-nowrap text-black uppercase md:absolute md:top-1/2 md:left-[94.76%] md:-translate-x-1/2 md:-translate-y-1/2 md:text-[calc(48*var(--u))] ${vertical}`}
                >
                    See More <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </a>
            </div>
        </section>
    );
}
