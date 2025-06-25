// src/components/landing/Gallery.jsx
import { useState, useRef, useEffect } from "react";

const images = [1,2,3,4,5,6,7].map(
  (i) => `https://www.sltourpal.com/img/gallery/${i}.jpg`
);

export default function Gallery() {
  const slidesToShow = 5;
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxSlide = Math.max(0, images.length - slidesToShow);
  const centerOffset = Math.floor(slidesToShow / 2);
  const trackRef = useRef(null);

  // Scroll the track when currentSlide changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.clientWidth / slidesToShow;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }, [currentSlide]);

  const goPrev = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const goNext = () => setCurrentSlide((s) => Math.min(maxSlide, s + 1));

  return (
    <section id="gallery" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-display text-navy mb-2 uppercase">Gallery</h2>
        <p className="text-gray-500 mb-6">Check our gallery from the recent tours</p>

        <div className="relative">
          {/* Carousel Frame */}
          <div className="overflow-hidden">
            {/* Track */}
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-in-out"
            >
              {images.map((src, idx) => {
                const centerIdx = currentSlide + centerOffset;
                const isCenter = idx === centerIdx;

                return (
                  <div
                    key={src}
                    className="flex-shrink-0 p-2"
                    style={{ width: `${100 / slidesToShow}%` }}
                  >
                    <img
                      src={src}
                      alt={`Tour gallery ${idx + 1}`}
                      className={`
                        w-full h-48 object-cover rounded-lg
                        transition-transform duration-300
                        ${isCenter 
                          ? "scale-105 border-4 border-red-500 shadow-xl" 
                          : "opacity-80 hover:opacity-100"
                        }
                      `}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === maxSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg disabled:opacity-50"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          {images.map((_, idx) => {
            const centerIdx = currentSlide + centerOffset;
            const isActive = idx === centerIdx;
            return (
              <button
                key={idx}
                onClick={() => {
                  const wantSlide = idx - centerOffset;
                  setCurrentSlide(Math.min(maxSlide, Math.max(0, wantSlide)));
                }}
                className={`
                  w-3 h-3 rounded-full transition
                  ${isActive ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"}
                `}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
