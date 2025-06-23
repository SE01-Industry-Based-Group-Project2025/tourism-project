// src/components/landing/Intro.jsx
export default function Intro() {
  return (
    <section
      id="intro"
      className="h-screen bg-[url('/assets/intro-bg.jpg')] bg-cover bg-center flex flex-col items-center justify-center text-center text-white"
    >
      <h1 className="font-display text-6xl md:text-8xl drop-shadow-lg">SL Tour Pal</h1>
      <p className="mt-4 font-handwriting text-3xl md:text-4xl drop-shadow-md">
        A unique <span className="text-primary">Sri Lankan</span> touch!
      </p>
      <div className="mt-8 flex space-x-4">
        <a
          href="https://www.youtube.com/watch?v=sChXehSYd4k"
          className="px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-secondary transition"
          target="_blank"
        >
          ▶ Watch Video
        </a>
        <a
          href="#about"
          className="px-6 py-3 bg-primary rounded-full hover:bg-primary/90 transition"
        >
          About Us
        </a>
      </div>
    </section>
  );
}
