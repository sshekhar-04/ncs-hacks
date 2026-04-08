"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "./components/ui/LoadingScreen";

// HERO SYSTEM — static Figma-matching hero
const HeroSection = dynamic(() => import("./components/Hero/HeroSection"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// VIDEO SCROLL AT THE VERY START
const VideoScroll = dynamic(() => import("./components/VideoScroll/VideoScroll"), { ssr: false });

// CORE SECTIONS
const AboutNibble = dynamic(() => import("./components/aboutNibble/AboutNibble"), { ssr: false });
const HackathonTracks = dynamic(() => import("./components/tracks/Tracks"), { ssr: false });
const TimelineSection = dynamic(() => import("./components/timeline/TimelineSection"), { ssr: false });
const PhotoStream = dynamic(() => import("./components/memories/PhotoStream"), { ssr: false });
const Sponsors = dynamic(() => import("./components/sponsors/Sponsors"), { ssr: false });
const WinnersSection = dynamic(() => import("./components/prizes/WinnersSection"), { ssr: false });
const FAQSection = dynamic(() => import("./components/faq/FaqSection"), { ssr: false });
const CallToAction = dynamic(() => import("./components/CTA/CallToAction"), { ssr: false });

const Mascot = dynamic(() => import("./components/mascot/Mascot"), { ssr: false });



export default function Home() {
  return (
    <>

      {/* ================= STARTING VIDEO SCROLL ================= */}
      <VideoScroll />

      {/* ================= HERO (FIGMA DESIGN) ================= */}
      <HeroSection />


      {/* ================= MAIN EXPERIENCE ================= */}
      <main className="relative z-20">



        {/* 🧭 ANNOUNCEMENT / SOCIAL PROOF */}
        <section id="announcement" className="py-32 bg-transparent">
          <PhotoStream />
        </section>


        {/* 🏛️ KINGDOM / ABOUT — sticky scroll story, no outer padding needed */}
        <section id="kingdom" className="relative z-10 bg-transparent">
          <AboutNibble />
        </section>


        {/* 🌍 TRACKS */}
        <section id="tracks" className="py-40 bg-transparent">
          <HackathonTracks />
        </section>


        {/* 🧭 TIMELINE */}
        <section id="timeline" className="py-40 bg-transparent">
          <TimelineSection />
        </section>


        {/* 🏆 WINNERS (DIVINE TREASURES) */}
        <section id="winners" className="py-48 relative bg-transparent">
          {/* Optional divider glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-[#C9A84C]/10 to-transparent pointer-events-none" />
          <WinnersSection />
        </section>


        {/* 📜 FAQ (DIVINE KNOWLEDGE) */}
        <section id="faq" className="py-40 relative bg-transparent">
          {/* separation from winners */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#C9A84C]/5 to-transparent pointer-events-none" />
          <FAQSection />
        </section>


        {/* 🤝 SPONSORS */}
        <section id="sponsors" className="pt-4 pb-4 bg-transparent">
          <div id="team" />
          <Sponsors />
        </section>


        {/* 🚀 CTA (ASCENSION MOMENT) */}
        <CallToAction />

      </main>

      {/* 🤖 GLOBAL MASCOT SYSTEM */}
      <Mascot />
    </>
  );
}
