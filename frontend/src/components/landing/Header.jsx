// src/components/landing/Header.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#intro" className="flex items-center">
          <img src="/assets/logo_letters.png" className="h-8" alt="SL Tour Pal" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 font-display text-gray-700">
          {["Home", "About", "Packages", "Gallery", "FAQ", "Contact"].map((section) => (
            <a
              key={section}
              href={`#${section.toLowerCase()}`}
              className="hover:text-primary capitalize"
            >
              {section}
            </a>
          ))}

          {/* Auth buttons */}
          <Link
            to="/login"
            className="px-4 py-2 font-medium text-white bg-primary rounded hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 font-medium text-primary border-2 border-primary rounded hover:bg-primary hover:text-white"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white shadow-lg">
          {["home", "about", "packages", "gallery", "faq", "contact"].map((sec) => (
            <a
              key={sec}
              href={`#${sec}`}
              className="block px-6 py-3 text-gray-700 hover:bg-light capitalize"
              onClick={() => setOpen(false)}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </a>
          ))}

          {/* Auth buttons (mobile) */}
          <Link
            to="/login"
            className="block px-6 py-3 text-white bg-primary text-center font-medium hover:bg-primary/90"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-6 py-3 text-primary border border-primary text-center font-medium hover:bg-primary hover:text-white"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
