"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Semua animasi scroll ada di sini, elemen dipilih lewat atribut data-* di tiap section.
// Hanya aktif di desktop dan kalau pengguna tidak mematikan animasi (prefers-reduced-motion).

// Geometri drum, relatif terhadap tinggi layar
const RADIUS = 1.1; // jari-jari roda; makin kecil, roda makin bulat dan panel makin melengkung
const PERSPECTIVE = 1.65; // jarak "kamera"; antara RADIUS dan 2*RADIUS supaya kamera berada di dalam roda
const GAP_DEG = 1.1; // celah antar muka
const CURVE_SAMPLES = 16; // jumlah titik per sisi lengkung
const HIDE_DEG = 100; // muka yang sudah berputar lebih jauh dari ini disembunyikan
const SCROLL_PER_UNIT = 0.7; // 1 detik timeline = 0.7 tinggi layar scroll
// Seberapa lama animasi "menyusul" posisi scroll (detik). Menghaluskan dorongan per klik roda mouse jadi satu gerak
// yang menyambung; dipakai sama di Hero, drum, dan Footer supaya rasanya satu arus.
const SCRUB = 0.6;
const TURN = 1.8; // panjang satu putaran antar muka; makin besar, roda makin pelan
// Roda tidak pernah berhenti: tiap putaran melambat di project lalu langsung lanjut.
// GLIDE = kecepatan saat project tepat di tengah, relatif terhadap kecepatan rata-rata (0 = berhenti, 1 = rata)
const GLIDE = 0.35;
const glide = (t: number) => GLIDE * t + (1 - GLIDE) * (0.5 - Math.cos(Math.PI * t) / 2);
const HERO_SCROLL = "+=45%"; // panjang scroll dari Hero ke About

