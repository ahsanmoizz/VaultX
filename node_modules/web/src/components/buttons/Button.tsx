export default function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
  <button
    onClick={onClick}
    className={`bg-brand.primary hover:bg-brand.secondary hover:text-black text-black font-semibold px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);

}
