// src/components/landing/About.jsx
export default function About() {
  return (
    <section id="about" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-3xl font-display text-navy">Who we are?</h2>
          <p className="text-slate-700">
            Sri Lankan Tour Pal is the leading destination management company in Sri Lanka...
          </p>
        </div>
        <div className="space-y-6 text-slate-700">
          <div>
            <h3 className="font-medium">WHERE</h3>
            <p>7°35'14.1"N 80°28'33.5"E</p>
          </div>
          <div>
            <h3 className="font-medium">WHEN</h3>
            <p>Mon–Fri • 09:00 – 17:00 (GMT +5:30)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
