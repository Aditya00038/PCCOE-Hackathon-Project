// src/pages/HospitalDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import SeverityBadge from "../components/SeverityBadge";
import { estimateWaitMinutes, formatWait } from "../lib/waitTime";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─────────────────────────────────────────────
// constants
const PIE_COLORS = ["#16a34a", "#f59e0b", "#ef4444"]; // High, Medium, Low
const sevOrder = { High: 0, Medium: 1, Low: 2 };

// ─────────────────────────────────────────────
// Seed doctors if none exist (runs once)
async function seedDoctorsIfEmpty() {
  const snap = await getDocs(collection(db, "doctors"));
  if (snap.empty) {
    const seed = [
      { name: "Dr. Smith", specialization: "Cardiology" },
      { name: "Dr. Lee", specialization: "Pulmonology" },
      { name: "Dr. Patel", specialization: "General Medicine" },
      { name: "Dr. Verma", specialization: "Internal Medicine" },
    ];
    await Promise.all(seed.map((d) => addDoc(collection(db, "doctors"), d)));
  }
}

// helpers
function fmtDate(ts) {
  if (!ts) return "-";
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleString();
}

export default function HospitalDashboard() {
  const { logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  // manual add form
  const [newP, setNewP] = useState({
    name: "",
    symptoms: "",
    severity: "Low",
    appointmentAt: "",
  });

  // fetch doctors and listen to patients
  useEffect(() => {
    seedDoctorsIfEmpty();

    (async () => {
      const dSnap = await getDocs(collection(db, "doctors"));
      setDoctors(dSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();

    const qRef = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(qRef, async (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // auto-assign missing data (doctor + wait time)
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        const needsDoctor = !p.assignedDoctor && doctors.length > 0;
        const needsWait = !p.waitMinutes && p.severity;

        if (needsDoctor || needsWait) {
          try {
            const sameOrHigherAhead = list.filter(
              (x) =>
                (sevOrder[x.severity ?? "Low"] <= sevOrder[p.severity ?? "Low"]) &&
                (x.createdAt?.seconds ?? 0) < (p.createdAt?.seconds ?? 0)
            ).length;

            const wait = needsWait
              ? estimateWaitMinutes(p.severity, sameOrHigherAhead)
              : p.waitMinutes;

            let docToAssign = p.assignedDoctor;
            if (needsDoctor) {
              const idx = i % doctors.length; // simple round-robin
              docToAssign = { id: doctors[idx].id, name: doctors[idx].name };
            }

            await updateDoc(doc(db, "appointments", p.id), {
              assignedDoctor: docToAssign || null,
              waitMinutes: wait,
              waitTime: formatWait(wait),
              updatedAt: serverTimestamp(),
            });
          } catch (e) {
            // race conditions are acceptable for hackathon
            console.warn("Auto-update skipped for", p.id, e.message);
          }
        }
      }

      // sort by severity then createdAt
      const sorted = [...list].sort((a, b) => {
        const s = sevOrder[a.severity ?? "Low"] - sevOrder[b.severity ?? "Low"];
        return s !== 0 ? s : (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);
      });
      setPatients(sorted);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors.length]);

  const addManual = async (e) => {
    e.preventDefault();
    if (!newP.name || !newP.symptoms) return;
    setAdding(true);
    try {
      await addDoc(collection(db, "appointments"), {
        name: newP.name,
        symptoms: newP.symptoms,
        severity: newP.severity,
        appointmentAt: newP.appointmentAt || null,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      setNewP({ name: "", symptoms: "", severity: "Low", appointmentAt: "" });
    } catch (e2) {
      alert("Failed to add patient");
      console.error(e2);
    } finally {
      setAdding(false);
    }
  };

  // quick actions
  const setStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      alert("Failed to update status");
      console.error(e);
    }
  };

  // derived data
  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.symptoms?.toLowerCase().includes(q) ||
        p.assignedDoctor?.name?.toLowerCase().includes(q)
    );
  }, [patients, search]);

  const urgencyData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    for (const p of patients) counts[p.severity ?? "Low"]++;
    return [
      { name: "High Urgency", value: counts.High },
      { name: "Medium Urgency", value: counts.Medium },
      { name: "Low Urgency", value: counts.Low },
    ];
  }, [patients]);

  const volumeData = useMemo(() => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);
    patients.forEach((p) => {
      const ts = p.createdAt?.seconds;
      if (!ts) return;
      const idx = (new Date(ts * 1000).getDay() + 6) % 7; // Monday=0
      counts[idx]++;
    });
    return day.map((d, i) => ({ day: d, volume: counts[i] }));
  }, [patients]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r bg-white">
        <div className="px-4 py-4 flex items-center gap-3 border-b">
          <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center text-white font-bold">HF</div>
          <div>
            <p className="text-xs text-slate-500 leading-tight">Hospital Admin</p>
            <h1 className="font-semibold text-slate-800">CareHub</h1>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {["Dashboard", "Patients", "Appointments", "Billing", "Settings"].map((item, i) => (
            <button
              key={item}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 ${
                i === 0 ? "bg-slate-100 font-semibold text-slate-800" : "text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-3">
          <button onClick={logout} className="w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Hospital Dashboard</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients"
              className="w-64 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
          {/* Patient Volume */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-4">
            <p className="font-semibold text-slate-800 mb-4">Patient Volume</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="volume" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Urgency Levels */}
          <div className="bg-white border rounded-2xl p-4">
            <p className="font-semibold text-slate-800 mb-4">Urgency Levels</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urgencyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Manual Add Card */}
          <div className="lg:col-span-3 bg-white border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-800">Add Patient Manually</p>
            </div>
            <form onSubmit={addManual} className="grid md:grid-cols-5 gap-3">
              <input
                className="rounded-xl border-slate-200 md:col-span-1"
                placeholder="Patient name"
                value={newP.name}
                onChange={(e) => setNewP((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="rounded-xl border-slate-200 md:col-span-2"
                placeholder="Symptoms / notes"
                value={newP.symptoms}
                onChange={(e) => setNewP((p) => ({ ...p, symptoms: e.target.value }))}
              />
              <select
                className="rounded-xl border-slate-200"
                value={newP.severity}
                onChange={(e) => setNewP((p) => ({ ...p, severity: e.target.value }))}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                type="datetime-local"
                className="rounded-xl border-slate-200"
                value={newP.appointmentAt}
                onChange={(e) => setNewP((p) => ({ ...p, appointmentAt: e.target.value }))}
              />
              <button
                type="submit"
                disabled={adding}
                className="md:col-span-5 justify-self-start px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Patient"}
              </button>
            </form>
          </div>

          {/* Patients Table */}
          <div className="lg:col-span-3 bg-white border rounded-2xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <p className="font-semibold text-slate-800">Patients (auto-sorted by priority)</p>
              <span className="text-xs text-slate-500">
                Total: <b>{filteredPatients.length}</b>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Urgency</th>
                    <th className="px-4 py-3 text-left">Symptoms</th>
                    <th className="px-4 py-3 text-left">Doctor</th>
                    <th className="px-4 py-3 text-left">Wait</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Appointment</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-slate-800">{p.name || "Unknown"}</div>
                          {p.userId && <div className="text-xs text-slate-500">UID: {p.userId}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <SeverityBadge value={p.severity || "Low"} />
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="line-clamp-2 text-slate-600">{p.symptoms}</div>
                      </td>
                      <td className="px-4 py-3">
                        {p.assignedDoctor?.name ? (
                          <span className="text-slate-800">{p.assignedDoctor.name}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800">{p.waitTime || formatWait(p.waitMinutes || 0)}</div>
                        {p.waitMinutes != null && (
                          <div className="text-xs text-slate-500">{p.waitMinutes} min</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full ${
                            p.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                              : p.status === "In-Progress"
                              ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {p.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(p.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.appointmentAt ? fmtDate(p.appointmentAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setStatus(p.id, "In-Progress")}
                            className="px-2.5 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => setStatus(p.id, "Completed")}
                            className="px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-slate-500">
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
