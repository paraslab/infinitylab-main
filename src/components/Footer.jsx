import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram,FaLinkedinIn  } from "react-icons/fa";

export default function Footer() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;

    if (!leftEl || !rightEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === leftEl) {
            if (entry.isIntersecting) setShowLeft(true);
          }
          if (entry.target === rightEl) {
            if (entry.isIntersecting) setShowRight(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(leftEl);
    observer.observe(rightEl);

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative py-20 px-4 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://framerusercontent.com/assets/GYCz6Ymt7idciwLxF8zcjDAuRw.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card */}
        <div
          ref={leftRef}
          className={`
    bg-[#FFFAFA] rounded-3xl sm:rounded-3xl
    p-6 sm:p-10
    flex flex-col justify-between
    shadow-xl
    transform transition-all duration-[1600ms] ease-out
    ${showLeft
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-[0.98]"
            }
  `}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 sm:mb-10">
            <div className="w-10 h-10 rounded-3xl bg-[#2F8F6A] flex items-center justify-center text-lg">
              ⚡
            </div>
            <span className="text-sm font-medium text-gray-700">
              Infinity Energy
            </span>
          </div>

          {/* Content */}
          <div>
            <h2
              className="
        text-2xl sm:text-3xl md:text-4xl
        font-semibold text-gray-900
        leading-snug
      "
            >
              We believe the future of energy begins with smarter, sustainable systems.
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">
              Infinity Energy is committed to advancing India’s clean energy ecosystem —
              <br />
              delivering innovative battery and energy storage solutions that strengthen
              infrastructure, reliability, and global competitiveness.
            </p>
          </div>

          {/* Footer */}
          <p
            className="
      mt-8 sm:mt-10
      text-xs sm:text-sm
      text-gray-400
      text-center sm:text-left
    "
          >
            © 2026 Infinity Energy. All Rights Reserved.
            <br />
            Paras
          </p>
        </div>


        {/* Right Card */}
        <div
          ref={rightRef}
          className={`
            bg-[#FFFAFA] rounded-3xl p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10
            transform transition-all duration-[1600ms] ease-out delay-200
            ${showRight
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-[0.98]"
            }
          `}
        >
          {/* Pages */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pages</h3>
            <div className="grid grid-cols-2 gap-3 text-gray-600">
              <a href="home">Home</a>
              <a href="blog">Blog</a>
              <a href="about">About</a>
              <a href="productpage">Product</a>
              <a href="contact" className="underline">
                Contact
              </a>

            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Address</h3>
            <p className="text-gray-600 mb-4">
            208, Divyamangal Complex, Beside Sutex Bank, GIDC Pandesara, Surat - 394221
            </p>
            {/* <p className="text-gray-600">
              144 Creative Street, Suite 456, New York, NY 10001, USA
            </p> */}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-600">Info@infinityenergy.xyz</p>
            <p className="text-gray-600 mt-2">+91 88661 89016</p>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Social media</h3>
            <div className="flex gap-4 text-xl text-gray-700">
              <a href="#" className="hover:text-lime-500">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-lime-500">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-lime-500">
                {/* <FaYoutube /> */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
