// src/components/landing/Intro.jsx
import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";

export default function Intro() {
  // 1. put your three URLs in an array
  const slides = [
    "https://images.pexels.com/photos/321569/pexels-photo-321569.jpeg",
    "https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg",
    "https://images.pexels.com/photos/2937148/pexels-photo-2937148.jpeg",
  ];

  // 2. track which slide is currently visible
  const [current, setCurrent] = useState(0);

  // 3. every 3 seconds advance to the next slide (wrapping around)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 9000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      id="home"
      className="relative h-screen flex flex-col items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url("${slides[current]}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-sl-navy/75" />

      <div className="relative z-10 space-y-6 max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-script">
          A unique <span className="text-sl-red">Sri Lankan</span> touch&nbsp;!
        </h1>

        <div className="flex items-center justify-center space-x-6">
          <a
            href="https://www.youtube.com/watch?v=sChXehSYd4k&t=3s"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-20 h-20 rounded-full bg-sl-red/90 hover:bg-sl-red transition-shadow shadow-lg"
          >
            <FaPlay className="text-2xl text-white" />
          </a>
        </div>

        <a
          href="#about"
          className="inline-block px-6 py-3 border-2 border-sl-red rounded-full font-display hover:bg-sl-red hover:text-white transition"
        >
          About Us
        </a>
      </div>
    </section>
  );
}
