import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Showcase from './components/Showcase';
import UtilitiesSuite from './components/UtilitiesSuite';
import MiniGame from './components/MiniGame';
import GitUpdates from './components/GitUpdates';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0b10] text-[#f3f4f6] font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Background radial gradient accent glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00f2fe]/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#9b51e0]/5 blur-[150px] pointer-events-none z-0" />

      {/* Semantic Layout */}
      <header>
        <Navbar />
      </header>

      <main className="relative z-10">
        <Hero />
        <About />
        <Showcase />
        <UtilitiesSuite />
        <MiniGame />
        <GitUpdates />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
