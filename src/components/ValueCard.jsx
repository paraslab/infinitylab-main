import React from "react";
import {
  Lightbulb,
  Leaf,
  ShieldCheck,
  Users,
  Lock,
} from "lucide-react";

export default function CoreValues() {
  const values = [
    {
      title: "Innovation",
      description:
        "We are committed to continuous innovation, advancing energy storage technologies while reducing environmental impact.",
      icon: <Lightbulb size={22} />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Sustainability",
      description:
        "We prioritize the planet’s long-term health by adopting eco-friendly technologies and promoting renewable energy solutions.",
      icon: <Leaf size={22} />,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Integrity",
      description:
        "Every product reflects our commitment to excellence—from design and production to customer support.",
      icon: <ShieldCheck size={22} />,
      bg: "bg-gray-50",
      iconBg: "bg-gray-200",
      iconColor: "text-gray-700",
    },
    {
      title: "Social Impact",
      description:
        "We strive to expand access to clean energy, empower communities, and support sustainable development.",
      icon: <Users size={22} />,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Security",
      description:
        "We ensure safety and resilience through advanced protection technologies, strict testing, and global standards.",
      icon: <Lock size={22} />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {values.map((item, index) => (
          <div
            key={index}
            className={`
              ${item.bg}
              rounded-2xl
              p-8
              shadow-[0_20px_40px_rgba(0,0,0,0.08)]
              transition-all
              hover:-translate-y-1
            `}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`
                  w-12 h-12
                  rounded-full
                  flex items-center justify-center
                  ${item.iconBg}
                  ${item.iconColor}
                `}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
