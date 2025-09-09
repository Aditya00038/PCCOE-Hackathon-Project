// src/lib/triageEngine.js

// Severity color mapping
export function severityBadgeClass(severity) {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-700 border border-red-200";
    case "Medium":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Low":
      return "bg-green-100 text-green-700 border border-green-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

// AI-like rule-based analyzer
export function analyzeSymptoms(text) {
  if (!text) return { severity: "Low", probableDiseases: [] };

  const input = text.toLowerCase();
  let severity = "Low";
  const probableDiseases = [];

  // High urgency keywords
  if (
    input.includes("chest pain") ||
    input.includes("severe bleeding") ||
    input.includes("unconscious") ||
    input.includes("difficulty breathing") ||
    input.includes("stroke") ||
    input.includes("seizure")
  ) {
    severity = "High";
    probableDiseases.push({ name: "Emergency Condition", priority: "High" });
  }

  // Medium urgency keywords
  else if (
    input.includes("shortness of breath") ||
    input.includes("persistent cough") ||
    input.includes("high fever") ||
    input.includes("severe headache") ||
    input.includes("dizziness") ||
    input.includes("abdominal pain")
  ) {
    severity = "Medium";
    probableDiseases.push({ name: "Needs Attention", priority: "Medium" });
  }

  // Low urgency (common issues)
  else if (
    input.includes("fever") ||
    input.includes("cold") ||
    input.includes("cough") ||
    input.includes("sore throat") ||
    input.includes("mild headache") ||
    input.includes("fatigue") ||
    input.includes("body ache")
  ) {
    severity = "Low";
    probableDiseases.push({ name: "Common Illness", priority: "Low" });
  }

  return { severity, probableDiseases };
}
