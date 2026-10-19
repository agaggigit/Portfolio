import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <AboutMe/>
      <Projects/>
      <Experience/>
      <Footer/>
    </main>
  );
}
