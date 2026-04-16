import { ChevronDown } from 'lucide-react';

type SortKey = 'influence' | 'quarters' | 'legacy' | 'name' | 'debut';

interface Props {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'influence', label: 'Influence' },
  { value: 'quarters',  label: 'Quarters' },
  { value: 'legacy',    label: 'Legacy' },
  { value: 'name',      label: 'Name' },
  { value: 'debut',     label: 'Debut Year' },
];

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none bg-[var(--bg-card)] border border-white/10 rounded-lg pl-4 pr-9 py-2.5 text-sm text-[var(--text-primary)] hover:border-white/30 focus:outline-none focus:border-[var(--arcade-gold)]/60 transition-colors cursor-pointer"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        size={14}
      />
    </div>
  );
}
