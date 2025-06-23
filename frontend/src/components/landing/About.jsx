// src/components/landing/About.jsx
export default function About() {
  return (
    <section id="about" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-display text-3xl">Who we are?</h2>
          <p className="text-gray-700">
            Sri Lankan Tour Pal is the leading destination management company in Sri Lanka…
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-display text-xl">Where</h3>
            <p>7°35'14.1"N <br />80°28'33.5"E</p>
          </div>
          <div>
            <h3 className="font-display text-xl">When</h3>
            <p>Mon–Fri<br />09:00–17:00 (GMT+5:30)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
