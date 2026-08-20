import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserRound, Images, CalendarCheck, LogOut, Scissors, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../api/client';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile/edit', label: 'My Profile', icon: UserRound },
  { to: '/dashboard/portfolio', label: 'My Portfolio', icon: Images },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
];

export default function DashboardLayout() {
  const { artisan, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'bg-rust-500 text-canvas-soft' : 'text-canvas-soft/70 hover:bg-canvas-soft/10 hover:text-canvas-soft'
    }`;

  const Sidebar = (
    <aside className="w-72 shrink-0 bg-ink text-canvas-soft flex flex-col h-full">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-canvas-soft/10">
        <span className="w-9 h-9 rounded-full bg-rust-500 flex items-center justify-center rotate-[-8deg]">
          <Scissors size={18} strokeWidth={2.5} />
        </span>
        <span className="font-display text-lg font-semibold">Artisan Finder</span>
      </div>

      <div className="px-6 py-5 flex items-center gap-3 border-b border-canvas-soft/10">
        <div className="w-11 h-11 rounded-full bg-teal-600 overflow-hidden flex items-center justify-center font-display text-lg shrink-0">
          {artisan?.profilePicture ? (
            <img src={fileUrl(artisan.profilePicture)} alt="" className="w-full h-full object-cover" />
          ) : (
            artisan?.fullName?.[0]?.toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{artisan?.fullName}</p>
          <p className="text-xs text-canvas-soft/50 truncate">{artisan?.craft}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={() => setOpen(false)}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-canvas-soft/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-canvas-soft/70 hover:bg-canvas-soft/10 hover:text-canvas-soft transition-colors"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-canvas">
      <div className="hidden lg:block">{Sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-30 bg-ink text-canvas-soft flex items-center justify-between px-5 h-16">
          <span className="font-display font-semibold">Artisan Finder</span>
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
