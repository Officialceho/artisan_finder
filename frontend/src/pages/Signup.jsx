import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Scissors, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  craft: '',
  address: '',
  town: '',
  state: '',
  country: '',
  password: '',
  confirmPassword: '',
};

const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'~`]/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const passwordChecks = {
    length: form.password.length >= 8,
    special: SPECIAL_CHAR_REGEX.test(form.password),
    match: form.confirmPassword.length > 0 && form.password === form.confirmPassword,
  };
  const passwordValid = passwordChecks.length && passwordChecks.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) {
      setError('Password must be at least 8 characters and include a special character.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      // confirmPassword travels with the request only for server-side validation —
      // the backend verifies the match, then discards it and stores just the hash.
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CheckItem = ({ ok, children }) => (
    <span className={`flex items-center gap-1.5 text-xs ${ok ? 'text-teal-600' : 'text-ink/40'}`}>
      {ok ? <Check size={13} /> : <X size={13} />} {children}
    </span>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-full bg-rust-500 text-canvas-soft flex items-center justify-center rotate-[-8deg]">
            <Scissors size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold">Artisan Finder</span>
        </Link>

        <div className="stitch-card p-8">
          <p className="eyebrow mb-2">Join as an artisan</p>
          <h1 className="font-display text-2xl font-semibold mb-6">Create your artisan account</h1>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rust-50 text-rust-700 text-sm border border-rust-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field" htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} className="input-field" placeholder="Adaeze Okonkwo" />
              </div>
              <div>
                <label className="label-field" htmlFor="craft">Craft / category</label>
                <input id="craft" name="craft" required value={form.craft} onChange={handleChange} className="input-field" placeholder="Tailoring, Carpentry…" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field" htmlFor="email">Email address</label>
                <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-field" htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="080..." />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="address">Address</label>
              <input id="address" name="address" required value={form.address} onChange={handleChange} className="input-field" placeholder="Street address" />
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="label-field" htmlFor="town">Town</label>
                <input id="town" name="town" required value={form.town} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field" htmlFor="state">State</label>
                <input id="state" name="state" required value={form.state} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field" htmlFor="country">Country</label>
                <input id="country" name="country" required value={form.country} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pr-11"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label-field" htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 -mt-2">
              <CheckItem ok={passwordChecks.length}>At least 8 characters</CheckItem>
              <CheckItem ok={passwordChecks.special}>One special character</CheckItem>
              <CheckItem ok={passwordChecks.match}>Passwords match</CheckItem>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus size={18} /> {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account? <Link to="/login" className="text-rust-500 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
