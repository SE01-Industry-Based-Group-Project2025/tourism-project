// src/components/landing/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-light">
      <div className="py-12 max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <img
            src="https://www.sltourpal.com/img/logo_letters.png"
            className="h-8"
            alt="SL Tour Pal"
          />
          <p className="text-slate-400">
            Our staff is passionate… a modern, clean fleet of vehicles to transport you in comfort and safety.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-slate-400">
            {["Home","About","Packages","Gallery","FAQ","Contact"].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Useful Links</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="https://www.eta.gov.lk/…" className="hover:text-gold">Electronic Travel Authorization</a></li>
            <li><a href="http://www.immigration.gov.lk/" className="hover:text-gold">Department of Immigration</a></li>
            <li><a href="https://complaints.sltda.gov.lk/" className="hover:text-gold">Complaints</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Connect With Us</h4>
          <div className="flex space-x-4 text-2xl">
            <a href="https://facebook.com/sltourpal" className="hover:text-gold">
              <i className="fa fa-facebook-square"></i>
            </a>
            <a href="https://instagram.com/sltourpal" className="hover:text-gold">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-gold">
              <i className="fa fa-tripadvisor"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-slate-500">
        © Copyright Tour Pal Lanka (Pvt) Ltd — Powered by SLTourPal
      </div>
    </footer>
  );
}
