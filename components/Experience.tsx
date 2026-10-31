import Image from "next/image";
import { experiences, type Experience as Item } from "@/data/site";

// Desktop: timeline horizontal sesuai frame Figma "Experience" (1440x1024), ukuran memakai unit --u.
// Tiap titik berjarak 480 piksel Figma, kartu bergantian di atas & bawah garis.
// Kartu dibuat hitam supaya teks kuning/putih kontras dengan background abu-abu.

function Ring({ className = "" }: { className?: string }) {
    return (
        <span aria-hidden className={`grid size-5 place-items-center rounded-full bg-yellow md:size-[calc(32*var(--u))] ${className}`}>
            <span className="size-[44%] rounded-full bg-grey" />
        </span>
    );
}

function Card({ item }: { item: Item }) {
    return (
        <article className="flex items-start gap-5 rounded-2xl bg-black p-5 md:gap-[calc(24*var(--u))] md:rounded-[calc(24*var(--u))] md:p-[calc(28*var(--u))]">
            <div className="md:w-[calc(400*var(--u))] md:shrink-0">
                <p className="font-heading text-2xl leading-tight font-bold text-yellow md:text-[calc(36*var(--u))] md:whitespace-nowrap">
                    {item.period}
                </p>
                <h3 className="mt-1 font-paragraph text-base leading-snug font-medium text-white md:text-[calc(22*var(--u))]">
                    {item.role} &ndash; {item.organization}
                </h3>
                <p className="mt-3 font-paragraph text-sm leading-snug text-white/70 md:mt-[calc(14*var(--u))] md:text-[calc(17*var(--u))]">
                    {item.description}
                </p>
            </div>
            {item.image && (
                <Image
                    src={item.image}
                    alt={`${item.role}, ${item.organization}`}
                    width={368}
                    height={245}
                    sizes="26vw"
                    className="hidden aspect-[368/245] w-[calc(300*var(--u))] rounded-[calc(12*var(--u))] object-cover md:block"
                />
            )}
        </article>
    );
}

export default function Experience() {
    return (
        <section id="experience" aria-labelledby="experience-title" className="relative overflow-hidden bg-grey py-16 md:h-[calc(1024*var(--u))] md:py-0">
            <h2
                id="experience-title"
                className="text-center font-heading text-[2.5rem] leading-none font-bold text-white md:pt-[calc(95*var(--u))] md:text-[calc(74*var(--u))]"
            >
                Experience
            </h2>

            {/* Mobile: timeline vertikal */}
            <ol className="mx-6 mt-10 space-y-8 border-l-2 border-yellow md:hidden">
                {experiences.map((item) => (
                    <li key={`${item.organization}-${item.period}`} className="relative pl-6">
                        <Ring className="absolute top-6 -left-[11px]" />
                        <Card item={item} />
                        {item.image && (
                            <Image
                                src={item.image}
                                alt={`${item.role}, ${item.organization}`}
                                width={368}
                                height={245}
                                className="mt-3 aspect-[368/245] w-full max-w-xs rounded-xl object-cover"
                            />
                        )}
                    </li>
                ))}
            </ol>

            {/* Desktop: timeline horizontal yang bisa di-scroll */}
            <div className="mt-[calc(80*var(--u))] hidden overflow-x-auto overflow-y-hidden [scrollbar-color:var(--color-yellow)_transparent] md:block">
                <ol className="flex h-[calc(680*var(--u))] w-max pr-[calc(700*var(--u))] pl-[calc((100vw-1440*var(--u))/2+189*var(--u))]">
                    {experiences.map((item, i) => {
                        const above = i % 2 === 0;
                        return (
                            <li key={`${item.organization}-${item.period}`} className="relative h-full w-[calc(480*var(--u))] shrink-0">
                                {/* Garis kuning horizontal menuju titik berikutnya */}
                                <span aria-hidden className="absolute top-1/2 left-0 h-[calc(4*var(--u))] w-full -translate-y-1/2 bg-yellow" />
                                {/* Garis putus-putus vertikal + titik ujung */}
                                <span
                                    aria-hidden
                                    className={`absolute left-[calc(16*var(--u))] w-[calc(4*var(--u))] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-sand)_0_calc(12*var(--u)),transparent_calc(12*var(--u))_calc(24*var(--u)))] ${above ? "top-[calc(16*var(--u))] bottom-1/2" : "top-1/2 bottom-[calc(16*var(--u))]"}`}
                                />
                                <span aria-hidden className={`absolute left-0 size-[calc(32*var(--u))] rounded-full bg-sand ${above ? "top-0" : "bottom-0"}`} />
                                <Ring className="absolute top-1/2 left-0 -translate-y-1/2" />

                                <div className={`absolute left-[calc(52*var(--u))] ${above ? "bottom-[calc(50%+36*var(--u))]" : "top-[calc(50%+36*var(--u))]"}`}>
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
