import diseases from "../data/diseaseData";

export function predictSeverity(userInput) {
  const input = userInput.toLowerCase();
  let matchedSymptoms = [];
  let score = 0;

  diseases.forEach(disease => {
    disease.symptoms.forEach(sym => {
      if (sym.keywords.some(kw => input.includes(kw))) {
        matchedSymptoms.push({ disease: disease.name, symptom: sym.symptom, priority: sym.priority });

        // Score calculation
        if (sym.priority === "High") score += 3;
        if (sym.priority === "Medium") score += 2;
        if (sym.priority === "Low") score += 1;
      }
    });
  });

  let severity = "Low";
  if (score >= 6) severity = "Critical";
  else if (score >= 4) severity = "High";
  else if (score >= 2) severity = "Medium";

  return {
    severity,
    matchedSymptoms,
    possibleDiseases: [...new Set(matchedSymptoms.map(m => m.disease))],
    waitTime: estimateWaitTime(severity),
  };
}

function estimateWaitTime(severity) {
  if (severity === "Critical") return "Immediate";
  if (severity === "High") return "15 min";
  if (severity === "Medium") return "1 hour";
  return "2–3 hours";
}
