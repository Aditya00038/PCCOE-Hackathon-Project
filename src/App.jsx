// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PatientHome from "./pages/PatientHome";
import PatientOverview from "./pages/PatientOverview";
import HospitalDashboard from "./pages/HospitalDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <PatientHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital"
        element={
          <ProtectedRoute>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/hospital/overview" element={<PatientOverview />} />

    </Routes>
    
  );
}

export default App;
