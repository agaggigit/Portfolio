"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Semua animasi scroll ada di sini, elemen dipilih lewat atribut data-* di tiap section.
// Hanya aktif di desktop dan kalau pengguna tidak mematikan animasi (prefers-reduced-motion).

// Geometri drum, relatif terhadap tinggi layar
const RADIUS = 0.9; // jari-jari roda
const PERSPECTIVE = 1.6; // jarak "kamera"; harus > RADIUS karena kita melihat roda dari sisi dalam
const GAP_DEG = 1.8; // celah antar muka
const HIDE_DEG = 100; // muka yang sudah berputar lebih jauh dari ini disembunyikan
const SCROLL_PER_UNIT = 0.7; // 1 detik timeline = 0.7 tinggi layar scroll

export default function ScrollAnimations() {
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
            const html = document.documentElement;
            // Penanda untuk CSS (globals.css bagian "Drum") bahwa animasi aktif
            html.dataset.anim = "on";

            // 1. Hero -> About: Hero ditahan, tonjolan abu-abu membesar sampai menutupi layar
            const hero = document.querySelector<HTMLElement>("[data-hero]");
            const dome = document.querySelector<HTMLElement>("[data-hero-dome]");
            if (hero && dome) {
                // Skala minimal supaya elips (pusatnya di bawah layar) menutupi seluruh layar
                const coverScale = () => {
                    const a = dome.offsetWidth / 2;
                    const b = dome.offsetHeight / 2;
                    const dx = window.innerWidth / 2;
                    const dy = window.innerHeight + b * 0.26;
                    return Math.sqrt((dx / a) ** 2 + (dy / b) ** 2) * 1.05;
                };

                // Beri tahu Navbar kapan layar sudah tertutup abu-abu (pill diganti tombol hamburger)
                let covered = false;
                const reportCovered = (progress: number) => {
                    if (progress > 0.55 === covered) return;
                    covered = !covered;
                    window.dispatchEvent(new CustomEvent("hero:covered", { detail: covered }));
                };

                gsap.timeline({
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "+=80%",
                        pin: true,
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => reportCovered(self.progress),
                    },
                })
                    .to("[data-hero-content]", { y: () => -window.innerHeight * 0.45, opacity: 0, ease: "power1.in" }, 0)
                    .to(dome, { scale: coverScale, ease: "power1.in" }, 0);
            }

            // 2–5. Drum: About -> tiap project -> Experience adalah muka-muka satu roda.
            // Scroll memutar roda satu muka per langkah; muka sebelumnya berguling ke atas (melebar, seperti
            // potongan atas di Figma) dan muka berikutnya naik dari bawah.
            const drum = document.querySelector<HTMLElement>("[data-drum]");
            const faces = gsap.utils.toArray<HTMLElement>("[data-drum-face]");
            if (!drum || faces.length < 2) return () => delete html.dataset.anim;

            const isProject = (face: HTMLElement) => face.matches("[data-projects] [data-drum-face]");
            const projectIndexes = faces.flatMap((face, i) => (isProject(face) ? [i] : []));

            // Semua muka diberi jarak sudut setinggi panel project, jadi roda terlihat seragam.
            // About & Experience penuh layar saat di tengah, lalu mengecil ke ukuran panel saat berguling
            // (lihat render). Muka setinggi h yang menyinggung lingkaran berjari-jari R menempati sudut 2*atan(h/2R).
            let angles: number[] = [];
            let radius = 0;
            let perspective = 0;
            let step = 0; // sudut antar muka
            let panelScale = 1; // skala About/Experience supaya selebar panel project
            let panelClip = 0; // potongan atas-bawah (px, sebelum skala) supaya setinggi panel project
            let panelRound = 0; // radius sudut (px, sebelum skala)
            let viewH = 0;
            let panelH = 0;
            const layout = () => {
                const vh = drum.clientHeight;
                const vw = drum.clientWidth;
                const panel = drum.querySelector<HTMLElement>("[data-projects] article");
                const pw = panel?.offsetWidth ?? vw;
                const ph = panel?.offsetHeight ?? vh;
                radius = RADIUS * vh;
                perspective = PERSPECTIVE * vh;
                step = (2 * Math.atan(ph / 2 / radius) * 180) / Math.PI + GAP_DEG;
                angles = faces.map((_, i) => i * step);
                panelScale = pw / vw;
                panelClip = Math.max(0, (vh - ph / panelScale) / 2);
                panelRound = (ph * 0.036) / panelScale; // sudut panel project ~26/713 tingginya
                viewH = vh;
                panelH = ph;
            };
            const halfDeg = (h: number) => (Math.atan(h / 2 / radius) * 180) / Math.PI;
            layout();

            // Putaran roda saat ini (derajat); ditween oleh timeline lalu diterapkan ke tiap muka
            const wheel = { angle: 0 };
            const dots = gsap.utils.toArray<HTMLElement>("[data-projects-dots] > li");
            const render = () => {
                // Seberapa jauh About/Experience sudah mengecil (0 = penuh layar, 1 = seukuran panel)
                const shrinkOf = (i: number) => gsap.parseEase("power1.out")(Math.min(1, Math.abs(angles[i] - wheel.angle) / step));
                // Selama About/Experience masih lebih tinggi dari panel, muka-muka di sebelahnya didorong menjauh
                // sebesar selisih tingginya, jadi panel project "menunggu" lalu mengekor tanpa menimpa.
                const extras = faces.map((face, i) => {
                    if (isProject(face)) return 0;
                    const t = shrinkOf(i);
                    const visibleH = (viewH - 2 * panelClip * t) * (1 - (1 - panelScale) * t);
                    return Math.max(0, halfDeg(visibleH) - halfDeg(panelH));
                });
                const positions = angles.map((a, i) => a + extras.reduce((sum, extra, f) => sum + (f < i ? extra : f > i ? -extra : 0), 0));

                faces.forEach((face, i) => {
                    const d = positions[i] - wheel.angle;
                    const visible = Math.abs(d) < HIDE_DEG;
                    face.style.visibility = visible ? "visible" : "hidden";
                    if (!visible) return;
                    // About & Experience: mengecil ke ukuran panel project selama berguling sejauh satu muka
                    let shrink = "";
                    if (!isProject(face)) {
                        const t = shrinkOf(i);
                        shrink = ` scale(${1 - (1 - panelScale) * t})`;
                        face.style.clipPath = `inset(${panelClip * t}px 0 round ${panelRound * t}px)`;
                    }
                    // Sumbu putar berada di depan layar (translateZ +R), jadi kita melihat sisi dalam roda
                    face.style.transform = `perspective(${perspective}px) translateZ(${radius}px) rotateX(${d}deg) translateZ(${-radius}px)${shrink}`;
                    face.style.zIndex = String(1000 - Math.round(Math.abs(d)));
                    // Hanya muka yang sedang di tengah yang bisa diklik
                    face.style.pointerEvents = Math.abs(d) < 10 ? "auto" : "none";
                });
                // Indikator project: titik aktif = project yang paling dekat ke tengah
                const distances = projectIndexes.map((i) => Math.abs(angles[i] - wheel.angle));
                const nearest = distances.indexOf(Math.min(...distances));
                dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === nearest));
            };
            render();

            const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
            const hold = (duration = 0.5) => tl.to({}, { duration });

            // About: judul "About Me" mulai di tengah layar lalu naik ke posisinya, isi muncul bertahap
            const title = document.querySelector<HTMLElement>("[data-about-title]");
            const toCenter = () => (title ? window.innerHeight / 2 - (title.offsetTop + title.offsetHeight / 2) : 0);
            tl.addLabel("about")
                .from(title, { y: toCenter, scale: 1.15, duration: 1 }, 0)
                .from("[data-about-badge]", { xPercent: -110, duration: 0.6, ease: "power1.out" }, 0.4)
                .from("[data-about-text]", { y: 40, opacity: 0, duration: 0.6, ease: "power1.out" }, 0.6)
                .from("[data-about-photo]", { yPercent: 70, opacity: 0, duration: 0.9, ease: "power2.out" }, 0.7)
                .from("[data-about-col]", { y: 50, opacity: 0, stagger: 0.15, duration: 0.6, ease: "power1.out" }, 0.9)
                .from("[data-about-name]", { y: 60, opacity: 0, duration: 0.6, ease: "power1.out" }, 1.2);
            hold();

            // Putar roda muka demi muka. Label "PROJECTS", "SEE MORE" & titik indikator hanya tampil di muka project
            const labels = "[data-projects-label], [data-projects-more], [data-projects-dots]";
            const first = projectIndexes[0];
            const last = projectIndexes[projectIndexes.length - 1];
            for (let i = 1; i < faces.length; i++) {
                tl.to(wheel, { angle: () => angles[i], duration: 1, onUpdate: render });
                if (i === first) tl.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "<+0.5");
                if (i === last + 1) tl.to(labels, { opacity: 0, duration: 0.4 }, "<");
                if (i === first) tl.addLabel("work");
                if (i <= last) hold();
            }
            tl.addLabel("experience");

            // Experience: judul mulai di tengah lalu naik (seperti About). Lalu "ujung" garis kuning bergerak ke kanan:
            // garis tergambar di belakangnya, titik & kartu muncul saat dilewati, dan timeline ikut digeser ke kiri
            // begitu ujungnya melewati REVEAL_AT lebar layar.
            const expTitle = document.querySelector<HTMLElement>("[data-exp-title]");
            const expCenter = () => (expTitle ? window.innerHeight / 2 - (expTitle.offsetTop + expTitle.offsetHeight / 2) : 0);
            tl.from(expTitle, { y: expCenter, scale: 1.15, duration: 1 }, "experience");

            const scroller = document.querySelector<HTMLElement>("[data-exp-scroller]");
            const track = document.querySelector<HTMLElement>("[data-exp-track]");
            const items = gsap.utils.toArray<HTMLElement>("[data-exp-item]");
            const REVEAL_AT = 0.7;
            const drawLine = { head: 0 }; // 0..1 dari titik pertama sampai ujung timeline
            const renderLine = () => {
                if (!scroller || !track || !items.length) return;
                const start = items[0].offsetLeft - 1; // mulai tepat sebelum titik pertama, jadi belum ada yang tampil
                const maxShift = Math.max(0, track.scrollWidth - scroller.clientWidth);
                const revealX = scroller.clientWidth * REVEAL_AT;
                // Ujung paling jauh = ujung garis terakhir, atau sejauh yang dibutuhkan supaya timeline habis digeser
                const end = Math.max(items[items.length - 1].offsetLeft + items[items.length - 1].offsetWidth, revealX + maxShift);
                const head = start + (end - start) * drawLine.head;
                gsap.set(track, { x: -Math.min(maxShift, Math.max(0, head - revealX)) });
                items.forEach((item) => {
                    const line = item.querySelector<HTMLElement>("[data-exp-line]");
                    const drawn = Math.min(1, Math.max(0, (head - item.offsetLeft) / item.offsetWidth));
                    if (line) line.style.transform = `scaleX(${drawn})`;
                    item.toggleAttribute("data-shown", head > item.offsetLeft);
                });
            };
            if (scroller && track && items.length) {
                gsap.set(scroller, { overflow: "hidden" }); // scrollbar diganti scroll halaman
                tl.fromTo(drawLine, { head: 0 }, { head: 1, duration: 1 + items.length * 0.6, ease: "none", onUpdate: renderLine }, "experience+=1.1");
            }
            hold(0.3);
            // Layar terakhir: drum masih ditahan sementara Footer naik menimpanya (lihat bagian Footer di bawah).
            // Isi Experience ikut naik & memudar, jadi yang tersisa di atas lengkungan hanya abu-abu polos (seperti Figma)
            tl.to([expTitle, scroller].filter(Boolean), { y: () => -window.innerHeight * 0.15, opacity: 0, duration: 0.8, ease: "power1.in" });
            hold(1 / SCROLL_PER_UNIT - 0.8);

            const st = ScrollTrigger.create({
                trigger: drum,
                start: "top top",
                end: () => `+=${tl.duration() * window.innerHeight * SCROLL_PER_UNIT}`,
                pin: true,
                scrub: 0.6,
                animation: tl,
                invalidateOnRefresh: true,
                onRefreshInit: () => {
                    layout();
                    render();
                },
                onRefresh: renderLine,
            });

            // 6. Experience -> Footer: Footer (margin atas -100svh di globals.css) naik menimpa layar terakhir drum.
            // Lengkungan abu-abu di atasnya ikut naik sampai hilang, judul naik ke posisinya, isi lain muncul bertahap.
            const footer = document.querySelector<HTMLElement>("[data-footer]");
            if (footer) {
                gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: { trigger: footer, start: "top bottom", end: "top top", scrub: 0.6, invalidateOnRefresh: true },
                })
                    .to("[data-footer-cap]", { scaleY: 0, duration: 1 }, 0)
                    .from("[data-footer-title]", { y: () => window.innerHeight * 0.25, duration: 1 }, 0)
                    .from("[data-footer-reveal]", { y: 60, opacity: 0, stagger: 0.08, duration: 0.3, ease: "power1.out" }, 0.7);
            }

            // Link navigasi (#about, #work, #experience) diarahkan ke posisi scroll yang tepat di dalam drum
            const onClick = (e: MouseEvent) => {
                const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
                const label = link?.hash.slice(1);
                if (!label || !["about", "work", "experience"].includes(label)) return;
                e.preventDefault();
                window.scrollTo({ top: st.labelToScroll(label) + 2 });
            };
            document.addEventListener("click", onClick);

            return () => {
                document.removeEventListener("click", onClick);
                faces.forEach((face) => face.removeAttribute("style"));
                dots.forEach((dot) => dot.removeAttribute("data-active"));
                items.forEach((item) => {
                    item.removeAttribute("data-shown");
                    item.querySelector<HTMLElement>("[data-exp-line]")?.style.removeProperty("transform");
                });
                delete html.dataset.anim;
            };
        });

        // Posisi pin dihitung ulang setelah intro selesai (scroll sebelumnya dikunci)
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("intro:done", refresh);
        return () => {
            window.removeEventListener("intro:done", refresh);
            mm.revert();
        };
    });

    return null;
}
