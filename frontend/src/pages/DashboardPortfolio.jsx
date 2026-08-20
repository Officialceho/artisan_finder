import { useRef, useState } from 'react';
import { UploadCloud, Trash2, Images } from 'lucide-react';
import client, { fileUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

export default function DashboardPortfolio() {
  const { artisan, updateArtisanLocal } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('portfolioImages', f));
      const { data } = await client.post('/artisans/portfolio', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateArtisanLocal(data.artisan);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageUrl) => {
    setDeletingUrl(imageUrl);
    setError('');
    try {
      const { data } = await client.delete('/artisans/portfolio', { data: { imageUrl } });
      updateArtisanLocal(data.artisan);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUrl('');
    }
  };

  const images = artisan?.portfolioImages || [];

  return (
    <div>
      <p className="eyebrow mb-2">Show your work</p>
      <h1 className="font-display text-3xl font-semibold mb-8">My Portfolio</h1>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-rust-50 text-rust-700 text-sm border border-rust-500/20">
          {error}
        </div>
      )}

      <div className="stitch-card p-8 mb-8 flex flex-col items-center text-center border-dashed">
        <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mb-4">
          <UploadCloud size={26} />
        </div>
        <p className="font-semibold mb-1">Upload photos of your completed work</p>
        <p className="text-sm text-ink/50 mb-5 max-w-sm">JPG, PNG, WEBP or GIF. You can select multiple images at once.</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary"
        >
          {uploading ? 'Uploading…' : 'Choose images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {images.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No portfolio images yet"
          description="Upload photos above so customers can see the quality of your craft before booking."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img} className="relative group aspect-square rounded-2xl overflow-hidden border border-ink/10">
              <img src={fileUrl(img)} alt="Portfolio work" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(img)}
                disabled={deletingUrl === img}
                className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                aria-label="Delete image"
              >
                <span className="w-10 h-10 rounded-full bg-rust-500 text-canvas-soft flex items-center justify-center">
                  <Trash2 size={16} />
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
