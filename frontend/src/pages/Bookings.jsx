import { useEffect, useState } from 'react';
import { CalendarCheck, MapPin, Phone, Mail, Search } from 'lucide-react';
import client from '../api/client';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusClasses = {
  pending: 'bg-gold-500/20 text-gold-600',
  confirmed: 'bg-teal-500/15 text-teal-600',
  completed: 'bg-ink/10 text-ink/60',
  cancelled: 'bg-rust-500/10 text-rust-600',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  const load = () => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    client
      .get('/bookings', { params })
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await client.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      // Surface silently in-row; a toast system could replace this
      alert(err.message);
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2">Manage requests</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Bookings</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
            !filter ? 'bg-ink text-canvas-soft border-ink' : 'border-ink/15 text-ink/70 hover:border-ink/40'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 capitalize transition-colors ${
              filter === s ? 'bg-rust-500 text-canvas-soft border-rust-500' : 'border-ink/15 text-ink/70 hover:border-ink/40'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading bookings…" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No bookings found"
          description={filter ? `You have no ${filter} bookings right now.` : 'Bookings from customers will show up here.'}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="stitch-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{b.customerName}</h3>
                  <p className="text-xs text-ink/40 font-mono mt-0.5">
                    Requested {new Date(b.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>
                <select
                  value={b.status}
                  disabled={updatingId === b._id}
                  onChange={(e) => handleStatusChange(b._id, e.target.value)}
                  className={`font-mono text-xs uppercase tracking-widest px-3 py-2 rounded-full border-none capitalize cursor-pointer ${statusClasses[b.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-ink/70 mb-4">
                <p className="flex items-center gap-2"><CalendarCheck size={15} className="text-rust-500 shrink-0" /> {new Date(b.preferredDate).toLocaleDateString(undefined, { dateStyle: 'long' })} {b.preferredTime && `· ${b.preferredTime}`}</p>
                <p className="flex items-center gap-2"><MapPin size={15} className="text-rust-500 shrink-0" /> {b.serviceAddress}</p>
                <p className="flex items-center gap-2"><Phone size={15} className="text-rust-500 shrink-0" /> {b.customerPhone}</p>
                {b.customerEmail && <p className="flex items-center gap-2"><Mail size={15} className="text-rust-500 shrink-0" /> {b.customerEmail}</p>}
              </div>

              {b.details && (
                <p className="text-sm text-ink/60 bg-canvas-deep rounded-xl p-4 leading-relaxed">{b.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
