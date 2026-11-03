"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Semua animasi scroll ada di sini, elemen dipilih lewat atribut data-* di tiap section.
// Hanya aktif di desktop dan kalau pengguna tidak mematikan animasi (prefers-reduced-motion).

// Geometri drum, relatif terhadap tinggi layar
const RADIUS = 1.8; // jari-jari roda; makin besar, sudut antar kartu makin kecil dan roda terasa makin bulat
const PERSPECTIVE = 2.7; // jarak "kamera"; harus > RADIUS karena kita melihat roda dari sisi dalam
const GAP_DEG = 1.1; // celah antar muka
const HIDE_DEG = 100; // muka yang sudah berputar lebih jauh dari ini disembunyikan
const SCROLL_PER_UNIT = 0.7; // 1 detik timeline = 0.7 tinggi layar scroll
const TURN = 1.8; // panjang satu putaran antar muka; makin besar, roda makin pelan
const REST = 0.13; // jeda diam di tiap project; makin kecil, gerak dan diam makin menyatu
const HERO_SCROLL = "+=45%"; // panjang scroll dari Hero ke About

// Scroll halus (Lenis). Trackpad mengirim lonjakan delta yang besar & tidak rata, jadi kecepatan dibatasi:
// posisi tujuan scroll tidak boleh mendahului posisi yang sedang ditampilkan lebih dari MAX_LEAD tinggi layar.
// Dengan SMOOTHING 0.1/frame, kecepatan maksimum ~ MAX_LEAD * 6 tinggi layar per detik.
const MAX_LEAD = 0.3; // makin kecil = makin pelan & stabil
const SMOOTHING = 0.1; // 0..1, makin kecil = makin "melayang"
// "Gravitasi": setelah berhenti scroll SNAP_DELAY ms, halaman ditarik pelan ke titik penting terdekat (judul di tengah,
// project di tengah, dst.). Titik di depan arah scroll menarik dari jauh, titik di belakang hanya dari dekat,
// jadi satu putaran roda mouse tidak ditarik mundur lagi. Jarak dalam tinggi layar; di luar jarak itu dibiarkan.
const SNAP_RANGE = 0.28; // jarak tarik titik di depan
const SNAP_BACK = 0.08; // jarak tarik titik di belakang
const SNAP_DELAY = 200; // ms tanpa input sebelum ditarik
const SNAP_DURATION = 1; // detik

