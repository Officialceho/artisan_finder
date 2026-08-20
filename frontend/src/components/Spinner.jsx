export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink/50">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-rust-500 animate-spin" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
