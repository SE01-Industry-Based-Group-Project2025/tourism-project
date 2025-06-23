// src/components/landing/FAQ.jsx
import { useState } from "react";

const faqs = [
  { q: "Do I need a visa…?", a: "Yes, you will need an ETA…" },
  { q: "Best time to travel?", a: "Dec–Mar on west coast… May–Sept on east…" }
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-3xl text-center mb-8">F.A.Q</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border rounded-lg">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-4 py-3 flex justify-between items-center font-medium"
              >
                {f.q}
                <span>{open === i ? "–" : "+"}</span>
              </button>
              {open === i && <div className="px-4 py-2 text-gray-700">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
