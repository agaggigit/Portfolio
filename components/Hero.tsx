// Ukuran desktop memakai unit --u (1 piksel Figma), lihat globals.css
export default function Hero() {
    return (
        <section
            id="home"
            className="relative flex h-svh min-h-[32rem] flex-col items-center justify-center overflow-hidden bg-white px-4 text-center"
        >
            <h1 className="font-heading text-[clamp(3rem,13vw,5rem)] leading-none font-bold text-black md:text-[calc(141*var(--u))]">
                Hi, I&rsquo;m <span className="text-blue">Aga</span>
            </h1>
            <p className="mt-2 font-paragraph text-[clamp(1.25rem,5.5vw,2rem)] leading-none text-black md:mt-[calc(6*var(--u))] md:text-[calc(56*var(--u))]">
                Let&rsquo;s get to know me
            </p>
            <div
                aria-hidden
                className="absolute bottom-0 left-1/2 aspect-[590/354] w-[16rem] -translate-x-1/2 translate-y-[63%] rounded-[50%] bg-grey md:w-[calc(420*var(--u))]"
            />
        </section>
    );
}
