import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import client from '../api/client';
import ArtisanCard from '../components/ArtisanCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

export default function ArtisansList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get('q') || '';
  const craft = searchParams.get('craft') || '';

  useEffect(() => {
    client.get('/artisans/crafts').then((res) => setCrafts(res.data.crafts)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (craft) params.craft = craft;

    client
      .get('/artisans', { params })
      .then((res) => setArtisans(res.data.artisans))
      .catch(() => setArtisans([]))
      .finally(() => setLoading(false));
  }, [q, craft]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <p className="eyebrow mb-2">Every craft, one place</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">Browse artisans</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <input
            defaultValue={q}
            onChange={(e) => updateParam('q', e.target.value)}
            placeholder="Search by name, craft, or town…"
            className="input-field pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-secondary sm:w-auto"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="stitch-card p-5 mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => updateParam('craft', '')}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
              !craft ? 'bg-ink text-canvas-soft border-ink' : 'border-ink/15 text-ink/70 hover:border-ink/40'
            }`}
          >
            All crafts
          </button>
          {crafts.map((c) => (
            <button
              key={c}
              onClick={() => updateParam('craft', c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                craft === c ? 'bg-rust-500 text-canvas-soft border-rust-500' : 'border-ink/15 text-ink/70 hover:border-ink/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {(q || craft) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-ink/60">
          Filters:
          {q && (
            <span className="flex items-center gap-1 bg-canvas-deep px-3 py-1 rounded-full">
              "{q}" <button onClick={() => updateParam('q', '')}><X size={12} /></button>
            </span>
          )}
          {craft && (
            <span className="flex items-center gap-1 bg-canvas-deep px-3 py-1 rounded-full">
              {craft} <button onClick={() => updateParam('craft', '')}><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <Spinner label="Finding artisans…" />
      ) : artisans.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No artisans match your search"
          description="Try a different keyword or clear your filters to see everyone."
        />
      ) : (
        <>
          <p className="text-sm text-ink/50 mb-5 font-mono">{artisans.length} artisan{artisans.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((a) => (
              <ArtisanCard key={a._id} artisan={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
