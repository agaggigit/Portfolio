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
    "I’m Aga, an IT student at UGM who enjoys building software and machine learning projects, especially ones that solve a real problem around me. I think everything through before I start, because I’d rather build it once and have it keep working than rush it and patch it later.",
  playground: [
    "Full-stack web apps",
    "Simulations & data dashboards",
    "AI tools built on LLM APIs",
    "IoT, paused for now, back soon",
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

// Sementara semua project diarahkan ke profil GitHub; ganti dengan link demo/repo masing-masing kalau sudah ada
const githubProfile = "https://github.com/agaggigit";

export const projects: Project[] = [
  {
    name: "Talangin",
    role: "Solo developer",
    description:
      "My friends and I kept forgetting who had paid for what, so I built Talangin to keep track of it for us. It’s a web app you can install on your phone, and we still use it now and then to split shared expenses and settle debts, even when there’s no internet connection.",
    tech: ["React", "Express", "PostgreSQL", "PWA"],
    href: githubProfile,
  },
  {
    name: "Pertamax Queue Simulation",
    role: "Data collection & simulation",
    description:
      "For this project I went to a gas station four times to observe how motorcycles queued for fuel. I then used that data to build a simulation in SimPy and presented the waiting times and service load in an interactive dashboard.",
    tech: ["Python", "SimPy", "Streamlit"],
    href: githubProfile,
  },
  {
    name: "EcoRoute",
    role: "UI developer · team of 3",
    description:
      "EcoRoute is a desktop app that compares the carbon footprint of different routes and modes of transport, so people can easily see which trip is the greener one. I’m working on the interface together with two teammates, and the app is still in development.",
    tech: ["C#", ".NET"],
    href: githubProfile,
  },
  {
    name: "GradaTim",
    role: "Developer",
    description:
      "GradaTim is an AI assistant for goals that feel too big to start on. You tell it what you want to achieve, and it breaks that goal down into smaller tasks and arranges them into a daily schedule.",
    tech: ["Python", "Gemini API"],
    href: githubProfile,
  },
];

export const moreProjectsHref = githubProfile;

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
    description:
      "I’m studying in the Department of Electrical Engineering and Information Technology, where my current GPA is 3.55 out of 4.00.",
  },
  {
    period: "Jan 2025 – Feb 2026",
    role: "Staff, Social & Community Division",
    organization: "KMTETI UGM",
    description:
      "In the social and community division, I ran a village program that installed solar panels to power clean-water pumps in Gunungkidul, and we also channelled up to IDR 14 million to people in need.",
  },
  {
    period: "Nov 2025 – Jun 2026",
    role: "Vice Head of Division 2",
    organization: "Technocorner 2026",
    description:
      "As vice head, I led six divisions of a national robotics and IoT competition. During that time the event grew from around 730 to 1,300 participants, and it’s now a qualifier for the All Japan Robot-Sumo Tournament.",
  },
  {
    period: "Nov 2025 – May 2026",
    role: "Event Sub-coordinator",
    organization: "FindIT! 2026",
    description:
      "I helped run a national IT competition with around 4,300 participants, where my job was to divide tasks among the staff, design how the competition would run, and step in when conflicts came up.",
  },
  {
    period: "Feb 2026 – Present",
    role: "Program Supervisor, KMTETI Beramal",
    organization: "KMTETI UGM",
    description:
      "I now supervise this program, mentoring four staff members who organise weekly food sharing for waste pickers and raise funds for people affected by disasters.",
  },
];
