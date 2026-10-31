// Semua konten web ada di file ini. Ubah isinya di sini, komponen akan ikut berubah.

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const profile = {
  nickname: "Aga",
  fullName: "Muhammad Affandi Argya Bagaskara",
  role: "Information Technology Student at Universitas Gadjah Mada",
  location: "Yogyakarta",
  timezone: "Asia/Jakarta",
  about:
    "I’m an Information Technology Student who loves solving problems through software engineering and machine learning. I build digital products that are meant to last a thousand years.",
  playground: [
    "Embedded & Microcontrollers",
    "Native Applications",
    "Data Engineering & ML Pipelines",
  ],
  offScreen: [
    "Casual sports & exploring nature",
    "Acoustic music & cooking experiments",
    "Collaborating & building with friends",
  ],
  email: "muhammadaffandiargyabagaskara@gmail.com",
  cv: "/cv-aga.pdf",
};

// Kosongkan (hapus barisnya) link yang tidak dipakai, otomatis tidak ditampilkan.
export const socials: { label: string; href: string }[] = [
  { label: "Read CV", href: profile.cv },
  { label: "GitHub", href: "https://github.com/agaggigit" },
  { label: "LinkedIn", href: "https://linkedin.com/in/muhammadaffandiargyabagaskara" },
  // { label: "Instagram", href: "https://instagram.com/..." },
  { label: "E-mail", href: `mailto:${profile.email}` },
  // { label: "X/Twitter", href: "https://x.com/..." },
];

export type Project = {
  name: string;
  role: string;
  description: string;
  tech: string[];
  /** Path gambar di folder public, contoh: "/projects/talangin.png" (rasio 16:10 ideal) */
  image?: string;
  /** Link demo / repo / case study */
  href?: string;
};

export const projects: Project[] = [
  {
    name: "Talangin",
    role: "Solo developer",
    description:
      "A progressive web app my friends use to track shared expenses and debts. Born from a problem we kept running into, and it still works offline.",
    tech: ["React", "Express", "PostgreSQL", "PWA"],
  },
  {
    name: "Pertamax Queue Simulation",
    role: "Data collection & simulation",
    description:
      "Modelled motorcycle queues at a gas station from four field observation sessions to measure waiting time and service load, presented as an interactive dashboard.",
    tech: ["Python", "SimPy", "Streamlit"],
  },
  {
    name: "EcoRoute",
    role: "UI developer · team of 3",
    description:
      "A desktop app that compares the carbon footprint of different routes and transport modes to nudge people toward low-emission trips. Work in progress.",
    tech: ["C#", ".NET"],
  },
  {
    name: "GradaTim",
    role: "Developer",
    description:
      "An AI assistant that breaks big goals down into tasks and a daily schedule.",
    tech: ["Python", "Gemini API"],
  },
];

export const moreProjectsHref = "https://github.com/agaggigit";

export type Experience = {
  period: string;
  role: string;
  organization: string;
  description: string;
  /** Path foto di folder public, contoh: "/experience/technocorner.jpg" */
  image?: string;
};

// Urut dari yang paling lama, timeline dibaca kiri ke kanan.
export const experiences: Experience[] = [
  {
    period: "Aug 2024 – Present",
    role: "B.Sc. Information Technology",
    organization: "Universitas Gadjah Mada",
    description: "Department of Electrical Engineering and Information Technology. GPA 3.55 / 4.00.",
  },
  {
    period: "Jan 2025 – Feb 2026",
    role: "Staff, Social & Community Division",
    organization: "KMTETI UGM",
    description:
      "Ran a village program installing solar panels to power clean-water pumps in Gunungkidul and channelled up to IDR 14M to people in need.",
  },
  {
    period: "Nov 2025 – Jun 2026",
    role: "Vice Head of Division 2",
    organization: "Technocorner 2026",
    description:
      "Led six divisions of a national robotics & IoT competition that grew from ~730 to ~1,300 participants, now a qualifier for the All Japan Robot-Sumo Tournament.",
  },
  {
    period: "Nov 2025 – May 2026",
    role: "Event Sub-coordinator",
    organization: "FindIT! 2026",
    description:
      "Helped run a national IT competition with ~4,300 participants: split staff tasks, designed the competition flow, and mediated conflicts.",
  },
  {
    period: "Feb 2026 – Present",
    role: "Program Supervisor, KMTETI Beramal",
    organization: "KMTETI UGM",
    description:
      "Mentoring four staff running weekly food sharing for waste pickers and fundraising for people affected by disasters.",
  },
];
