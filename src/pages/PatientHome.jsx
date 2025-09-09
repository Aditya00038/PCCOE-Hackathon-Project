// src/pages/PatientForm.jsx
import React, { useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { analyzeSymptoms, severityBadgeClass } from "../lib/triageEngine";
import { estimateWaitMinutes, formatWait } from "../lib/waitTime";

export default function PatientForm() {
  const { logout, currentUser } = useAuth();
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    medicalHistory: [],
    symptoms: "",
  });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // ✅ Updated toggleHistory with "None" handling
  const toggleHistory = (v) => {
    setFormData((p) => {
      if (v === "None") {
        return {
          ...p,
          medicalHistory: p.medicalHistory.includes("None") ? [] : ["None"],
        };
      }
      return {
        ...p,
        medicalHistory: p.medicalHistory.includes(v)
          ? p.medicalHistory.filter((i) => i !== v)
          : [...p.medicalHistory.filter((i) => i !== "None"), v],
      };
    });
  };

  // AI-like triage
  const analysis = useMemo(() => analyzeSymptoms(formData.symptoms), [formData.symptoms]);
  const previewWait = formatWait(estimateWaitMinutes(analysis.severity, 2));

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.symptoms.trim()) {
      setStatus("⚠️ Please describe your symptoms.");
      return;
    }
    const payload = {
      ...formData,
      userId: currentUser?.uid || null,
      severity: analysis.severity,
      probableDiseases: analysis.probableDiseases,
      status: "Pending",
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "appointments"), payload);
      setStatus("✅ Appointment submitted successfully!");
      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        emergencyContact: "",
        medicalHistory: [],
        symptoms: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to submit. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            HealthFirst — Patient Portal
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <form
            onSubmit={submit}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6 space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Book Appointment
            </h2>
            <p className="text-sm text-gray-500">
              Please fill in your details. This will help us provide the best care.
            </p>

            {/* Personal Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  placeholder="28"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 90000 00000"
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Emergency Contact
                </label>
                <input
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Parent / Spouse contact"
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Medical History */}
            <div>
              <p className="text-sm font-medium mb-2">Medical History</p>
              <div className="flex flex-wrap gap-2">
                {["None", "Diabetes", "Hypertension", "Asthma", "Allergy"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleHistory(d)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      formData.medicalHistory.includes(d)
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium">Symptoms</label>
              <textarea
                rows={4}
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., fever and dry cough since yesterday"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Submit
              </button>
            </div>
            {status && (
              <div className="text-center text-sm text-gray-600">{status}</div>
            )}
          </form>

          {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-3">Live Analysis</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Predicted Severity</span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${severityBadgeClass(
                  analysis.severity
                )}`}
              >
                {analysis.severity}
              </span>
            </div>

            {analysis.probableDiseases.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-gray-500">Possible conditions:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.probableDiseases.slice(0, 5).map((d) => (
                    <span
                      key={d.name}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${severityBadgeClass(
                        d.priority
                      )}`}
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-3">
                No strong matches yet. Add more details.
              </p>
            )}

            <div className="mt-4 text-xs text-gray-600">
              Estimated wait: <strong>{previewWait}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
