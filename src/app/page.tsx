import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-us";
import JoinUs from "./components/join-us";
import Contact from "./components/contact";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <JoinUs />
      <Contact />
    </div>
  );
}
