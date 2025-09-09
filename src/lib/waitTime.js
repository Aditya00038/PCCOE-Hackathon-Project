// src/lib/waitTime.js
export function estimateWaitMinutes(severity, queuePosition = 0) {
  // base times (in minutes)
  const base = severity === "High" ? 5 : severity === "Medium" ? 25 : 60;
  // +5 minutes per person ahead in the same or higher priority queue
  return Math.max(base + queuePosition * 5, 0);
}

export function formatWait(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
