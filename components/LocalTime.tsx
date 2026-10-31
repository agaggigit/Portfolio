"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    minute: "2-digit",
});

function subscribe(onChange: () => void) {
    const id = setInterval(onChange, 10_000);
    return () => clearInterval(id);
}

// Jam lokal Yogyakarta, hanya dirender di browser supaya tidak terjadi hydration mismatch.
export default function LocalTime() {
    const time = useSyncExternalStore(
        subscribe,
        () => formatter.format(new Date()),
        () => null,
    );
    return <>{time ? `${time} GMT+7` : "GMT+7"}</>;
}
