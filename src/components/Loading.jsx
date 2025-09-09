export default function Loading() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-pulse text-center">
        <div className="mb-2 text-2xl font-semibold">Loading…</div>
        <div className="h-2 w-40 rounded bg-gray-200" />
      </div>
    </div>
  );
}
