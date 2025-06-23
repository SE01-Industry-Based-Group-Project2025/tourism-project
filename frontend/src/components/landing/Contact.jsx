// src/components/landing/Contact.jsx
export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-display text-3xl">Contact Us</h2>
          <p>Feel free to submit your query.</p>
          {[
            { icon: "📍", label: "Address", info: "Dambulla Road, Gokarella, Sri Lanka" },
            { icon: "📞", label: "Phone", info: "+94 37 430 2333" },
            { icon: "✉️", label: "Email", info: "info@sltourpal.com" },
          ].map((c) => (
            <div key={c.label} className="flex items-start space-x-3">
              <div className="text-2xl">{c.icon}</div>
              <div>
                <h4 className="font-medium">{c.label}</h4>
                <p>{c.info}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
          <input type="text" placeholder="Subject" className="w-full p-3 border rounded" />
          <textarea rows="5" placeholder="Message" className="w-full p-3 border rounded" />
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
