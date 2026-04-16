import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

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
}

const STAT_KEYS: { key: keyof Pick<Card, 'influence' | 'quarters' | 'legacy'>; label: string }[] = [
  { key: 'influence', label: 'Influence' },
  { key: 'quarters',  label: 'Quarters' },
  { key: 'legacy',    label: 'Legacy' },
];

function StatRow({ label, a, b, colourA, colourB }: { label: string; a: number; b: number; colourA: string; colourB: string }) {
  const max = Math.max(a, b);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-body">{label}</span>
        <div className="flex items-center gap-3 font-mono text-sm font-bold">
          <span style={{ color: colourA }}>{a}</span>
          <span className="text-[var(--text-muted)] text-xs">vs</span>
          <span style={{ color: colourB }}>{b}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 h-2">
        <div className="h-full bg-white/10 rounded-full overflow-hidden flex justify-end">
          <div className="h-full rounded-full" style={{ width: `${(a / 100) * 100}%`, backgroundColor: colourA }} />
        </div>
        <div className="h-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(b / 100) * 100}%`, backgroundColor: colourB }} />
        </div>
      </div>
      {a !== b && (
        <div className="text-[10px] text-[var(--text-muted)] text-right">
          {a > b ? '← wins' : 'wins →'} by {Math.abs(a - b)}
        </div>
      )}
    </div>
  );
}

export default function CompareWidget({ cards }: Props) {
  const [idA, setIdA] = useState<string>(cards[0]?.id ?? '');
  const [idB, setIdB] = useState<string>(cards[6]?.id ?? '');

  const cardA = cards.find((c) => c.id === idA);
  const cardB = cards.find((c) => c.id === idB);

  function swap() {
    setIdA(idB);
    setIdB(idA);
  }

  const selectClass =
    'flex-1 bg-[var(--bg-card)] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--arcade-gold)]/60 transition-colors';

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="flex items-center gap-3">
        <select value={idA} onChange={(e) => setIdA(e.target.value)} className={selectClass} aria-label="First card">
          {cards.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={swap}
          className="shrink-0 p-2 rounded-lg border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/30 transition-colors"
          aria-label="Swap cards"
        >
          <ArrowLeftRight size={16} />
        </button>
        <select value={idB} onChange={(e) => setIdB(e.target.value)} className={selectClass} aria-label="Second card">
          {cards.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {cardA && cardB && (
        <div className="rounded-xl border border-white/10 bg-[var(--bg-card)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-2">
            <div className="p-4 border-r border-white/10" style={{ borderTop: `3px solid ${cardA.colour}` }}>
              <a href={`/cards/${cardA.id}`} className="font-arcade text-[11px] leading-relaxed text-[var(--text-primary)] hover:text-[var(--arcade-gold)] transition-colors block">
                {cardA.name}
              </a>
              <div className="text-[10px] text-[var(--text-muted)] mt-1">{cardA.studio} · {cardA.debut}</div>
              <div className="text-[10px] capitalize mt-0.5" style={{ color: cardA.colour }}>{cardA.rarity} {cardA.type}</div>
            </div>
            <div className="p-4" style={{ borderTop: `3px solid ${cardB.colour}` }}>
              <a href={`/cards/${cardB.id}`} className="font-arcade text-[11px] leading-relaxed text-[var(--text-primary)] hover:text-[var(--arcade-gold)] transition-colors block">
                {cardB.name}
              </a>
              <div className="text-[10px] text-[var(--text-muted)] mt-1">{cardB.studio} · {cardB.debut}</div>
              <div className="text-[10px] capitalize mt-0.5" style={{ color: cardB.colour }}>{cardB.rarity} {cardB.type}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4 border-t border-white/10">
            {STAT_KEYS.map(({ key, label }) => (
              <StatRow
                key={key}
                label={label}
                a={cardA[key]}
                b={cardB[key]}
                colourA={cardA.colour}
                colourB={cardB.colour}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="px-4 pb-4">
            {(() => {
              const scoreA = cardA.influence + cardA.quarters + cardA.legacy;
              const scoreB = cardB.influence + cardB.quarters + cardB.legacy;
              const winner = scoreA > scoreB ? cardA : scoreB > scoreA ? cardB : null;
              return (
                <div className="rounded-lg bg-white/5 p-3 text-center">
                  {winner ? (
                    <span className="font-arcade text-[11px]" style={{ color: winner.colour }}>
                      {winner.name} wins overall ({scoreA > scoreB ? scoreA : scoreB} vs {scoreA > scoreB ? scoreB : scoreA})
                    </span>
                  ) : (
                    <span className="font-arcade text-[11px] text-[var(--text-muted)]">
                      Dead heat — {scoreA} each
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
