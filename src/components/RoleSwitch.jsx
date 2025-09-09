export default function RoleSwitch({ role, setRole }) {
  const base = "flex-1 rounded-md border px-3 py-2 text-center cursor-pointer";
  const active = "bg-blue-50 border-blue-500 text-blue-700";
  const inactive = "bg-white hover:bg-gray-50";
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setRole("patient")}
        className={`${base} ${role === "patient" ? active : inactive}`}
      >
        Patient
      </button>
      <button
        type="button"
        onClick={() => setRole("hospital")}
        className={`${base} ${role === "hospital" ? active : inactive}`}
      >
        Hospital
      </button>
    </div>
  );
}
