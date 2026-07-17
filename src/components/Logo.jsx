// Wordmark logo for KIVO. Inline so it needs no asset pipeline.
export default function Logo({ className = '', light = false }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-2xl font-extrabold tracking-tight ${className}`}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white"
        aria-hidden="true"
      >
        K
      </span>
      <span className={light ? 'text-white' : 'text-accent'}>KIVO</span>
    </span>
  );
}
