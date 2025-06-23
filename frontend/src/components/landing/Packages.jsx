// src/components/landing/Packages.jsx
const packages = [
  {
    img: "/assets/packages/magical-sl.jpg",
    title: "Magical Sri Lanka with authentic food",
    desc: "10 Days Exploration…",
    stars: 5,
  },
  {
    img: "/assets/packages/ancient-sl.jpg",
    title: "Ancient Sri Lanka with Silk Shopping",
    desc: "7 Nights…",
    stars: 4.5,
  },
  {
    img: "/assets/packages/adventure-sl.jpg",
    title: "Adventures in Sri Lanka",
    desc: "11 Days…",
    stars: 4,
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl text-center mb-8">Packages</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div key={p.title} className="bg-white rounded-xl shadow p-4">
              <img src={p.img} alt={p.title} className="rounded-lg mb-4" />
              <h3 className="font-display text-xl mb-2">{p.title}</h3>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(p.stars) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c...z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
