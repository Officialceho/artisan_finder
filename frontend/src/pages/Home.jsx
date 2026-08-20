import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Hammer, Scissors as ScissorsIcon, Paintbrush, Wrench, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import ArtisanCard from '../components/ArtisanCard';
import StitchDivider from '../components/StitchDivider';
import Spinner from '../components/Spinner';

const CATEGORY_ICONS = [Hammer, ScissorsIcon, Paintbrush, Wrench];

export default function Home() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [artisansRes, craftsRes] = await Promise.all([
          client.get('/artisans', { params: { limit: 6 } }),
          client.get('/artisans/crafts'),
        ]);
        setFeatured(artisansRes.data.artisans);
        setCrafts(craftsRes.data.crafts);
      } catch (err) {
        // Non-fatal on the landing page
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/artisans?q=${encodeURIComponent(query)}` : '/artisans');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">Handpicked craftspeople, near you</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
              Find the hands behind the craft.
              <span className="block text-rust-500 italic font-medium">Book them in minutes.</span>
            </h1>
            <div className="stitch-line text-gold-500 w-24 mt-6" />
            <p className="mt-6 text-lg text-ink/65 max-w-md leading-relaxed">
              Browse real portfolios from tailors, carpenters, painters, and more — then book directly.
              No sign-up, no waiting, no middleman.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try 'tailor', 'plumber', 'painter'…"
                  className="input-field pl-11"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                Search <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/55">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-teal-500" /> Verified profiles</span>
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-teal-500" /> Book in under a minute</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-teal-500" /> Local artisans</span>
            </div>
          </div>

          <div className="relative">
            <div className="stitch-card p-6 rotate-2">
              <div className="grid grid-cols-2 gap-4">
                {featured.slice(0, 4).map((a) => (
                  <div key={a._id} className="rounded-2xl overflow-hidden aspect-square bg-teal-50">
                    {a.profilePicture ? (
                      <img
                        src={fileUrl(a.profilePicture)}
                        alt={a.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-3xl text-teal-500">
                        {a.fullName?.[0]}
                      </div>
                    )}
                  </div>
                ))}
                {featured.length === 0 &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl aspect-square bg-canvas-deep" />
                  ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-gold-500 text-ink px-5 py-3 rounded-2xl shadow-stitched -rotate-3 font-display font-semibold">
              {crafts.length > 0 ? `${crafts.length}+ crafts listed` : 'Growing every day'}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {crafts.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <p className="eyebrow mb-2">Browse by craft</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8">What are you looking for?</h2>
          <div className="flex flex-wrap gap-3">
            {crafts.slice(0, 10).map((craft, i) => {
              const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
              return (
                <Link
                  key={craft}
                  to={`/artisans?craft=${encodeURIComponent(craft)}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-ink/10 hover:border-rust-500 hover:text-rust-500 transition-colors font-medium text-sm bg-canvas-soft"
                >
                  <Icon size={16} /> {craft}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured artisans */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-2">Fresh on the platform</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Featured artisans</h2>
          </div>
          <Link to="/artisans" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-rust-500 hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Spinner label="Gathering artisans…" />
        ) : featured.length === 0 ? (
          <div className="stitch-card p-10 text-center text-ink/50">
            No artisans yet — be the first to <Link to="/signup" className="text-rust-500 font-semibold">join</Link>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((a) => (
              <ArtisanCard key={a._id} artisan={a} />
            ))}
          </div>
        )}

        <Link to="/artisans" className="sm:hidden mt-8 btn-secondary w-full">
          View all artisans
        </Link>
      </section>

      <StitchDivider className="max-w-7xl mx-auto mx-5 sm:mx-8" color="text-ink/10" />

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <p className="eyebrow mb-2">Three simple steps</p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-10">Booking takes minutes, not messages.</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { title: 'Discover', desc: 'Search or browse by craft and location to find the right artisan.' },
            { title: 'Review', desc: 'Check their portfolio, bio, and details on their public profile.' },
            { title: 'Book', desc: 'Fill in your details and submit — no account required, ever.' },
          ].map((step, i) => (
            <div key={step.title} className="relative pl-6">
              <span className="font-mono text-xs text-rust-500">0{i + 1}</span>
              <h3 className="font-display text-xl font-semibold mt-1 mb-2">{step.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artisan CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div className="stitch-card bg-teal-500 text-canvas-soft p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-gold-400 mb-2">Are you an artisan?</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold max-w-md">
              Put your craft in front of customers actively looking for you.
            </h2>
          </div>
          <Link to="/signup" className="btn bg-canvas-soft text-ink hover:bg-canvas whitespace-nowrap">
            Create your profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
