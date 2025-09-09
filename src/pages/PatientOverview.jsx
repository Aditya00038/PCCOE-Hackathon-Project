// src/pages/PatientOverview.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function PatientOverview() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDisease, setFilterDisease] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Departments (you can expand)
  const departments = ["General Medicine", "Cardiology", "Pulmonology", "Neurology", "Gastroenterology"];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(data);
      setFiltered(data);
    });
    return () => unsub();
  }, []);

  // Filtering logic
  useEffect(() => {
    let data = [...patients];

    if (filterDisease) {
      data = data.filter((p) =>
        p.possibleDiseases?.some((d) => d.toLowerCase().includes(filterDisease.toLowerCase()))
      );
    }

    if (filterDept) {
      data = data.filter((p) => p.department === filterDept);
    }

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [filterDisease, filterDept, search, patients]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Overview</h1>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Disease"
          value={filterDisease}
          onChange={(e) => setFilterDisease(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Filter by Department</option>
          {departments.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search patients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg flex-1"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Patient Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Triage Status</th>
              <th className="p-3">Appointment Date</th>
              <th className="p-3">Health Issues</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.department || "General Medicine"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      p.severity === "High"
                        ? "bg-red-500"
                        : p.severity === "Medium"
                        ? "bg-orange-400"
                        : "bg-green-500"
                    }`}
                  >
                    {p.severity} Urgency
                  </span>
                </td>
                <td className="p-3">
                  {p.appointmentDate
                    ? new Date(p.appointmentDate.toDate()).toLocaleString()
                    : "Pending"}
                </td>
                <td className="p-3">
                  {p.selectedSymptoms?.join(", ") || "N/A"}
                  {p.notes && <div className="text-gray-500 text-xs">{p.notes}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
