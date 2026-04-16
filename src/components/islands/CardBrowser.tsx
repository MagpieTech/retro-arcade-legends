import { useState, useCallback, useMemo } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortSelect from './SortSelect';

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

interface Filters {
  types: Set<string>;
  eras: Set<string>;
  rarities: Set<string>;
}

type SortKey = 'influence' | 'quarters' | 'legacy' | 'name' | 'debut';

interface Props {
  cards: Card[];
}

const TYPE_COLOURS = {
  character: 'var(--arcade-teal)',
  machine:   'var(--arcade-purple)',
  moment:    'var(--arcade-green)',
} as const;

const RARITY_CLASSES = {
  common:    'bg-white/10 text-[var(--text-muted)] border border-white/20',
  rare:      'bg-[var(--arcade-gold)]/20 text-[var(--arcade-gold)] border border-[var(--arcade-gold)]/40',
  legendary: 'bg-[var(--arcade-red)]/20 text-[var(--arcade-red)] border border-[var(--arcade-red)]/40',
} as const;

const ERA_CLASSES = {
  '1970s': 'bg-[var(--arcade-teal)]/20 text-[var(--arcade-teal)] border border-[var(--arcade-teal)]/40',
  '1980s': 'bg-[var(--arcade-purple)]/20 text-[var(--arcade-purple)] border border-[var(--arcade-purple)]/40',
  '1990s': 'bg-[var(--arcade-green)]/20 text-[var(--arcade-green)] border border-[var(--arcade-green)]/40',
} as const;

function sortCards(cards: Card[], key: SortKey): Card[] {
  return [...cards].sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name);
    if (key === 'debut') return a.debut - b.debut;
    return b[key] - a[key];
  });
}

export default function CardBrowser({ cards }: Props) {
  const [searchResults, setSearchResults]   = useState<Card[]>(cards);
  const [filters, setFilters]               = useState<Filters>({ types: new Set(), eras: new Set(), rarities: new Set() });
  const [sortKey, setSortKey]               = useState<SortKey>('influence');

  const handleSearch = useCallback((filtered: Card[]) => setSearchResults(filtered), []);
  const handleFilter = useCallback((f: Filters) => setFilters(f), []);

  const displayCards = useMemo(() => {
    let result = searchResults;

    if (filters.types.size)    result = result.filter((c) => filters.types.has(c.type));
    if (filters.eras.size)     result = result.filter((c) => filters.eras.has(c.era));
    if (filters.rarities.size) result = result.filter((c) => filters.rarities.has(c.rarity));

    return sortCards(result, sortKey);
  }, [searchResults, filters, sortKey]);

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar cards={cards} onFilter={handleSearch} />
        </div>
        <div className="flex items-center gap-3">
          <FilterPanel onFilter={handleFilter} />
          <SortSelect value={sortKey} onChange={setSortKey} />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-[var(--text-muted)]">
        {displayCards.length === cards.length
          ? `${cards.length} cards`
          : `${displayCards.length} of ${cards.length} cards`}
      </div>

      {/* Card grid */}
      {displayCards.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="font-arcade text-2xl text-[var(--text-muted)]">¯\_(ツ)_/¯</div>
          <p className="text-[var(--text-muted)]">No cards match those filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayCards.map((card) => (
            <a
              key={card.id}
              href={`/cards/${card.id}`}
              className={[
                'group block rounded-xl border border-white/10 bg-[var(--bg-card)] overflow-hidden',
                'hover:border-white/30 hover:shadow-lg transition-all duration-200',
                card.rarity === 'legendary' ? 'card--legendary' : '',
              ].join(' ')}
            >
              <div className="h-1.5 w-full" style={{ backgroundColor: card.colour }} />
              <div className="p-4 space-y-3 relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-arcade text-[11px] leading-relaxed text-[var(--text-primary)] group-hover:text-[var(--arcade-gold)] transition-colors line-clamp-2">
                    {card.name}
                  </h2>
                  <span
                    className="shrink-0 text-[9px] font-arcade uppercase px-1.5 py-0.5 rounded border"
                    style={{
                      color: TYPE_COLOURS[card.type],
                      borderColor: `${TYPE_COLOURS[card.type]}40`,
                      backgroundColor: `${TYPE_COLOURS[card.type]}18`,
                    }}
                  >
                    {card.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-arcade text-[9px] px-1.5 py-0.5 rounded uppercase ${RARITY_CLASSES[card.rarity]}`}>
                    {card.rarity}
                  </span>
                  <span className={`font-arcade text-[9px] px-1.5 py-0.5 rounded uppercase ${ERA_CLASSES[card.era]}`}>
                    {card.era}
                  </span>
                </div>

                <p className="text-[var(--text-muted)] text-xs italic line-clamp-1">"{card.quote}"</p>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                  {([['INF', card.influence], ['QTR', card.quarters], ['LGY', card.legacy]] as [string, number][]).map(([label, value]) => (
                    <div key={label} className="text-center">
                      <div className="font-mono text-sm font-bold" style={{ color: card.colour }}>{value}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-[var(--text-muted)]">{card.studio} · {card.debut}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
