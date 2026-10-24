import { InquiryEmailPreview } from "./email/InquiryEmailPreview.tsx";
import { About } from "./components/About.tsx";
import { Contact } from "./components/Contact.tsx";
import { CtaBand } from "./components/CtaBand.tsx";
import { Footer } from "./components/Footer.tsx";
import { Framework } from "./components/Framework.tsx";
import { Hero } from "./components/Hero.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { Portfolio } from "./components/Portfolio.tsx";
import { Services } from "./components/Services.tsx";

export default function App() {
  if (window.location.pathname === "/email-preview") {
    return <InquiryEmailPreview />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Framework />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
