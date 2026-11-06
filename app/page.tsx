import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ProjectCursor from "@/components/ProjectCursor";
import { profile, siteUrl, socials } from "@/data/site";

// Data terstruktur untuk Google (schema.org Person)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  alternateName: profile.nickname,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Universitas Gadjah Mada" },
  address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "ID" },
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main>
        <Hero />
        {/* "Drum": About, tiap project, dan Experience jadi muka-muka satu roda yang diputar scroll (desktop) */}
        <div data-drum>
          <AboutMe />
          <Projects />
          <Experience />
        </div>
      </main>
      <Footer />
      {/* Di luar drum: elemen fixed di dalam induk yang di-transform/di-pin tidak menempel ke layar */}
      <ProjectCursor />
    </>
  );
}
