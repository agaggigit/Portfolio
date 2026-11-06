// Deteksi mouse/trackpad dari gerakan sungguhan, bukan media query. Media query (pointer/hover) dilaporkan
// berdasarkan perangkat, dan di sebagian laptop layar sentuh semuanya bilang "tidak ada mouse" walau
// trackpad dipakai. Gerakan pointer bertipe "mouse" (trackpad juga) selalu bisa dipercaya.
// Begitu terdeteksi: <html data-mouse> dipasang (dipakai varian hover: di globals.css) dan semua
// pemasangan yang menunggu dijalankan.

type Setup = () => (() => void) | void;

let detected = false;
const waiting = new Set<() => void>();

function onPointer(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    detected = true;
    document.documentElement.dataset.mouse = "";
    window.removeEventListener("pointermove", onPointer);
    [...waiting].forEach((run) => run());
}

/** Jalankan setup sekarang kalau mouse sudah terdeteksi, atau begitu gerakan mouse pertama terjadi. Mengembalikan cleanup. */
export function whenMouse(setup: Setup): () => void {
    let cleanup: (() => void) | void;
    let done = false;
    const run = () => {
        waiting.delete(run);
        if (!done) cleanup = setup();
    };
    if (detected) run();
    else {
        waiting.add(run);
        window.addEventListener("pointermove", onPointer, { passive: true });
    }
    return () => {
        done = true;
        waiting.delete(run);
        cleanup?.();
    };
}
