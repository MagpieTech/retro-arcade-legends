import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  cardId: string;
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

function saveFavourites(favs: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
}

export default function FavouriteButton({ cardId }: Props) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavourites().has(cardId));
  }, [cardId]);

  function toggle() {
    const favs = getFavourites();
    favs.has(cardId) ? favs.delete(cardId) : favs.add(cardId);
    saveFavourites(favs);
    setIsFav(favs.has(cardId));
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      aria-pressed={isFav}
      className={[
        'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border transition-all',
        isFav
          ? 'bg-[var(--arcade-red)]/20 border-[var(--arcade-red)]/40 text-[var(--arcade-red)]'
          : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:border-white/30 hover:text-[var(--text-primary)]',
      ].join(' ')}
    >
      <Heart size={15} className={isFav ? 'fill-current' : ''} />
      {isFav ? 'Favourited' : 'Add to Favourites'}
    </button>
  );
}
