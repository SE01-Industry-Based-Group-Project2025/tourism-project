// src/components/landing/Gallery.jsx
export default function Gallery() {
  const images = [
    "/assets/gallery/1.jpg",
    "/assets/gallery/2.jpg",
    "/assets/gallery/3.jpg",
    "/assets/gallery/4.jpg",
    "/assets/gallery/5.jpg",
    "/assets/gallery/6.jpg",
    "/assets/gallery/7.jpg",
  ];
  return (
    <section id="gallery" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl text-center mb-8">Gallery</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src) => (
            <img key={src} src={src} alt="" className="rounded-lg object-cover h-48 w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
