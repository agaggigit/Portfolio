import Image from "next/image";
import foto from "@/public/Foto.png";
import { profile } from "@/data/site";

// Desktop: posisi elemen mengikuti frame Figma "About Me" (1440x1024) dalam persen/vw.
// Mobile: layout ditumpuk biasa.

function InfoColumn({ title, items, className = "" }: { title: React.ReactNode; items: string[]; className?: string }) {
   return (
      <div className={`text-center ${className}`}>
         <h3 className="font-heading text-[clamp(1.75rem,3.33vw,3rem)] leading-[0.85] font-bold text-yellow uppercase">{title}</h3>
         <ul className="mt-[0.5em] font-paragraph text-[clamp(1rem,1.94vw,1.75rem)] leading-snug text-white">
            {items.map((item) => (
               <li key={item}>{item}</li>
            ))}
         </ul>
      </div>
   );
}

function Name({ className, hidden }: { className: string; hidden?: boolean }) {
   return (
      <p
         aria-hidden={hidden}
         className={`pointer-events-none absolute inset-x-0 bottom-[8%] text-center font-heading text-[clamp(1.5rem,7.23vw,6.5rem)] leading-[0.72] font-bold whitespace-nowrap md:top-[75.1%] md:bottom-auto ${className}`}
      >
         Muhammad Affandi <br /> Argya Bagaskara
      </p>
   );
}

export default function AboutMe() {
 return (
    <section id="about" className="relative overflow-hidden bg-grey text-white md:h-[71.11vw]">
       <p className="relative mt-20 inline-flex items-center gap-[0.6em] rounded-r-full bg-black py-[0.35em] pr-[0.35em] pl-[1.4em] font-heading text-[clamp(0.875rem,1.73vw,1.6rem)] leading-[1.06] font-medium md:absolute md:top-[4vw] md:left-0 md:mt-0">
          <span>
             Based in <br /> {profile.location}
          </span>
          <span className="grid size-[3.6em] place-items-center rounded-full bg-grey">
             <Image src="/pin.png" alt="" width={51} height={51} className="size-[2em]" />
          </span>
       </p>

       <div className="px-4 pt-8 text-center md:px-0 md:pt-[6.9vw]">
          <h2 className="font-heading text-[clamp(2.75rem,6.46vw,6rem)] leading-[1.2] font-bold">
             About <span className="text-yellow">Me</span>
          </h2>
          <p className="relative z-30 mx-auto mt-4 max-w-2xl font-paragraph text-[clamp(1rem,1.94vw,1.75rem)] md:mt-[3.5vw] md:w-[90vw] md:max-w-none">
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
             className="relative z-10 mx-auto h-auto w-[min(90vw,28rem)] md:absolute md:bottom-0 md:left-[calc(50%+1.3vw)] md:w-[46.4vw] md:max-w-none md:-translate-x-1/2"
             priority
          />
          <Name className="z-20 text-transparent text-stroke-2 text-stroke-white" hidden />
       </div>
    </section>
 );
}
