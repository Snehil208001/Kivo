import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Bento layout: one tall feature tile + two wide tiles, each a distinct
// color world so the three categories read as separate destinations.
const TILES = {
  cleaning: {
    handle: 'cleaning',
    title: 'Cleaning',
    copy: 'Spin mops, scrubbers & sprays that make chores vanish.',
    emoji: '🧼',
    grad: 'from-primary/90 to-primary-deep',
    text: 'text-white',
    sub: 'text-white/75',
    count: '30+ tools',
  },
  care: {
    handle: 'personal-care',
    title: 'Personal Care',
    copy: 'Rollers, dryers & glow rituals.',
    emoji: '💆',
    grad: 'from-pink-100 to-pink-50',
    text: 'text-accent',
    sub: 'text-accent/60',
    count: '20+ picks',
  },
  eco: {
    handle: 'eco',
    title: 'Eco',
    copy: 'Plastic-free swaps that last.',
    emoji: '🌱',
    grad: 'from-lime-100 to-lime-50',
    text: 'text-accent',
    sub: 'text-accent/60',
    count: '15+ essentials',
  },
};

function Tile({ tile, className = '', big = false }) {
  return (
    <Link
      to={`/collections/${tile.handle}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${tile.grad} p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className={`${big ? 'text-6xl' : 'text-4xl'} drop-shadow-sm`}>
          {tile.emoji}
        </span>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-accent transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}
        >
          <ArrowUpRight size={20} />
        </span>
      </div>

      <div className={big ? 'mt-10' : 'mt-8'}>
        <span
          className={`badge mb-2 bg-white/25 ${tile.text} backdrop-blur`}
        >
          {tile.count}
        </span>
        <h3
          className={`font-display font-extrabold tracking-tight ${tile.text} ${
            big ? 'text-3xl sm:text-4xl' : 'text-2xl'
          }`}
        >
          {tile.title}
        </h3>
        <p className={`mt-1 max-w-xs text-sm ${tile.sub}`}>{tile.copy}</p>
      </div>
    </Link>
  );
}

export default function CollectionBanners() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
      <Tile tile={TILES.cleaning} big className="md:row-span-2 md:min-h-[360px]" />
      <Tile tile={TILES.care} />
      <Tile tile={TILES.eco} />
    </div>
  );
}
