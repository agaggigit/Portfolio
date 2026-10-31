import Image from "next/image";
import { experiences, type Experience as Item } from "@/data/site";

// Desktop: timeline horizontal sesuai frame Figma "Experience" (1440x1024).
// Tiap titik berjarak 480px (33.33vw), kartu bergantian di atas & bawah garis.

function Ring({ className = "" }: { className?: string }) {
    return (
        <span aria-hidden className={`grid size-[clamp(1.25rem,2.22vw,2rem)] place-items-center rounded-full bg-yellow ${className}`}>
            <span className="size-[44%] rounded-full bg-grey" />
        </span>
    );
}

function Card({ item }: { item: Item }) {
    return (
        <article className="flex items-start gap-[1.2vw]">
            <div className="text-yellow md:w-[32.5vw] md:shrink-0">
                <p className="font-heading text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight font-bold md:whitespace-nowrap">{item.period}</p>
                <h3 className="font-paragraph text-[clamp(1rem,1.94vw,1.75rem)] leading-snug">
                    {item.role} &ndash; {item.organization}
                </h3>
                <p className="mt-[1em] font-paragraph text-[clamp(0.875rem,1.39vw,1.25rem)] leading-snug">{item.description}</p>
            </div>
            {item.image && (
                <Image
                    src={item.image}
                    alt={`${item.role}, ${item.organization}`}
                    width={368}
                    height={245}
                    sizes="26vw"
                    className="hidden aspect-[368/245] w-[25.6vw] object-cover md:block"
                />
            )}
        </article>
    );
}

export default function Experience() {
    return (
        <section id="experience" aria-labelledby="experience-title" className="relative overflow-hidden bg-grey py-16 md:h-[71.11vw] md:py-0">
            <h2
                id="experience-title"
                className="text-center font-heading text-[clamp(2.5rem,5.15vw,4.6rem)] leading-none font-bold text-white md:pt-[7.4vw]"
            >
                Experience
            </h2>

            {/* Mobile: timeline vertikal */}
            <ol className="mx-6 mt-10 space-y-10 border-l-2 border-yellow md:hidden">
                {experiences.map((item) => (
                    <li key={`${item.organization}-${item.period}`} className="relative pl-7">
                        <Ring className="absolute top-1.5 -left-[11px]" />
                        <Card item={item} />
                        {item.image && (
                            <Image
                                src={item.image}
                                alt={`${item.role}, ${item.organization}`}
                                width={368}
                                height={245}
                                className="mt-3 aspect-[368/245] w-full max-w-xs object-cover"
                            />
                        )}
                    </li>
                ))}
            </ol>

            {/* Desktop: timeline horizontal yang bisa di-scroll */}
            <div className="mt-[6.4vw] hidden overflow-x-auto overflow-y-hidden [scrollbar-color:var(--color-yellow)_transparent] md:block">
                <ol className="flex h-[43.75vw] w-max pr-[40vw] pl-[13.1vw]">
                    {experiences.map((item, i) => {
                        const above = i % 2 === 0;
                        return (
                            <li key={`${item.organization}-${item.period}`} className="relative h-full w-[33.33vw] shrink-0">
                                {/* Garis kuning horizontal menuju titik berikutnya */}
                                <span aria-hidden className="absolute top-1/2 left-0 h-[0.28vw] w-full -translate-y-1/2 bg-yellow" />
                                {/* Garis putus-putus vertikal + titik ujung */}
                                <span
                                    aria-hidden
                                    className={`absolute left-[1.11vw] w-[0.28vw] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-sand)_0_0.85vw,transparent_0.85vw_1.7vw)] ${above ? "top-[1.11vw] bottom-1/2" : "top-1/2 bottom-[1.11vw]"}`}
                                />
                                <span aria-hidden className={`absolute left-0 size-[2.22vw] rounded-full bg-sand ${above ? "top-0" : "bottom-0"}`} />
                                <Ring className="absolute top-1/2 left-0 -translate-y-1/2" />

                                <div className={`absolute left-[4.65vw] w-[59.2vw] ${above ? "bottom-[calc(50%+3vw)]" : "top-[calc(50%+3vw)]"}`}>
                                    <Card item={item} />
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
