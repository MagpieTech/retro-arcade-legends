import { useState } from 'react';
import { Filter } from 'lucide-react';

interface Filters {
  types: Set<string>;
  eras: Set<string>;
  rarities: Set<string>;
}

interface Props {
  onFilter: (filters: Filters) => void;
}

const TYPES    = ['character', 'machine', 'moment'] as const;
const ERAS     = ['1970s', '1980s', '1990s'] as const;
const RARITIES = ['common', 'rare', 'legendary'] as const;

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

function CheckGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  selected: Set<string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-arcade text-[var(--text-muted)] uppercase tracking-widest">{label}</div>
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.has(opt)}
            onChange={() => onChange(opt)}
            className="accent-[var(--arcade-gold)] w-3.5 h-3.5"
          />
          <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] capitalize transition-colors">
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function FilterPanel({ onFilter }: Props) {
  const [types, setTypes]       = useState<Set<string>>(new Set());
  const [eras, setEras]         = useState<Set<string>>(new Set());
  const [rarities, setRarities] = useState<Set<string>>(new Set());
  const [open, setOpen]         = useState(false);

  function handleType(v: typeof TYPES[number]) {
    const next = toggle(types, v);
    setTypes(next);
    onFilter({ types: next, eras, rarities });
  }

  function handleEra(v: typeof ERAS[number]) {
    const next = toggle(eras, v);
    setEras(next);
    onFilter({ types, eras: next, rarities });
  }

  function handleRarity(v: typeof RARITIES[number]) {
    const next = toggle(rarities, v);
    setRarities(next);
    onFilter({ types, eras, rarities: next });
  }

  function clearAll() {
    const empty = new Set<string>();
    setTypes(empty);
    setEras(empty);
    setRarities(empty);
    onFilter({ types: empty, eras: empty, rarities: empty });
  }

  const activeCount = types.size + eras.size + rarities.size;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[var(--bg-card)] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] hover:border-white/30 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Filter size={14} />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="bg-[var(--arcade-gold)] text-black text-[10px] font-arcade rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-20 bg-[var(--bg-card)] border border-white/20 rounded-xl p-4 space-y-4 min-w-48 shadow-xl">
          <CheckGroup label="Type"   options={TYPES}    selected={types}    onChange={handleType} />
          <CheckGroup label="Era"    options={ERAS}     selected={eras}     onChange={handleEra} />
          <CheckGroup label="Rarity" options={RARITIES} selected={rarities} onChange={handleRarity} />
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-[10px] text-[var(--arcade-red)] hover:text-[var(--arcade-red)]/70 transition-colors w-full text-left"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
