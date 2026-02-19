import React from "react";

const cards = [
  { title: "Users", value: "120" },
  { title: "Orders", value: "85" },
  { title: "Revenue", value: "$4,200" },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
