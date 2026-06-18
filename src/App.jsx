import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Terminal from "./components/Terminal.jsx";
import ArchitectureDiagram from "./components/ArchitectureDiagram.jsx";
import Solve from "./components/Solve.jsx";
import Capabilities from "./components/Capabilities.jsx";
import RSkills from "./components/RSkills.jsx";
import VideoShowcase from "./components/VideoShowcase.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Privacy from "./components/Privacy.jsx";
import CookieNotice from "./components/CookieNotice.jsx";
import DotField from "./components/DotField.jsx";

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") : "";
  if (path === "/privacy") return (
    <>
      <Privacy />
      <Analytics />
    </>
  );

  return (
    <>
      <DotField />
      <Nav />
      <main id="top">
        <Hero />
        <Terminal />
        <Solve />
        <ArchitectureDiagram />
        <Capabilities />
        <RSkills />
        <VideoShowcase />
        <Contact />
      </main>
      <Footer />
      <CookieNotice />
      <Analytics />
    </>
  );
}
