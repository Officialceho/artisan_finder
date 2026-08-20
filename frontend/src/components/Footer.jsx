import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import StitchDivider from './StitchDivider';

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas-soft mt-24">
      <StitchDivider color="text-gold-500/40" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-rust-500 flex items-center justify-center rotate-[-8deg]">
              <Scissors size={16} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold">Artisan Finder</span>
          </div>
          <p className="text-canvas-soft/60 text-sm leading-relaxed max-w-xs">
            Discover skilled hands in your neighborhood — no account, no friction. Just find, view, and book.
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-400 mb-3">For customers</p>
          <ul className="space-y-2 text-sm text-canvas-soft/70">
            <li><Link to="/artisans" className="hover:text-canvas-soft">Browse artisans</Link></li>
            <li><Link to="/" className="hover:text-canvas-soft">How it works</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-400 mb-3">For artisans</p>
          <ul className="space-y-2 text-sm text-canvas-soft/70">
            <li><Link to="/signup" className="hover:text-canvas-soft">Create your profile</Link></li>
            <li><Link to="/login" className="hover:text-canvas-soft">Log in to dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-canvas-soft/10 py-5 text-center text-xs text-canvas-soft/40 font-mono">
        &copy; {new Date().getFullYear()} Artisan Finder. Handmade with care.
      </div>
    </footer>
  );
}
