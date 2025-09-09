// src/components/SeverityBadge.jsx
import React from "react";
import { severityBadgeClass } from "../lib/triageEngine";

export default function SeverityBadge({ value }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${severityBadgeClass(value)}`}>
      {value}
    </span>
  );
}
