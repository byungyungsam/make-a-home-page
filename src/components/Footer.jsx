import React from 'react';
import { ChevronUp, Code2 } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Info */}
        <div className="footer-info">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Developer Portfolio. All rights reserved.
          </p>
          <p className="footer-credits">
            <Code2 className="icon-credits" /> Built with React, Custom CSS & Glassmorphism Design
          </p>
        </div>

        {/* Back to Top */}
        <button onClick={scrollToTop} className="footer-btn-top" title="Back to Top">
          <ChevronUp className="icon-up group-hover-bounce" />
        </button>
      </div>
    </footer>
  );
}
