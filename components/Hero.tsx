// Ukuran mengikuti frame Figma 1440px (contoh: 141px -> 9.8vw)
export default function Hero() {
    return (
        <section
            id="home"
            className="relative flex h-svh min-h-[32rem] flex-col items-center justify-center overflow-hidden bg-white px-4 text-center"
        >
            <h1 className="font-heading text-[clamp(3rem,9.8vw,9rem)] leading-none font-bold text-black">
                Hi, I&rsquo;m <span className="text-blue">Aga</span>
            </h1>
            <p className="mt-[0.4em] font-paragraph text-[clamp(1.25rem,4.2vw,3.75rem)] leading-none text-black">
                Let&rsquo;s get to know me
            </p>
            <div
                aria-hidden
                className="absolute bottom-0 left-1/2 aspect-[590/354] w-[max(41vw,16rem)] -translate-x-1/2 translate-y-[63%] rounded-[50%] bg-grey"
            />
        </section>
    );
}
