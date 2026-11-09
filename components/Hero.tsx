// Ukuran desktop memakai unit --u (1 piksel Figma), lihat globals.css.
// Atribut data-* dipakai animasi GSAP: data-hero-text oleh Intro, data-hero-content & data-hero-dome oleh ScrollAnimations.
export default function Hero() {
    return (
        <section
            id="home"
            data-hero
            className="relative flex h-(--screen-h) min-h-[32rem] flex-col items-center justify-center overflow-hidden bg-page px-4 text-center"
        >
            <div data-hero-content className="relative z-10 flex flex-col items-center">
                <h1
                    data-hero-text
                    className="font-heading text-[clamp(3rem,13vw,5rem)] leading-none font-bold text-fg md:text-[calc(141*var(--u))]"
                >
                    Hi, I&rsquo;m <span className="text-accent">Aga</span>
                </h1>
                <p
                    data-hero-text
                    className="mt-2 font-paragraph text-[clamp(1.25rem,5.5vw,2rem)] leading-none text-fg-muted md:mt-[calc(6*var(--u))] md:text-[calc(56*var(--u))]"
                >
                    Let&rsquo;s get to know me
                </p>
            </div>
            <div
                aria-hidden
                data-hero-dome
                className="absolute bottom-0 left-1/2 aspect-[590/354] w-[16rem] -translate-x-1/2 translate-y-[63%] rounded-[50%] bg-surface md:w-[calc(420*var(--u))]"
            />
        </section>
    );
}
