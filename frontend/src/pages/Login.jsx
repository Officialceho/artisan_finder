import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Scissors, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-full bg-rust-500 text-canvas-soft flex items-center justify-center rotate-[-8deg]">
            <Scissors size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold">Artisan Finder</span>
        </Link>

        <div className="stitch-card p-8">
          <p className="eyebrow mb-2">Welcome back</p>
          <h1 className="font-display text-2xl font-semibold mb-6">Log in to your dashboard</h1>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rust-50 text-rust-700 text-sm border border-rust-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field" htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-field" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-11"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn size={18} /> {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          New artisan? <Link to="/signup" className="text-rust-500 font-semibold">Create an account</Link>
        </p>
        <p className="text-center text-sm text-ink/40 mt-2">
          Looking to book someone? <Link to="/artisans" className="underline hover:text-ink/60">Browse artisans</Link> — no account needed.
        </p>
      </div>
    </div>
  );
}
