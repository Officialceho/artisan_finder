import { useRef, useState } from 'react';
import { Camera, Save, Check } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfileEdit() {
  const { artisan, updateArtisanLocal } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    fullName: artisan?.fullName || '',
    phone: artisan?.phone || '',
    craft: artisan?.craft || '',
    address: artisan?.address || '',
    town: artisan?.town || '',
    state: artisan?.state || '',
    country: artisan?.country || '',
    bio: artisan?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { data } = await client.put('/artisans/profile', form);
      updateArtisanLocal(data.artisan);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('profilePicture', file);
      const { data } = await client.put('/artisans/profile/picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateArtisanLocal(data.artisan);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPic(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <p className="eyebrow mb-2">Your public profile</p>
      <h1 className="font-display text-3xl font-semibold mb-8">My Profile</h1>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-rust-50 text-rust-700 text-sm border border-rust-500/20">
          {error}
        </div>
      )}

      {/* Profile picture */}
      <div className="stitch-card p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-teal-50 border-2 border-canvas-soft shadow-stitched">
            {artisan?.profilePicture ? (
              <img src={fileUrl(artisan.profilePicture)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-3xl text-teal-500">
                {artisan?.fullName?.[0]}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-rust-500 text-canvas-soft flex items-center justify-center border-2 border-canvas-soft hover:bg-rust-600"
            aria-label="Change profile picture"
          >
            <Camera size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Profile picture</p>
          <p className="text-xs text-ink/50">This appears on your card and public profile. {uploadingPic && 'Uploading…'}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="stitch-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field" htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="craft">Craft / category</label>
            <input id="craft" name="craft" value={form.craft} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field">Email</label>
            <input value={artisan?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="label-field" htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="address">Address</label>
          <input id="address" name="address" value={form.address} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="label-field" htmlFor="town">Town</label>
            <input id="town" name="town" value={form.town} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="state">State</label>
            <input id="state" name="state" value={form.state} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="country">Country</label>
            <input id="country" name="country" value={form.country} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            maxLength={800}
            value={form.bio}
            onChange={handleChange}
            className="input-field resize-none"
            placeholder="Tell customers about your craft, experience, and what makes your work stand out…"
          />
          <p className="text-xs text-ink/40 mt-1 text-right">{form.bio.length}/800</p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saved ? <Check size={18} /> : <Save size={18} />} {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
