import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  type: 'character' | 'machine' | 'moment';
  era: '1970s' | '1980s' | '1990s';
  rarity: 'common' | 'rare' | 'legendary';
  influence: number;
  quarters: number;
  legacy: number;
  description: string;
  quote: string;
  colour: string;
  tags: string[];
  studio: string;
  debut: number;
}

interface Props {
  cards: Card[];
  onFilter: (filtered: Card[]) => void;
}

export default function SearchBar({ cards, onFilter }: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      onFilter(cards);
      return;
    }
    const filtered = cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.studio.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q),
    );
    onFilter(filtered);
  }, [query, cards, onFilter]);

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        size={16}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards, studios, tags…"
        className="w-full bg-[var(--bg-card)] border border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--arcade-gold)]/60 transition-colors"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
