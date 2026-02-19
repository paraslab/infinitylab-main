import React from "react";

const certifications = [
  {
    title: "Product Conformity Certificate",
    image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80&auto=format&fit=crop",
  //  link: "https://example.com/certificate-1.pdf",
  },
  {
    title: "Importer Exporter Code",
    image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80&auto=format&fit=crop",
//    link: "https://example.com/certificate-2.pdf",
  },
  {
    title: "Certificate of Registration",
    image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80&auto=format&fit=crop",
//link: "https://example.com/certificate-3.pdf",
  },
];

export default function Certifications() {
  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-16">
          Our <span className="text-green-600">Certification</span>
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 rounded-2xl">
          {certifications.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div className="
                bg-white p-3 rounded-2xl
                shadow-sm border
                transition-all duration-300
                group-hover:-translate-y-2
                group-hover:shadow-xl
              ">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
