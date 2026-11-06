import Image from "next/image";
import foto from "@/public/Foto.png";
import { profile } from "@/data/site";

// Desktop: elemen diposisikan di dalam "stage" seukuran frame Figma "About Me" (1440x1024).
// Ukuran memakai unit --u (1 piksel Figma), lihat globals.css. Mobile: layout ditumpuk biasa.

function InfoColumn({ title, items, className = "" }: { title: React.ReactNode; items: string[]; className?: string }) {
   return (
      <div data-about-col className={`text-center ${className}`}>
         <h3 className="font-heading text-[1.75rem] leading-[0.85] font-bold text-accent uppercase md:text-[calc(48*var(--u))]">{title}</h3>
         <ul className="mt-[0.5em] font-paragraph text-base leading-snug text-fg-muted md:text-[calc(28*var(--u))]">
            {items.map((item) => (
               <li key={item}>{item}</li>
            ))}
         </ul>
      </div>
   );
}

// Nama besar digambar sebagai teks SVG (bukan teks HTML) supaya outline-nya bisa jadi OUTSIDE stroke yang bersih
// seperti di Figma. CSS tidak punya stroke di luar (-webkit-text-stroke selalu di tengah tepi huruf), dan meniru
// dengan filter piksel membuat tepi bergerigi. Caranya: stroke vektor 2x lebih tebal, lalu bagian dalam huruf
// dipotong dengan mask berbentuk huruf yang sama, sehingga yang tersisa hanya separuh luarnya.
// Versi isi (di belakang foto) & versi outline (di depan foto) memakai geometri yang sama persis, jadi pasti berimpit.
// Ukuran tetap dari CSS (font-size di <p>); posisi dalam em mengikuti metrik Syne: ascent 0.93em, descent 0.28em,
// line-height 0.72em -> garis dasar baris 1 & 2 di 0.685em & 1.405em, sama seperti teks HTML sebelumnya.
const NAME_LINES = ["Muhammad Affandi", "Argya Bagaskara"];
const BASELINES = ["0.685em", "1.405em"];
const OUTLINE_EM = 0.021; // tebal garis di luar huruf, relatif ukuran huruf (~1.9px di layar 1440)
const OVERLAP_PX = 0.5; // huruf isi dilebarkan sedikit ke bawah cincin outline supaya tidak ada celah tipis di sambungannya

function NameText(props: React.SVGProps<SVGTextElement>) {
   return (
      <text textAnchor="middle" {...props}>
         {NAME_LINES.map((line, i) => (
            <tspan key={line} x="50%" y={BASELINES[i]}>
               {line}
            </tspan>
         ))}
      </text>
   );
}

function Name({ className, outline }: { className: string; outline?: boolean }) {
   return (
      <p
         data-about-name
         aria-hidden={outline}
         className={`pointer-events-none absolute inset-x-0 bottom-[8%] font-heading text-[clamp(1.5rem,7.23vw,3rem)] leading-[0.72] font-bold whitespace-nowrap md:top-[75.1%] md:bottom-auto md:text-[calc(104*var(--u))] ${className}`}
      >
         {!outline && <span className="sr-only">{NAME_LINES.join(" ")}</span>}
         <svg aria-hidden className="block h-[1.44em] w-full overflow-visible">
            {outline ? (
               <>
                  <mask id="about-name-inside" maskUnits="userSpaceOnUse" x="-50%" y="-100%" width="200%" height="300%">
                     <rect x="-50%" y="-100%" width="200%" height="300%" fill="white" />
                     {/* Hitam = dipotong: seluruh bentuk huruf. Jangan diberi stroke: Syne menyusun sebagian huruf dari
                         bentuk yang bertumpuk (palang A, kaki k, diagonal y), dan stroke di mask ikut tergambar di tepi
                         tersembunyi itu sehingga garis di dalam huruf terbuka lagi */}
                     <NameText fill="black" />
                  </mask>
                  <NameText fill="none" stroke="currentColor" strokeWidth={`${OUTLINE_EM * 2}em`} strokeLinejoin="round" mask="url(#about-name-inside)" />
               </>
            ) : (
               // Stroke warna sama melebarkan huruf isi sedikit ke bawah cincin outline, menutup celah anti-aliasing
               // di sambungannya. Tepi tersembunyi di dalam huruf ikut ter-stroke, tapi tidak terlihat (warnanya sama).
               <NameText fill="currentColor" stroke="currentColor" strokeWidth={OVERLAP_PX * 2} strokeLinejoin="round" />
            )}
         </svg>
      </p>
   );
}

export default function AboutMe() {
 return (
    <section id="about" data-about data-drum-face className="relative overflow-hidden bg-surface text-fg">
       {/* Badge menempel ke tepi kiri layar (bukan tepi stage) */}
       <p data-about-badge className="relative z-30 mt-20 inline-flex items-center gap-[0.6em] rounded-r-full bg-card py-[0.35em] text-on-card pr-[0.35em] pl-[1.4em] font-heading text-sm leading-[1.06] font-medium md:absolute md:top-[calc(58*var(--u))] md:left-0 md:mt-0 md:text-[max(0.875rem,calc(24*var(--u)))]">
          <span>
             Based in <br /> {profile.location}
          </span>
          <span className="grid size-[3.6em] place-items-center rounded-full bg-chip">
             <Image src="/pin.png" alt="" width={51} height={51} className="size-[2em]" />
          </span>
       </p>

       <div className="md:stage-wide">
          <div className="px-4 pt-8 text-center md:px-0 md:pt-[calc(99*var(--u))]">
             <h2 data-about-title className="font-heading text-[2.75rem] leading-[1.2] font-bold md:text-[calc(93*var(--u))]">
                About <span className="text-accent">Me</span>
             </h2>
             <p data-about-text className="relative z-30 text-fg-muted mx-auto mt-4 max-w-2xl font-paragraph text-base md:mt-0 md:w-[87.5%] md:max-w-none md:text-balance md:text-[calc(28*var(--u))]">
                {profile.about}
             </p>
          </div>

          <div className="mt-10 flex flex-col gap-8 px-4 md:contents">
             <InfoColumn
                className="md:absolute md:top-[45.3%] md:left-[21.4%] md:w-[39%] md:-translate-x-1/2"
                title={<>On The <br /> Screen</>}
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
             <Name className="z-0 text-name" />
             <Image
                src={foto}
                alt={`Foto ${profile.fullName}`}
                sizes="(min-width: 768px) 46vw, 90vw"
                data-about-photo
                className="relative z-10 mx-auto h-auto w-[min(90vw,28rem)] md:absolute md:bottom-[calc(-24*var(--u))] md:left-[calc(50%+19*var(--u))] md:w-[calc(668*var(--u))] md:max-w-none md:-translate-x-1/2"
                priority
             />
             {/* Versi outline: garis di LUAR huruf seperti outside stroke di Figma (lihat Name) */}
             <Name className="z-20 text-name" outline />
          </div>
       </div>
    </section>
 );
}
