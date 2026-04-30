const sizeStyles = {
  sm: 'text-sm gap-1.5',
  lg: 'text-2xl gap-2',
};

export default function StatBadge({ icon, value, color, size = 'sm' }) {
  return (
    <span className={`flex items-center font-black ${color} ${sizeStyles[size]}`}>
      <span className="opacity-70">{icon}</span> {value}
    </span>
  );
}
