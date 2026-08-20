export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-rust-50 text-rust-500 flex items-center justify-center mb-5">
          <Icon size={28} />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ink mb-2">{title}</h3>
      {description && <p className="text-ink/60 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
