import Image from "next/image";
import foto from "@/public/Foto.png";
import { profile } from "@/data/site";

// Desktop: elemen diposisikan di dalam "stage" seukuran frame Figma "About Me" (1440x1024).
// Ukuran memakai unit --u (1 piksel Figma), lihat globals.css. Mobile: layout ditumpuk biasa.

function InfoColumn({ title, items, className = "" }: { title: React.ReactNode; items: string[]; className?: string }) {
   return (
      <div data-about-col className={`text-center ${className}`}>
         <h3 className="font-heading text-[1.75rem] leading-[0.85] font-bold text-yellow uppercase md:text-[calc(48*var(--u))]">{title}</h3>
         <ul className="mt-[0.5em] font-paragraph text-base leading-snug text-white md:text-[calc(28*var(--u))]">
            {items.map((item) => (
               <li key={item}>{item}</li>
            ))}
         </ul>
      </div>
   );
}

function Name({ className, hidden }: { className: string; hidden?: boolean }) {
   return (
      <p data-about-name
         aria-hidden={hidden}
         className={`pointer-events-none absolute inset-x-0 bottom-[8%] text-center font-heading text-[clamp(1.5rem,7.23vw,3rem)] leading-[0.72] font-bold whitespace-nowrap md:top-[75.1%] md:bottom-auto md:text-[calc(104*var(--u))] ${className}`}
      >
         Muhammad Affandi <br /> Argya Bagaskara
      </p>
   );
}

export default function AboutMe() {
 return (
    <section id="about" data-about data-drum-face className="relative overflow-hidden bg-grey text-white">
       {/* Badge menempel ke tepi kiri layar (bukan tepi stage) */}
       <p data-about-badge className="relative z-30 mt-20 inline-flex items-center gap-[0.6em] rounded-r-full bg-black py-[0.35em] pr-[0.35em] pl-[1.4em] font-heading text-sm leading-[1.06] font-medium md:absolute md:top-[calc(58*var(--u))] md:left-0 md:mt-0 md:text-[max(0.875rem,calc(24*var(--u)))]">
          <span>
             Based in <br /> {profile.location}
          </span>
          <span className="grid size-[3.6em] place-items-center rounded-full bg-grey">
             <Image src="/pin.png" alt="" width={51} height={51} className="size-[2em]" />
          </span>
       </p>

       <div className="md:stage">
          <div className="px-4 pt-8 text-center md:px-0 md:pt-[calc(99*var(--u))]">
             <h2 data-about-title className="font-heading text-[2.75rem] leading-[1.2] font-bold md:text-[calc(93*var(--u))]">
                About <span className="text-yellow">Me</span>
             </h2>
             <p data-about-text className="relative z-30 mx-auto mt-4 max-w-2xl font-paragraph text-base md:mt-[calc(40*var(--u))] md:w-[calc(1260*var(--u))] md:max-w-none md:text-[calc(28*var(--u))]">
                {profile.about}
             </p>
          </div>

          <div className="mt-10 flex flex-col gap-8 px-4 md:contents">
             <InfoColumn
                className="md:absolute md:top-[45.3%] md:left-[21.4%] md:w-[39%] md:-translate-x-1/2"
                title={<>Current <br /> Playground</>}
                items={profile.playground}
             />
             <InfoColumn
                className="md:absolute md:top-[45.3%] md:left-[80%] md:w-[37%] md:-translate-x-1/2"
                title={<>Off The <br /> Screen</>}
                items={profile.offScreen}
             />
          </div>

          {/* Teks nama terisi di belakang foto, versi outline di depan foto */}
          <div className="relative mt-10 md:static md:mt-0">
             <Name className="z-0 text-white" />
             <Image
                src={foto}
                alt={`Foto ${profile.fullName}`}
                sizes="(min-width: 768px) 46vw, 90vw"
                data-about-photo
                className="relative z-10 mx-auto h-auto w-[min(90vw,28rem)] md:absolute md:bottom-0 md:left-[calc(50%+19*var(--u))] md:w-[calc(668*var(--u))] md:max-w-none md:-translate-x-1/2"
                priority
             />
             <Name className="z-20 text-transparent text-stroke-2 text-stroke-white" hidden />
          </div>
       </div>
    </section>
 );
}