// Scroll halus (Lenis). Trackpad mengirim lonjakan delta yang besar & tidak rata, jadi kecepatan dibatasi:
// posisi tujuan scroll tidak boleh mendahului posisi yang sedang ditampilkan lebih dari MAX_LEAD tinggi layar.
// Dengan SMOOTHING 0.1/frame, kecepatan maksimum ~ MAX_LEAD * 6 tinggi layar per detik.
const MAX_LEAD = 0.3; // makin kecil = makin pelan & stabil
const SMOOTHING = 0.1; // 0..1, makin kecil = makin "melayang"
// Follow-through ("massa"): saat scroll, isi tertinggal sedikit dari wadahnya lalu menyusul saat berhenti.
// Pada kecepatan maksimum (~0.03 tinggi layar/frame), lapisan berkedalaman 1 tertinggal ~LAG*0.03 tinggi layar.
const LAG = 0.7; // makin besar = makin jauh tertinggal
const SPEED_SMOOTHING = 0.15; // 0..1 per frame, penghalus kecepatan scroll sebelum dipakai
const MAX_LAG = 0.06; // batas tertinggal, dalam tinggi layar
const LAG_FOLLOW = 0.1; // 0..1 per frame untuk kedalaman 1; makin kecil = makin lambat menyusul
// Lapisan isi dan kedalamannya (makin besar = makin berat: tertinggal lebih jauh & menyusul lebih lambat)
const LAYERS: [string, number][] = [
    ["[data-hero-content]", 1],
    ["[data-about-title]", 0.5],
    ["[data-about-text]", 0.8],
    ["[data-about-col]", 1.1],
    ["[data-about-name]", 1.4],
    ["[data-about-photo]", 1.7],
    ["[data-projects] article > :nth-child(2)", 0.7], // layar/gambar project
    ["[data-projects] article > :nth-child(3)", 1.2], // judul, tech, deskripsi
    // Experience sengaja tidak: kontennya bergerak horizontal, lag vertikal di situ terasa kedut-kedut
    ["[data-footer-title]", 0.6],
    ["[data-footer-reveal]", 0.75], // sedikit lebih berat dari judul di atasnya, jadi tertinggal menjauh, bukan mendekat
    ["[data-footer-rise]", 1],
];

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

            // --screen-h (globals.css) diisi tinggi layar yang sebenarnya. Unit CSS (vh/svh) tidak selalu ikut
            // berubah saat fullscreen (F11) di Chrome, sehingga Hero & drum tertahan setinggi jendela lama.
            // Sengaja tidak memeriksa jenis input: Chrome di laptop layar sentuh bisa mengaku tidak punya mouse.
            const syncScreenH = () => html.style.setProperty("--screen-h", `${window.innerHeight}px`);
            syncScreenH();
            window.addEventListener("resize", syncScreenH);
            ScrollTrigger.addEventListener("refreshInit", syncScreenH);
            // ScrollTrigger mengabaikan perubahan tinggi kecil di perangkat yang ia anggap sentuh (address bar HP).
            // Di layar selebar ini itu justru membuat F11 tidak dihitung ulang, jadi dimatikan.
            ScrollTrigger.config({ ignoreMobileResize: false });

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
                        scrub: SCRUB,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => reportCovered(self.progress),
                        // Juga saat dihitung ulang, supaya Navbar benar walau halaman dimuat di tengah (mis. refresh di About)
                        onRefresh: (self) => reportCovered(self.progress),
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
            const undoScreenH = () => {
                window.removeEventListener("resize", syncScreenH);
                ScrollTrigger.removeEventListener("refreshInit", syncScreenH);
                html.style.removeProperty("--screen-h");
                ScrollTrigger.config({ ignoreMobileResize: true });
            };
            if (!drum || faces.length < 2) {
                undoScreenH();
                return () => delete html.dataset.anim;
            }

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
            let viewW = 0;
            let panelW = 0;
            let panelH = 0;
            const layout = () => {
                // Ukuran layar, bukan ukuran drum: saat refresh dimulai drum yang di-pin masih membawa tinggi/lebar
                // lama (px inline dari ScrollTrigger), jadi setelah fullscreen/resize panel terhitung dari ukuran lama.
                const vh = window.innerHeight;
                const vw = document.documentElement.clientWidth;
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
                viewW = vw;
                panelW = pw;
                panelH = ph;
            };

            // Lengkungan panel: elemen HTML tidak bisa ditekuk, jadi muka tetap datar, tapi garis luarnya
            // (clip-path) dihitung dari permukaan silinder yang sebenarnya: untuk tiap titik di tepi kiri/kanan
            // permukaan roda, cari titik di muka datar yang jatuh di posisi layar yang sama. Hasilnya berubah saat
            // muka berguling, persis seperti panel yang benar-benar menempel di roda.
            // t = seberapa jauh About/Experience mengecil (1 untuk project); lengkungan ikut t supaya About
            // yang penuh layar tetap persegi.
            const curvedOutline = (dDeg: number, t: number, project: boolean) => {
                const k = project ? 1 : 1 - (1 - panelScale) * t; // skala muka
                // Ukuran bagian yang terlihat, sesudah skala
                const w = project ? panelW : viewW * k;
                const h = project ? panelH : (viewH - 2 * panelClip * t) * k;
                const r = project ? panelH * 0.036 : panelRound * t * k;
                const P = perspective;
                const R = radius;
                const d = (dDeg * Math.PI) / 180;
                const c = Math.cos(d);
                const s = Math.sin(d);
                // Titik layar (X, Y) -> koordinat lokal (u, v) di muka datar yang sudah diputar d
                const toLocal = (X: number, Y: number) => {
                    const v = (Y * (P - R * (1 - c)) - P * R * s) / (P * c + Y * s);
                    const z = v * s + R * (1 - c);
                    return [(X * (P - z)) / P, v];
                };
                // Tepi kanan permukaan roda pada jarak busur a dari tengah muka, dalam koordinat lokal muka datar
                const edge = (a: number) => {
                    const b = a / R + d;
                    const z = R * (1 - Math.cos(b));
                    const [u, v] = toLocal(((w / 2) * P) / (P - z), (R * Math.sin(b) * P) / (P - z));
                    return [w / 2 + (u - w / 2) * t, a + (v - a) * t]; // t = 0 -> persegi datar
                };
                // Ke koordinat elemen (sebelum skala, titik asal di pojok kiri atas)
                const px = (u: number, v: number) => `${(u / k + viewW / 2).toFixed(1)} ${(v / k + viewH / 2).toFixed(1)}`;
                // Bentuk aslinya sedikit lebih besar dari kotak muka (tepi atas/bawah lebih dekat ke kamera), padahal di luar
                // kotak itu tidak ada isi. Jadi dimasukkan ke kotak: lebar diskalakan sampai sisi terlebar menyentuh tepi,
                // tinggi dibatasi ke tepi atas/bawah.
                const raw = [-h / 2, ...Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => -h / 2 + r + ((h - 2 * r) * i) / CURVE_SAMPLES), h / 2].map(edge);
                const fit = w / 2 / Math.max(...raw.map(([u]) => u));
                const pts = raw.map(([u, v]) => [u * fit, gsap.utils.clamp(-h / 2, h / 2, v)]);
                const [tu, tv] = pts[0];
                const [bu, bv] = pts[pts.length - 1];
                const side = pts.slice(1, -1);
                const [tiu, tiv] = side[0];
                const [biu, biv] = side[CURVE_SAMPLES];
                return (
                    `path("M ${px(-tu + r, tv)} L ${px(tu - r, tv)} Q ${px(tu, tv)} ${px(tiu, tiv)} ` +
                    side.map(([u, v]) => `L ${px(u, v)}`).join(" ") +
                    ` Q ${px(bu, bv)} ${px(bu - r, bv)} L ${px(-bu + r, bv)} Q ${px(-bu, bv)} ${px(-biu, biv)} ` +
                    side.reverse().map(([u, v]) => `L ${px(-u, v)}`).join(" ") +
                    ` Q ${px(-tu, tv)} ${px(-tu + r, tv)} Z")`
                );
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
                    const project = isProject(face);
                    const t = project ? 1 : shrinkOf(i);
                    if (!project) {
                        shrink = ` scale(${1 - (1 - panelScale) * t})`;
                        face.style.clipPath = `inset(${panelClip * t}px 0 round ${panelRound * t}px)`;
                    }
                    // Di sudut yang hampir tegak lurus layar rumusnya tidak stabil, dan muka di sana sudah nyaris tak terlihat
                    if (Math.abs(d) < 75) face.style.clipPath = curvedOutline(d, t, project);
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

            // About: judul "About Me" mulai di tengah layar lalu naik ke posisinya. Isi lainnya tidak muncul satu per satu,
            // tapi terbawa naik bersama judul: tiap elemen digeser sejauh judul ditambah ekstra yang makin besar ke bawah,
            // jadi saat judul di tengah semuanya masih di bawah layar, urutannya tidak pernah tertukar, dan jaraknya
            // merapat sampai posisi akhir (yang lebih bawah bergerak lebih jauh = parallax).
            const title = document.querySelector<HTMLElement>("[data-about-title]");
            const toCenter = () => (title ? window.innerHeight / 2 - (title.offsetTop + title.offsetHeight / 2) : 0);
            const below = (extra: number) => () => toCenter() + window.innerHeight * extra;
            const ABOUT = 1; // panjang masuknya About
            tl.addLabel("about")
                .from(title, { y: toCenter, scale: 1.15, duration: ABOUT * 0.8, ease: "power2.out" }, 0)
                .from("[data-about-badge]", { xPercent: -110, duration: ABOUT * 0.6, ease: "power2.out" }, 0)
                .from("[data-about-text]", { y: below(0.5), duration: ABOUT, ease: "power2.out" }, 0)
                .from("[data-about-col]", { y: below(0.6), duration: ABOUT, ease: "power2.out" }, 0)
                .from("[data-about-name]", { y: below(0.7), duration: ABOUT, ease: "power2.out" }, 0)
                .from("[data-about-photo]", { y: below(0.8), duration: ABOUT, ease: "power2.out" }, 0);

            // Putar roda muka demi muka tanpa jeda; putaran pertama sudah mulai sebelum About selesai bergerak.
            // Label "PROJECTS", "SEE MORE" & titik indikator hanya tampil di muka project
            const labels = "[data-projects-label], [data-projects-more], [data-projects-dots]";
            const first = projectIndexes[0];
            const last = projectIndexes[projectIndexes.length - 1];
            // Tiap putaran mulai tepat saat putaran sebelumnya selesai (dicatat sendiri: ">" di GSAP berarti "setelah tween
            // terakhir yang ditambahkan", dan itu bisa tween label yang jauh lebih pendek, sehingga putaran saling bertabrakan)
            let turnAt = ABOUT * 0.85;
            for (let i = 1; i < faces.length; i++) {
                tl.to(wheel, { angle: () => angles[i], duration: TURN, ease: glide, onUpdate: render }, turnAt);
                turnAt += TURN;
                if (i === first) tl.addLabel("work", tl.duration()); // project pertama di tengah
                if (i === first) tl.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "<+0.5");
                if (i === last + 1) tl.to(labels, { opacity: 0, duration: 0.4 }, "<");
            }
            tl.addLabel("experience");

            // Experience: judul mulai di tengah lalu naik (seperti About), dimulai selagi mukanya masih bergulir masuk.
            // Lalu "ujung" garis kuning bergerak ke kanan: garis tergambar di belakangnya, titik & kartu muncul saat
            // dilewati, dan timeline ikut digeser ke kiri begitu ujungnya melewati REVEAL_AT lebar layar.
            const expTitle = document.querySelector<HTMLElement>("[data-exp-title]");
            const expCenter = () => (expTitle ? window.innerHeight / 2 - (expTitle.offsetTop + expTitle.offsetHeight / 2) : 0);
            tl.from(expTitle, { y: expCenter, scale: 1.15, duration: 0.8, ease: "power2.out" }, "experience-=0.5");

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
                tl.fromTo(drawLine, { head: 0 }, { head: 1, duration: 1 + items.length * 0.6, ease: "none", onUpdate: renderLine }, "experience+=0.1");
            }
            // Layar terakhir: drum masih ditahan sementara Footer naik menimpanya (lihat bagian Footer di bawah).
            // Isi Experience ikut naik & memudar, jadi yang tersisa di atas lengkungan hanya abu-abu polos (seperti Figma).
            // Bukan jeda: selama sisa waktu ini Footer sedang naik.
            tl.to([expTitle, scroller].filter(Boolean), { y: () => -window.innerHeight * 0.15, opacity: 0, duration: 0.8, ease: "power1.in" }, tl.duration() - 0.2);
            tl.to({}, { duration: 1 / SCROLL_PER_UNIT - 0.8 });

            const st = ScrollTrigger.create({
                trigger: drum,
                start: "top top",
                end: () => `+=${tl.duration() * window.innerHeight * SCROLL_PER_UNIT}`,
                pin: true,
                scrub: SCRUB,
                animation: tl,
                invalidateOnRefresh: true,
                onRefreshInit: () => {
                    layout();
                    render();
                },
                // Dihitung ulang setelah pin selesai diukur ulang juga, supaya pasti memakai ukuran terbaru
                onRefresh: () => {
                    layout();
                    render();
                    renderLine();
                },
            });

            // Follow-through: tiap lapisan isi tertinggal dari wadahnya sebanding kecepatan scroll, lalu menyusul.
            // Lapisan yang lebih "dalam" tertinggal lebih jauh DAN menyusul lebih lambat, jadi bagian-bagian tidak
            // bergerak serempak (overlapping action) — itu yang memberi kesan massa, tanpa ada yang berubah bentuk.
            // Dipasang lewat yPercent supaya tidak bentrok dengan tween y di timeline.
            const lagLayers = LAYERS.flatMap(([selector, depth]) =>
                gsap.utils.toArray<HTMLElement>(selector).map((el) => ({ el, depth, offset: 0, height: 1, set: gsap.quickSetter(el, "yPercent") })),
            );
            const measureLayers = () => lagLayers.forEach((layer) => (layer.height = layer.el.offsetHeight || 1));
            measureLayers();
            ScrollTrigger.addEventListener("refresh", measureLayers);
            let speed = 0;
            const tickLag = () => {
                const screenH = window.innerHeight;
                // Kecepatan mentah Lenis naik-turun tiap frame (apalagi trackpad), jadi dihaluskan dulu
                const raw = lenis ? lenis.velocity / screenH : 0; // tinggi layar per frame, + = scroll ke bawah
                speed += (raw - speed) * SPEED_SMOOTHING;
                if (Math.abs(speed) < 1e-5) speed = 0;
                lagLayers.forEach((layer) => {
                    const target = gsap.utils.clamp(-MAX_LAG, MAX_LAG, speed * LAG * layer.depth) * screenH;
                    let next = layer.offset + (target - layer.offset) * (LAG_FOLLOW / layer.depth);
                    if (Math.abs(next) < 0.05 && Math.abs(target) < 0.05) next = 0;
                    if (next === layer.offset) return;
                    layer.offset = next;
                    layer.set((next / layer.height) * 100);
                });
            };
            gsap.ticker.add(tickLag);

            // 6. Experience -> Footer: Footer (margin atas -100% tinggi layar di globals.css) naik menimpa layar terakhir drum.
            // Lengkungan abu-abu di atasnya ikut naik sampai hilang, judul naik ke posisinya, status muncul, dan
            // area kuning (lengkungan, Say Hello, link) naik sebagai satu blok. Area kuning sengaja mulai belakangan:
            // sebelum itu posisinya masih di bawah layar, jadi gerakannya tidak akan terlihat.
            const footer = document.querySelector<HTMLElement>("[data-footer]");
            if (footer) {
                gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: { trigger: footer, start: "top bottom", end: "top top", scrub: SCRUB, invalidateOnRefresh: true },
                })
                    .to("[data-footer-cap]", { scaleY: 0, duration: 1 }, 0)
                    .from("[data-footer-title]", { y: () => window.innerHeight * 0.25, duration: 1 }, 0)
                    .from("[data-footer-rise]", { y: () => window.innerHeight * 0.6, duration: 0.65, ease: "power1.out" }, 0.35)
                    // Baris status terbawa judul (gerak & waktu sama) ditambah ekstra, jadi jaraknya hanya merapat, tidak pernah menyundul
                    .from("[data-footer-reveal]", { y: () => window.innerHeight * 0.4, duration: 1 }, 0);
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
                if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
                else window.scrollTo({ top });
            };
            document.addEventListener("click", onClick);

            return () => {
                gsap.ticker.remove(tickLag);
                ScrollTrigger.removeEventListener("refresh", measureLayers);
                gsap.set(lagLayers.map((layer) => layer.el), { yPercent: 0 });
                document.removeEventListener("click", onClick);
                faces.forEach((face) => face.removeAttribute("style"));
                dots.forEach((dot) => dot.removeAttribute("data-active"));
                items.forEach((item) => {
                    item.removeAttribute("data-shown");
                    item.querySelector<HTMLElement>("[data-exp-line]")?.style.removeProperty("transform");
                });
                undoScreenH();
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
