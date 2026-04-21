export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TCG Nexus - Uncoma PWA</p>
        <p className="mt-2 italic">Explorá el universo de las cartas</p>
      </div>
    </footer>
  );
}
