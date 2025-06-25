// src/components/landing/Packages.jsx
const data = [
  {
    title: "Magical Sri Lanka with authentic food",
    stars: 5,
    desc: "10 Days Exploration of Sri Lankan Culture and Authentic Sri Lankan Cuisine",
    img: "https://www.sltourpal.com/img/packages/magical-sl.jpg",
  },
  {
    title: "Ancient Sri Lanka with Silk Shopping",
    stars: 4.5,
    desc: "Spend 7 Nights in Sri Lanka exploring its proud history",
    img: "https://www.sltourpal.com/img/packages/ancient-sl.jpg",
  },
  {
    title: "Adventures in Sri Lanka",
    stars: 4,
    desc: "11 Days of Sri Lankan Adventures including Scenic Sri Lankan Peaks",
    img: "https://www.sltourpal.com/img/packages/adventure-sl.jpg",
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-display text-navy mb-6">Packages</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.map((p) => (
            <div key={p.title} className="bg-white shadow rounded overflow-hidden">
              <img src={p.img} alt={p.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="font-display text-xl text-navy">{p.title}</h3>
                <div className="flex mt-2 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i + 0.5 < p.stars ? "" : i + 1 > p.stars ? "text-slate-300" : "text-gold"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.339 2.163 10.661 2.163 10.951 2.927l.933 2.367a1 1 0 00.95.69h2.486c.969 0 1.371 1.24.588 1.81l-2.012 1.462a1 1 0 00-.364 1.118l.933 2.367c.29.764-.637 1.397-1.29.93L10 12.347l-2.012 1.462c-.653.467-1.58-.166-1.29-.93l.933-2.367a1 1 0 00-.364-1.118L5.245 7.794c-.783-.57-.38-1.81.588-1.81h2.486a1 1 0 00.95-.69l.933-2.367z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-slate-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
