// src/components/landing/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-dark text-light py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <img src="/assets/logo_letters.png" className="h-8 mb-4" alt="" />
          <p>
            Our staff is passionate, trained and experienced tour guides…  
          </p>
        </div>
        <div>
          <h4 className="font-display mb-2">Quick Links</h4>
          <ul className="space-y-1">
            {["Home","About","Packages","Gallery","FAQ","Contact"].map((t)=>(
              <li key={t}><a href={`#${t.toLowerCase()}`} className="hover:text-primary">{t}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display mb-2">Useful Links</h4>
          <ul className="space-y-1 text-gray-400">
            <li><a href="https://www.eta.gov.lk" target="_blank">ETA System</a></li>
            <li><a href="http://www.immigration.gov.lk" target="_blank">Immigration Dept.</a></li>
            <li><a href="https://complaints.sltda.gov.lk" target="_blank">Complaints</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display mb-2">Connect</h4>
          <div className="flex space-x-4 text-2xl">
            <a href="https://facebook.com/sltourpal" target="_blank">👍</a>
            <a href="https://instagram.com/sltourpal" target="_blank">📸</a>
            <a href="#">🐦</a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">
        © {new Date().getFullYear()} SL Tour Pal — All Rights Reserved
      </div>
    </footer>
  );
}
