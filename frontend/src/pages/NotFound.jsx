import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-display text-7xl font-semibold text-rust-500">404</p>
      <div className="stitch-line text-gold-500 w-16 my-5" />
      <h1 className="font-display text-2xl font-semibold mb-2">Lost a stitch somewhere</h1>
      <p className="text-ink/60 mb-8 max-w-sm">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary"><Home size={16} /> Back to home</Link>
    </div>
  );
}
