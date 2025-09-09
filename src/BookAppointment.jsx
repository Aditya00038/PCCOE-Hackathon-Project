import React, { useState } from "react";
import { predictSeverity } from "../utils/severityPredictor";

export default function BookAppointment() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    if (symptoms.trim() !== "") {
      const analysis = predictSeverity(symptoms);
      setResult(analysis);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      <p className="text-gray-600 mb-2">Tell us about yourself and what you’re feeling.</p>
      
      <textarea
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Describe your symptoms (e.g., fever and dry cough since yesterday)"
        rows="4"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button 
        onClick={handleCheck}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Analyze Symptoms
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold">Predicted Severity: 
            <span className={
              result.severity === "Low" ? "text-green-600" :
              result.severity === "Medium" ? "text-yellow-600" :
              result.severity === "High" ? "text-red-600" :
              "text-black"
            }>
              {" "}{result.severity}
            </span>
          </h3>

          <p className="mt-2 text-gray-600">Estimated Wait: {result.waitTime}</p>

          {result.possibleDiseases.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Possible Conditions:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {result.possibleDiseases.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}

          {result.severity === "Low" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                Looks mild. You can try rest, hydration, and over-the-counter medication.  
                If symptoms worsen, please come in.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
