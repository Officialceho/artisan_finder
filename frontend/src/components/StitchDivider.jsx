export default function StitchDivider({ className = '', color = 'text-ink/20' }) {
  return <div className={`stitch-line ${color} ${className}`} role="presentation" />;
}
