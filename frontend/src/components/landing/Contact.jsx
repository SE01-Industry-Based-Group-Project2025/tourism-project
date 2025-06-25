// src/components/landing/Contact.jsx
export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-display text-navy mb-6">Contact Us</h2>
          <ul className="space-y-6 text-slate-700">
            <li>
              <strong>Address:</strong>{" "}
              <a href="https://goo.gl/maps/BeJR3QfxNNP2" className="underline">
                Dambulla Road, Gokarella, Sri Lanka
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:+94374302333" className="underline">
                +94 37 430 2333
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@sltourpal.com" className="underline">
                info@sltourpal.com
              </a>
            </li>
          </ul>
        </div>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full p-3 border rounded"
          />
          <textarea
            rows={4}
            placeholder="Message"
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gold text-white rounded hover:bg-opacity-90 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
