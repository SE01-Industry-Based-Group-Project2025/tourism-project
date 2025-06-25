// src/components/landing/FAQ.jsx
import { useState } from "react";

// Inline SVG icons
const PlusIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const faqs = [
  {
    question: "Do I need a visa to enter Sri Lanka ?",
    answer: (
      <>
        <p>
          Yes, you will need a visa to enter Sri Lanka. In addition, if you intend visiting Sri Lanka on
          a short visit, you will need to obtain an Electronic Travel Authorization (ETA) prior to arrival.
        </p>
        <p>
          The Sri Lanka ETA is an electronic travel authorization for travelers who wish to visit Sri
          Lanka for various purposes including tourism, transit and business. The ETA is issued through
          an online application system.
        </p>
        <p>
          The Sri Lanka ETA can be obtained by completing a simple online application form. Applicants
          must provide their personal details, travel information and passport data.
        </p>
        <a
          href="https://www.eta.gov.lk/slvisa/visainfo/center.jsp?locale=en_US#"
          className="mt-2 inline-block text-red-500 font-medium"
          target="_blank"
          rel="noreferrer"
        >
          Electronic Travel Authorization System
        </a>
      </>
    ),
  },
  {
    question: "When is the best time to travel ?",
    answer: (
      <>
        <p>
          Climatically, the best & driest seasons are from December to March on the West & South Coasts
          and in the hill country, and from May to September in the East Coast. Sri Lanka is subject to
          two monsoons, the rainy season in the East coast is the dry season in the south west coast &
          vice versa. This means Sri Lanka is a year around destination, and there is always a ‘right’
          season somewhere in the island.
        </p>
        <p>
          Out of season travel has its advantages, not only do the crowds go away, but many airfares &
          accommodation prices too go down, with many special offers thrown in. On the coast the average
          temperature is about 27° C. The temperature rapidly falls with altitude. At Kandy (altitude
          450m) the average temperature is 20° C and at Nuwara Eliya (altitude 1890m) it’s down to around
          16°C.
        </p>
      </>
    ),
  },
  {
    question: "What is the currency used in Sri Lanka ?",
    answer: (
      <p>
        The Sri Lankan currency is the Rupee (Rs), divided into 100 cents. Notes come in denominations of
        10, 20, 50, 100, 200, 500, 1000 & 2000. Breaking down larger notes can sometimes be a problem
        (especially 500, 1000 or 2000). Hotels and other tourist establishments will quote you the price
        in US$ or Euro and collect in Rupees at the prevailing exchange rate.
      </p>
    ),
  },
  {
    question: "Are credit cards widely accepted ?",
    answer: (
      <p>
        Credit Cards are widely used and accepted by local establishments (even in small towns). The most
        widely used card types are Visa and MasterCard, with Amex to a lesser extent. It would be a
        convenient option to use your Credit Card (valid for international use) whenever possible.
      </p>
    ),
  },
  {
    question: "How about the telephone facilities in country ?",
    answer: (
      <p>
        Telephone facilities are available extensively throughout the country. There are many telephone
        booths which accept coins, but the clarity and talk times may be short. Telephone bureaus are quite
        common with most offering IDD and internet facilities. Some offer the cheaper net-to-phone option,
        but quality is not always reliable. IDD facilities are available in most tourist hotels.
      </p>
    ),
  },
  {
    question: "Can I obtain vegetarian food ?",
    answer: (
      <p>
        Most large hotels and restaurants have a ‘vegetarian section’ in the menu. The smaller local ‘rice
        and curry’ restaurants may say the food is vegetarian but include a serving of fried fish or
        sprats (anchovies). The ‘South Indian’ vegetarian restaurants are 100% vegetarian.
      </p>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark mb-8">F.A.Q</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <span className={`text-lg font-medium ${isOpen ? "text-red-500" : "text-dark"}`}>
                    {faq.question}
                  </span>
                  {isOpen ? <MinusIcon /> : <PlusIcon />}
                </button>
                {isOpen && <div className="pb-4 text-gray-700">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
