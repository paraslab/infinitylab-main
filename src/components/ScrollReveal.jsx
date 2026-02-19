import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
          } else {
            entry.target.classList.remove("reveal-show"); // 👈 REVERSE
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    const elements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, a, button, li, label, small"
    );

    elements.forEach(el => {
      el.classList.add("reveal");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}




// 1 time reveal (no reverse)

// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollReveal() {
//   const location = useLocation();

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("reveal-show");
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.25 }
//     );

//     // ALL TEXT ELEMENTS
//     const textElements = document.querySelectorAll(
//       "h1, h2, h3, h4, h5, h6, p, span, a, button, li, label, small"
//     );

//     textElements.forEach(el => {
//       el.classList.add("reveal");
//       el.classList.remove("reveal-show");
//       observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, [location.pathname]);

//   return null;
// }
