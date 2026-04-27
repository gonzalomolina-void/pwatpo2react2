import BackButton from '../components/BackButton';

export default function NotFound() {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center min-h-[60vh] relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-duration:4s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse [animation-duration:2.5s]"></div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border border-purple-500/20 rounded-full animate-spin [animation-duration:12s]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-56 border border-blue-500/10 rounded-full animate-spin [animation-direction:reverse] [animation-duration:18s]"></div>
        </div>

        <h1 className="text-[10rem] font-black leading-none bg-linear-to-b from-purple-400 via-blue-500 to-slate-800 bg-clip-text text-transparent select-none drop-shadow-2xl">
          404
        </h1>

      </div>

      <h2 className="text-2xl font-bold bg-linear-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent mb-3">
        Carta no encontrada
      </h2>
      <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
        Esta carta se ha perdido en el Nexo dimensional. 
        Quizás fue devorada por Xal'Thun, o simplemente nunca existió.
      </p>

      <BackButton to="/" label="Volver al catálogo" />
    </div>
  );
}