export default function ScrollAnimations() {
    useGSAP(() => {
        const mm = gsap.matchMedia();
        let lenis: Lenis | null = null;

        // 0. Scroll halus + pembatas kecepatan (semua ukuran layar; di HP hanya memengaruhi roda mouse)
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const l = new Lenis({
                lerp: SMOOTHING,
                virtualScroll: (data) => {
                    const max = window.innerHeight * MAX_LEAD;
                    const lead = l.targetScroll - l.animatedScroll;
                    // Hanya membatasi scroll searah; berbalik arah selalu boleh (juga saat gravitasi sedang menarik)
                    const delta = data.deltaY > 0 ? Math.min(data.deltaY, Math.max(0, max - lead)) : Math.max(data.deltaY, Math.min(0, -max - lead));
                    // Sudah di batas kecepatan: abaikan event ini (dan cegah browser scroll sendiri)
                    if (Math.abs(delta) < 0.5 && data.deltaY !== 0) {
                        if (data.event.cancelable) data.event.preventDefault();
                        return false;
                    }
                    data.deltaY = delta;
                    return true;
                },
            });
            lenis = l;
            l.on("scroll", ScrollTrigger.update);
            const tick = (time: number) => l.raf(time * 1000);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
            // Scroll dikunci selama intro
            if (document.documentElement.dataset.intro === "play") l.stop();
            const start = () => l.start();
            window.addEventListener("intro:done", start);
            return () => {
                window.removeEventListener("intro:done", start);
                gsap.ticker.remove(tick);
                gsap.ticker.lagSmoothing(500, 33);
                l.destroy();
                lenis = null;
            };
        });

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
                        end: HERO_SCROLL,
                        pin: true,
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => reportCovered(self.progress),
                    },
                })
                    .to("[data-hero-content]", { y: () => -window.innerHeight * 0.45, opacity: 0, duration: 0.8, ease: "power1.in" }, 0)
                    .to(dome, { scale: coverScale, duration: 0.8, ease: "power1.in" }, 0)
                    // Di akhir, Hero (sudah abu-abu penuh) memudar dan judul "About Me" di bawahnya terlihat
                    .to(hero, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.8);
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
            // Titik "gravitasi" di dalam drum (detik timeline), diubah ke posisi scroll setelah ScrollTrigger dihitung
            const snapTimes: number[] = [0]; // judul "About Me" di tengah
            const snapHere = (back = 0) => snapTimes.push(tl.duration() - back);

            // About: judul "About Me" mulai di tengah layar lalu naik ke posisinya, isi muncul bertahap
            const title = document.querySelector<HTMLElement>("[data-about-title]");
            const toCenter = () => (title ? window.innerHeight / 2 - (title.offsetTop + title.offsetHeight / 2) : 0);
            tl.addLabel("about")
                .from(title, { y: toCenter, scale: 1.15, duration: 0.7, ease: "power1.out" }, 0)
                .from("[data-about-badge]", { xPercent: -110, duration: 0.4, ease: "power1.out" }, 0.1)
                .from("[data-about-text]", { y: 40, opacity: 0, duration: 0.4, ease: "power1.out" }, 0.2)
                .from("[data-about-photo]", { yPercent: 70, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.3)
                .from("[data-about-col]", { y: 50, opacity: 0, stagger: 0.1, duration: 0.4, ease: "power1.out" }, 0.5)
                .from("[data-about-name]", { y: 60, opacity: 0, duration: 0.4, ease: "power1.out" }, 0.8);
            hold();
            snapHere(0.25); // isi About sudah lengkap

            // Putar roda muka demi muka. Label "PROJECTS", "SEE MORE" & titik indikator hanya tampil di muka project
            const labels = "[data-projects-label], [data-projects-more], [data-projects-dots]";
            const first = projectIndexes[0];
            const last = projectIndexes[projectIndexes.length - 1];
            for (let i = 1; i < faces.length; i++) {
                tl.to(wheel, { angle: () => angles[i], duration: TURN, ease: "sine.inOut", onUpdate: render });
                if (i === first) tl.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "<+0.5");
                if (i === last + 1) tl.to(labels, { opacity: 0, duration: 0.4 }, "<");
                if (i === first) tl.addLabel("work");
                if (i <= last) {
                    hold(REST);
                    snapHere(REST / 2); // project di tengah
                }
            }
            tl.addLabel("experience");

            // Experience: judul mulai di tengah lalu naik (seperti About). Lalu "ujung" garis kuning bergerak ke kanan:
            // garis tergambar di belakangnya, titik & kartu muncul saat dilewati, dan timeline ikut digeser ke kiri
            // begitu ujungnya melewati REVEAL_AT lebar layar.
            const expTitle = document.querySelector<HTMLElement>("[data-exp-title]");
            const expCenter = () => (expTitle ? window.innerHeight / 2 - (expTitle.offsetTop + expTitle.offsetHeight / 2) : 0);
            tl.from(expTitle, { y: expCenter, scale: 1.15, duration: 0.7, ease: "power1.out" }, "experience");
            snapTimes.push(tl.labels.experience, tl.labels.experience + 0.7); // judul Experience di tengah, lalu sudah naik

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
                tl.fromTo(drawLine, { head: 0 }, { head: 1, duration: 1 + items.length * 0.6, ease: "none", onUpdate: renderLine }, "experience+=0.8");
            }
            hold(0.3);
            snapHere(0.15); // timeline Experience lengkap
            // Layar terakhir: drum masih ditahan sementara Footer naik menimpanya (lihat bagian Footer di bawah).
            // Isi Experience ikut naik & memudar, jadi yang tersisa di atas lengkungan hanya abu-abu polos (seperti Figma)
            tl.to([expTitle, scroller].filter(Boolean), { y: () => -window.innerHeight * 0.15, opacity: 0, duration: 0.8, ease: "power1.in" });
            hold(1 / SCROLL_PER_UNIT - 0.8);

            const st = ScrollTrigger.create({
                trigger: drum,
                start: "top top",
                end: () => `+=${tl.duration() * window.innerHeight * SCROLL_PER_UNIT}`,
                pin: true,
                scrub: 0.3,
                animation: tl,
                invalidateOnRefresh: true,
                onRefreshInit: () => {
                    layout();
                    render();
                },
                onRefresh: renderLine,
            });

            // Titik gravitasi: atas halaman, titik-titik drum, dan Footer sampai atas (= akhir drum)
            let snapPoints: number[] = [];
            const buildSnaps = () => {
                const toScroll = (t: number) => st.start + (t / tl.duration()) * (st.end - st.start);
                snapPoints = [0, ...snapTimes.map(toScroll), st.end];
            };
            buildSnaps();
            ScrollTrigger.addEventListener("refresh", buildSnaps);

            let direction = 1;
            let snapTimer = 0;
            const pull = () => {
                if (!lenis) return;
                const from = lenis.targetScroll;
                const reach = (y: number) => window.innerHeight * ((y - from) * direction >= 0 ? SNAP_RANGE : SNAP_BACK);
                const inReach = snapPoints.filter((y) => Math.abs(y - from) <= reach(y));
                if (!inReach.length) return;
                const target = inReach.reduce((a, b) => (Math.abs(b - from) < Math.abs(a - from) ? b : a));
                if (Math.abs(target - from) > 1) lenis.scrollTo(target, { duration: SNAP_DURATION, easing: (t) => 1 - Math.pow(1 - t, 3) });
            };
            // Event wheel juga terus datang selama momentum trackpad, jadi tarikan menunggu sampai benar-benar berhenti
            const onWheel = (e: WheelEvent) => {
                if (e.ctrlKey || e.deltaY === 0) return;
                direction = Math.sign(e.deltaY);
                window.clearTimeout(snapTimer);
                snapTimer = window.setTimeout(pull, SNAP_DELAY);
            };
            window.addEventListener("wheel", onWheel, { passive: true });

            // 6. Experience -> Footer: Footer (margin atas -100svh di globals.css) naik menimpa layar terakhir drum.
            // Lengkungan abu-abu di atasnya ikut naik sampai hilang, judul naik ke posisinya, status muncul, dan
            // area kuning (lengkungan, Say Hello, link) naik sebagai satu blok. Area kuning sengaja mulai belakangan:
            // sebelum itu posisinya masih di bawah layar, jadi gerakannya tidak akan terlihat.
            const footer = document.querySelector<HTMLElement>("[data-footer]");
            if (footer) {
                gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: { trigger: footer, start: "top bottom", end: "top top", scrub: 0.3, invalidateOnRefresh: true },
                })
                    .to("[data-footer-cap]", { scaleY: 0, duration: 1 }, 0)
                    .from("[data-footer-title]", { y: () => window.innerHeight * 0.25, duration: 1 }, 0)
                    .from("[data-footer-rise]", { y: () => window.innerHeight * 0.6, duration: 0.65, ease: "power1.out" }, 0.35)
                    .from("[data-footer-reveal]", { y: 60, opacity: 0, stagger: 0.08, duration: 0.3, ease: "power1.out" }, 0.7);
            }

            // Semua link navigasi diarahkan ke posisi scroll yang tepat. Lompatan bawaan browser tidak bisa dipakai:
            // Hero sudah tersembunyi setelah memudar, dan lompatannya tertimpa kalau Lenis sedang bergerak.
            const onClick = (e: MouseEvent) => {
                const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
                const hash = link?.hash.slice(1);
                const top =
                    hash === "home" ? 0
                    : hash === "contact" ? st.end
                    : hash === "about" || hash === "work" || hash === "experience" ? st.labelToScroll(hash) + 2
                    : null;
                if (top === null) return;
                e.preventDefault();
                window.clearTimeout(snapTimer);
                if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
                else window.scrollTo({ top });
            };
            document.addEventListener("click", onClick);

            return () => {
                ScrollTrigger.removeEventListener("refresh", buildSnaps);
                window.removeEventListener("wheel", onWheel);
                window.clearTimeout(snapTimer);
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
