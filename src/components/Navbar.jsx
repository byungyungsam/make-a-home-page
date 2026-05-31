import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ['home', 'about', 'showcase', 'utilities', 'minigame', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Showcase', id: 'showcase' },
    { name: 'Utilities', id: 'utilities' },
    { name: 'Mini Game', id: 'minigame' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavClick('home')}>
          <div className="nav-logo-icon">
            <Cpu className="icon-cyan" />
          </div>
          <span className="nav-brand">
            DEV<span className="brand-highlight">PORTFOLIO</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${activeSection === link.id ? 'nav-link-active' : ''}`}
            >
              {link.name}
              {activeSection === link.id && <span className="nav-link-indicator" />}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="nav-toggle">
          <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
            {isOpen ? <X className="icon-white" /> : <Menu className="icon-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Links Panel */}
      {isOpen && (
        <div className="nav-mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-mobile-link ${activeSection === link.id ? 'nav-mobile-link-active' : ''}`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
