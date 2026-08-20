import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { fileUrl } from '../api/client';

export default function ArtisanCard({ artisan }) {
  const picture = fileUrl(artisan.profilePicture);
  const initials = artisan.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Link
      to={`/artisan/${artisan._id}`}
      className="stitch-card group block overflow-hidden hover:-translate-y-1 transition-transform duration-200"
    >
      <div className="p-3">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teal-50">
          {picture ? (
            <img
              src={picture}
              alt={artisan.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-4xl text-teal-500">
              {initials}
            </div>
          )}
          <span className="absolute top-3 left-3 bg-canvas-soft/95 text-ink text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-ink/10">
            {artisan.craft}
          </span>
          {artisan.portfolioImages?.length > 0 && (
            <span className="absolute bottom-3 right-3 bg-ink/80 text-canvas-soft text-xs font-mono px-2.5 py-1 rounded-full flex items-center gap-1">
              <ImageIcon size={12} /> {artisan.portfolioImages.length}
            </span>
          )}
        </div>
      </div>
      <div className="px-5 pb-5 pt-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-ink leading-snug">{artisan.fullName}</h3>
          <ArrowUpRight
            size={20}
            className="shrink-0 mt-1 text-ink/30 group-hover:text-rust-500 group-hover:rotate-45 transition-all"
          />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-ink/55 mt-1">
          <MapPin size={14} /> {artisan.town}, {artisan.state}
        </p>
        {artisan.bio && <p className="text-sm text-ink/60 mt-3 line-clamp-2">{artisan.bio}</p>}
      </div>
    </Link>
  );
}
