import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Terminal from "./components/Terminal.jsx";
import ArchitectureDiagram from "./components/ArchitectureDiagram.jsx";
import VideoShowcase from "./components/VideoShowcase.jsx";
import CommunityStrip from "./components/CommunityStrip.jsx";
import Pipeline from "./components/Pipeline.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Privacy from "./components/Privacy.jsx";
import CookieNotice from "./components/CookieNotice.jsx";
import DotField from "./components/DotField.jsx";

// ponytail: hand-rolled routing — four static routes don't need a router
const PAGES = { "/privacy": Privacy, "/pipeline": Pipeline };

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") : "";
  const Page = PAGES[path];

  // the browser's native hash jump fires before React mounts the sections, so
  // any cross-page link (/#contact from /pipeline) lands at the top — redo the
  // jump once they exist. Effects run after children mount, so this covers
  // every route.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  if (Page) return (
    <>
      <Page />
      <CookieNotice />
      <Analytics />
      <SpeedInsights />
    </>
  );

  return (
    <>
      <DotField />
      <Nav />
      <main id="top">
        <Hero />
        <ArchitectureDiagram />
        <VideoShowcase />
        <Terminal />
        <CommunityStrip />
        <Contact />
      </main>
      <Footer />
      <CookieNotice />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
