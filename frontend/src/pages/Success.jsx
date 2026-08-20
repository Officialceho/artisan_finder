import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Phone, Home } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import Spinner from '../components/Spinner';

export default function Success() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    client
      .get(`/bookings/${bookingId}`)
      .then((res) => setBooking(res.data.booking))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <Spinner label="Confirming your booking…" />;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-500 text-canvas-soft flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} />
      </div>
      <p className="eyebrow mb-2">Booking submitted</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">You're all set!</h1>
      <p className="text-ink/60 max-w-md mx-auto mb-10">
        {booking?.artisan?.fullName
          ? `${booking.artisan.fullName} will reach out to confirm the details.`
          : "The artisan will reach out to confirm the details."}
      </p>

      {booking && (
        <div className="stitch-card p-6 sm:p-8 text-left">
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-dashed border-ink/15">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-teal-50 shrink-0">
              {booking.artisan?.profilePicture ? (
                <img src={fileUrl(booking.artisan.profilePicture)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-teal-500">
                  {booking.artisan?.fullName?.[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold">{booking.artisan?.fullName}</h3>
              <p className="text-sm text-ink/50">{booking.artisan?.craft}</p>
            </div>
            <span className="ml-auto font-mono text-xs uppercase tracking-widest bg-gold-500/20 text-gold-600 px-3 py-1 rounded-full">
              {booking.status}
            </span>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-rust-500 shrink-0" />
              <dd>{new Date(booking.preferredDate).toLocaleDateString(undefined, { dateStyle: 'long' })} {booking.preferredTime && `· ${booking.preferredTime}`}</dd>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-rust-500 shrink-0" />
              <dd>{booking.serviceAddress}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-rust-500 shrink-0" />
              <dd>{booking.customerPhone}</dd>
            </div>
          </dl>

          {booking.details && (
            <p className="mt-5 pt-5 border-t border-dashed border-ink/15 text-ink/60 text-sm leading-relaxed">
              "{booking.details}"
            </p>
          )}
        </div>
      )}

      <Link to="/" className="btn-secondary mt-10">
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
