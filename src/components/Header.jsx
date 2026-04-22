import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TCG Nexus
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/favoritos" className="hover:text-blue-400 transition-colors">Favoritos</Link>
        </nav>
      </div>
    </header>
  );
}
