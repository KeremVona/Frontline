import React from "react";

export default function Header({ name }) {
  const currentDate = new Date();

  const dayOfWeek = currentDate.toLocaleString("en-us", { weekday: "long" }); // Day (e.g., Monday)
  const time = currentDate.toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }); // Time (e.g., 2:30 PM)

  let text = `Happy ${dayOfWeek}`;

  return (
    <h1 className="text-4xl p-4 font-semibold text-[#ffcc00]" id="header">
      {text}, {name}
    </h1>
  );
}
