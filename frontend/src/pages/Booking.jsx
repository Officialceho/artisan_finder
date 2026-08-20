import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, MapPin } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const emptyForm = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  serviceAddress: '',
  preferredDate: '',
  preferredTime: '',
  details: '',
};

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get(`/artisans/${id}`)
      .then((res) => setArtisan(res.data.artisan))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await client.post(`/bookings/artisan/${id}`, form);
      navigate(`/success?bookingId=${data.booking._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading booking form…" />;

  if (!artisan) {
    return (
      <EmptyState
        title="Artisan not found"
        description="We couldn't find this artisan to book."
        action={<Link to="/artisans" className="btn-primary">Browse artisans</Link>}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link to={`/artisan/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink mb-8">
        <ArrowLeft size={16} /> Back to profile
      </Link>

      {/* Artisan summary strip */}
      <div className="stitch-card p-5 flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-50 shrink-0">
          {artisan.profilePicture ? (
            <img src={fileUrl(artisan.profilePicture)} alt={artisan.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-xl text-teal-500">
              {artisan.fullName?.[0]}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="eyebrow mb-0.5">{artisan.craft}</p>
          <h2 className="font-display text-lg font-semibold truncate">{artisan.fullName}</h2>
          <p className="text-sm text-ink/50 flex items-center gap-1"><MapPin size={13} /> {artisan.town}, {artisan.state}</p>
        </div>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">Book this artisan</h1>
      <p className="text-ink/60 mb-8">Fill in your details below — no account needed.</p>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-rust-50 text-rust-700 text-sm border border-rust-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field" htmlFor="customerName">Your full name</label>
            <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} className="input-field" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label-field" htmlFor="customerPhone">Phone number</label>
            <input id="customerPhone" name="customerPhone" required value={form.customerPhone} onChange={handleChange} className="input-field" placeholder="080..." />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="customerEmail">Email (optional)</label>
          <input id="customerEmail" type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className="input-field" placeholder="you@example.com" />
        </div>

        <div>
          <label className="label-field" htmlFor="serviceAddress">Where should {artisan.fullName.split(' ')[0]} come to?</label>
          <input id="serviceAddress" name="serviceAddress" required value={form.serviceAddress} onChange={handleChange} className="input-field" placeholder="Street, town" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field" htmlFor="preferredDate">Preferred date</label>
            <input id="preferredDate" type="date" name="preferredDate" required value={form.preferredDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="preferredTime">Preferred time (optional)</label>
            <input id="preferredTime" name="preferredTime" value={form.preferredTime} onChange={handleChange} className="input-field" placeholder="e.g. Morning, 2:00 PM" />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="details">Job details (optional)</label>
          <textarea id="details" name="details" rows={4} value={form.details} onChange={handleChange} className="input-field resize-none" placeholder="Describe what you need done…" />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
          <CalendarCheck size={18} /> {submitting ? 'Submitting…' : 'Submit booking'}
        </button>
      </form>
    </div>
  );
}
