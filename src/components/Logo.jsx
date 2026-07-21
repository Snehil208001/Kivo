// KIVO mark + wordmark. Final mark: /public/kivo-logo.png
export default function Logo({ className = '', light = false, markOnly = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/kivo-logo.png?v=3"
        alt={markOnly ? 'KIVO' : ''}
        width={36}
        height={36}
        className="h-9 w-9 rounded-[10px] object-cover shadow-sm ring-1 ring-black/5"
        decoding="async"
      />
      {!markOnly && (
        <span
          className={`text-2xl font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-accent'
          }`}
        >
          KIVO
        </span>
      )}
    </span>
  );
}
