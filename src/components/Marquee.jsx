// Scrolling offer ticker — the page's signature element. Duplicated content
// runs at -50% so the loop is seamless; pauses on hover, still on reduced motion.
const DEFAULT_ITEMS = [
  'CASH ON DELIVERY',
  'FREE SHIPPING OVER ₹499',
  'SHIPS IN 24 HOURS',
  '7-DAY EASY RETURNS',
  'WHATSAPP SUPPORT',
  'TRENDING · FASHION · BEAUTY · LIFESTYLE',
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  className = '',
  variant = 'dark',
  speed = 'animate-marquee',
}) {
  const styles =
    variant === 'dark'
      ? 'bg-primary-deep text-white'
      : variant === 'pop'
        ? 'bg-pop text-white'
        : 'bg-white text-accent';

  const row = [...items, ...items];

  return (
    <div className={`overflow-hidden ${styles} ${className}`}>
      <div className={`group flex w-max ${speed} hover:[animation-play-state:paused]`}>
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.12em]"
          >
            {item}
            <span className="ml-6 text-current/60" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
