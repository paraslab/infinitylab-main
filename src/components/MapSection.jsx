import React from "react";

export default function MapSection() {
  return (
    <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden mb-16  ">
      {/* Map iframe */}
      <iframe
        title="Infinity Energy Location Map"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d0!2d0!3d0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc08ea7d7c4f843da!2sInfinity%20Energy!5e0!3m2!1sen!2sin!4v1705050000000"
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />



      {/* Overall soft fade */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Top fade */}
      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#ffffff] to-transparent pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#ffffff] to-transparent pointer-events-none" />
    </section>
  );
}
