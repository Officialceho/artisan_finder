import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `font-body text-sm font-medium transition-colors ${
    isActive ? 'text-rust-500' : 'text-ink/70 hover:text-ink'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur border-b border-ink/10">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-rust-500 text-canvas-soft flex items-center justify-center rotate-[-8deg] group-hover:rotate-0 transition-transform">
            <Scissors size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Artisan Finder</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/artisans" className={navLinkClass}>Browse Artisans</NavLink>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Artisan Login</NavLink>
              <Link to="/signup" className="btn-primary">Join as an Artisan</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-canvas-soft px-5 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/artisans" className={navLinkClass} onClick={() => setOpen(false)}>Browse Artisans</NavLink>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary w-full" onClick={() => setOpen(false)}>Dashboard</Link>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Artisan Login</NavLink>
              <Link to="/signup" className="btn-primary w-full" onClick={() => setOpen(false)}>Join as an Artisan</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
