import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Images, UserRound, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { artisan } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/bookings')
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const upcoming = bookings.slice(0, 5);

  return (
    <div>
      <p className="eyebrow mb-2">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold mb-8">{artisan?.fullName?.split(' ')[0]}'s Dashboard</h1>

      {!artisan?.isProfileComplete && (
        <div className="stitch-card p-5 mb-8 flex items-center gap-4 bg-gold-500/10 border-gold-500/30">
          <AlertCircle className="text-gold-600 shrink-0" size={24} />
          <div className="flex-1">
            <p className="font-semibold text-sm">Your profile isn't complete yet</p>
            <p className="text-sm text-ink/60">Add a bio and profile picture so customers can find and trust you.</p>
          </div>
          <Link to="/profile/edit" className="btn-teal shrink-0">Finish profile</Link>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="stitch-card p-6">
          <CalendarCheck className="text-rust-500 mb-3" size={22} />
          <p className="text-3xl font-display font-semibold">{bookings.length}</p>
          <p className="text-sm text-ink/50">Total bookings</p>
        </div>
        <div className="stitch-card p-6">
          <Clock className="text-gold-600 mb-3" size={22} />
          <p className="text-3xl font-display font-semibold">{pending}</p>
          <p className="text-sm text-ink/50">Pending review</p>
        </div>
        <div className="stitch-card p-6">
          <Images className="text-teal-500 mb-3" size={22} />
          <p className="text-3xl font-display font-semibold">{artisan?.portfolioImages?.length || 0}</p>
          <p className="text-sm text-ink/50">Portfolio images</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link to="/profile/edit" className="stitch-card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
          <UserRound className="text-rust-500" size={22} />
          <div className="flex-1">
            <p className="font-semibold text-sm">Edit profile</p>
            <p className="text-xs text-ink/50">Update your bio, photo & details</p>
          </div>
          <ArrowRight size={16} className="text-ink/30" />
        </Link>
        <Link to="/dashboard/portfolio" className="stitch-card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
          <Images className="text-teal-500" size={22} />
          <div className="flex-1">
            <p className="font-semibold text-sm">Manage portfolio</p>
            <p className="text-xs text-ink/50">Upload photos of your work</p>
          </div>
          <ArrowRight size={16} className="text-ink/30" />
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
        <Link to="/bookings" className="text-sm font-semibold text-rust-500 flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading bookings…" />
      ) : upcoming.length === 0 ? (
        <div className="stitch-card p-10 text-center text-ink/50">
          No bookings yet. Share your profile link to start getting booked!
        </div>
      ) : (
        <div className="stitch-card divide-y divide-ink/10 overflow-hidden">
          {upcoming.map((b) => (
            <div key={b._id} className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-display font-semibold shrink-0">
                {b.customerName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{b.customerName}</p>
                <p className="text-xs text-ink/50">{new Date(b.preferredDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} · {b.serviceAddress}</p>
              </div>
              <span
                className={`font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full shrink-0 ${
                  b.status === 'pending'
                    ? 'bg-gold-500/20 text-gold-600'
                    : b.status === 'confirmed'
                    ? 'bg-teal-500/15 text-teal-600'
                    : b.status === 'completed'
                    ? 'bg-ink/10 text-ink/60'
                    : 'bg-rust-500/10 text-rust-600'
                }`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
