export default function Navbar() {
 return (
    <>
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-[clamp(1.5rem,8vw,8rem)] bg-black px-12 py-2 rounded-full text-white text-xl">
                <a href="#work">Work</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </nav>
        </header>
    </>
 );
}