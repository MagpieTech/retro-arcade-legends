import { useState, useEffect } from 'react';
import { Heart, X, ExternalLink } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary';
  colour: string;
  studio: string;
  debut: number;
}

interface Props {
  cards: Card[];
}

const STORAGE_KEY = 'arcade-legends-favourites';

function getFavourites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export default function FavouritesDrawer({ cards }: Props) {
  const [open, setOpen]       = useState(false);
  const [favIds, setFavIds]   = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavIds(getFavourites());

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setFavIds(getFavourites());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const favourites = cards.filter((c) => favIds.has(c.id));

  function remove(id: string) {
    const favs = getFavourites();
    favs.delete(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
    setFavIds(new Set(favs));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 bg-[var(--bg-card)] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] hover:border-white/30 transition-colors"
        aria-label={`Favourites (${favourites.length})`}
      >
        <Heart size={15} className={favourites.length > 0 ? 'fill-[var(--arcade-red)] text-[var(--arcade-red)]' : ''} />
        <span>Favourites</span>
        {favourites.length > 0 && (
          <span className="bg-[var(--arcade-red)] text-white text-[10px] font-arcade rounded-full w-4 h-4 flex items-center justify-center">
            {favourites.length}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Favourites"
        aria-modal="true"
        className={[
          'fixed top-0 right-0 h-full w-80 bg-[var(--bg-card)] border-l border-white/10 z-50',
          'flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-arcade text-xs text-[var(--text-primary)]">Favourites</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close favourites"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favourites.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm text-center mt-8">
              No favourites yet.<br />Heart a card to add it here.
            </p>
          ) : (
            favourites.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: card.colour }} />
                <div className="flex-1 min-w-0">
                  <div className="font-arcade text-[10px] text-[var(--text-primary)] truncate">{card.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{card.studio} · {card.debut}</div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`/cards/${card.id}`}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={`View ${card.name}`}
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => remove(card.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--arcade-red)] transition-colors ml-1"
                    aria-label={`Remove ${card.name} from favourites`}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
