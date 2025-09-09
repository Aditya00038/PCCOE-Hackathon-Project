import React, { useState, useEffect } from "react";

// ⏱️ Countdown timer for waiting times
export function CountdownTimer({ minutes }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <span className="text-xs text-gray-700 font-medium">
      {timeLeft > 0 ? `⏳ ${formatTime(timeLeft)}` : "✅ Ready"}
    </span>
  );
}

// 📊 Stats for hospital dashboard
export function DashboardStats({ patients }) {
  const counts = { High: 0, Medium: 0, Low: 0 };
  patients.forEach((p) => {
    counts[p.severity] = (counts[p.severity] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow-md text-center">
        <h3 className="font-bold text-lg">High</h3>
        <p className="text-2xl">{counts.High}</p>
      </div>
      <div className="bg-orange-100 text-orange-700 p-4 rounded-xl shadow-md text-center">
        <h3 className="font-bold text-lg">Medium</h3>
        <p className="text-2xl">{counts.Medium}</p>
      </div>
      <div className="bg-green-100 text-green-700 p-4 rounded-xl shadow-md text-center">
        <h3 className="font-bold text-lg">Low</h3>
        <p className="text-2xl">{counts.Low}</p>
      </div>
    </div>
  );
}

// 🤖 Symptom suggestion for patients
export function SymptomSuggestions({ onSelect }) {
  const suggestions = [
    "Chest pain",
    "High fever",
    "Cough",
    "Headache",
    "Difficulty breathing",
    "Fracture",
    "Abdominal pain",
    "Dizziness",
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(s)}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 text-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// 🩺 AI-lite triage logic
export function classifySeverity(symptoms) {
  const text = symptoms.toLowerCase();
  if (text.includes("chest pain") || text.includes("difficulty breathing") || text.includes("fracture")) {
    return "High";
  }
  if (text.includes("fever") || text.includes("headache") || text.includes("abdominal")) {
    return "Medium";
  }
  return "Low";
}

// 🎨 Badge color helper
export function getBadgeColor(severity) {
  switch (severity) {
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-orange-500 text-white";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}
