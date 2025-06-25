// src/components/landing/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const sections = ["home","about","packages","gallery","faq","contact"];

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* logo + text */}
        <a href="#home" className="flex items-center space-x-2">
          <img
            src="https://www.sltourpal.com/img/logo_letters.png"
            className="h-8"
            alt="SLTourPal logo"
          />
          <span className="text-xl font-display text-sl-navy">SLTourPal</span>
        </a>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center space-x-8 text-slate-700 font-display">
          {sections.map(s => (
            <a
              key={s}
              href={`#${s}`}
              className="hover:text-sl-red transition"
            >
              {s[0].toUpperCase() + s.slice(1)}
            </a>
          ))}
          <Link
            to="/login"
            className="px-4 py-2 border border-sl-red text-red-600 hover:bg-sl-red hover:text-white rounded transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-sl-red text-red-600 hover:bg-opacity-90 rounded transition"
          >
            Sign Up
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg">
          {sections.map(s => (
            <a
              key={s}
              href={`#${s}`}
              className="block px-6 py-3 text-slate-700 hover:bg-light"
              onClick={() => setOpen(false)}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </a>
          ))}
          <Link
            to="/login"
            className="block px-6 py-3 text-sl-red hover:bg-light"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-6 py-3 bg-red-50 text-red-950 hover:bg-opacity-90"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
