import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowLeft, CalendarCheck, Images } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import StitchDivider from '../components/StitchDivider';

export default function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    client
      .get(`/artisans/${id}`)
      .then((res) => setArtisan(res.data.artisan))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading profile…" />;

  if (error || !artisan) {
    return (
      <EmptyState
        title="Artisan not found"
        description={error || "This profile may have been removed."}
        action={<Link to="/artisans" className="btn-primary">Browse other artisans</Link>}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link to="/artisans" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink mb-8">
        <ArrowLeft size={16} /> Back to artisans
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar: photo + contact + CTA */}
        <div>
          <div className="stitch-card p-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-teal-50">
              {artisan.profilePicture ? (
                <img src={fileUrl(artisan.profilePicture)} alt={artisan.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-5xl text-teal-500">
                  {artisan.fullName?.[0]}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-ink/70">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-rust-500 shrink-0" /> {artisan.address}, {artisan.town}, {artisan.state}, {artisan.country}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-rust-500 shrink-0" /> {artisan.phone}</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-rust-500 shrink-0" /> {artisan.email}</p>
          </div>

          <Link to={`/book/${artisan._id}`} className="btn-primary w-full mt-6">
            <CalendarCheck size={18} /> Book {artisan.fullName.split(' ')[0]}
          </Link>
        </div>

        {/* Main: name, craft, bio, portfolio */}
        <div>
          <p className="eyebrow mb-2">{artisan.craft}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">{artisan.fullName}</h1>
          <div className="stitch-line text-gold-500 w-16 my-5" />

          {artisan.bio ? (
            <p className="text-ink/70 leading-relaxed max-w-2xl">{artisan.bio}</p>
          ) : (
            <p className="text-ink/40 italic">This artisan hasn't added a bio yet.</p>
          )}

          <div className="mt-12">
            <div className="flex items-center gap-2 mb-5">
              <Images size={20} className="text-rust-500" />
              <h2 className="font-display text-xl font-semibold">Portfolio</h2>
            </div>

            {artisan.portfolioImages?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {artisan.portfolioImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(fileUrl(img))}
                    className="aspect-square rounded-2xl overflow-hidden bg-canvas-deep border border-ink/10 group"
                  >
                    <img
                      src={fileUrl(img)}
                      alt={`${artisan.fullName} work sample ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-ink/40 italic text-sm">No portfolio images uploaded yet.</p>
            )}
          </div>

          <StitchDivider className="my-12" color="text-ink/10" />

          <div className="stitch-card p-8 bg-teal-500 text-canvas-soft border-none">
            <h3 className="font-display text-xl font-semibold mb-2">Ready to book {artisan.fullName.split(' ')[0]}?</h3>
            <p className="text-canvas-soft/80 text-sm mb-5 max-w-md">
              No account needed — just fill in your details and you're set.
            </p>
            <Link to={`/book/${artisan._id}`} className="btn bg-canvas-soft text-ink hover:bg-canvas">
              <CalendarCheck size={18} /> Book now
            </Link>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}
