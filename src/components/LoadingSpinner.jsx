/**
 * LoadingSpinner - Componente de carga épico para TCG Nexus.
 * Simula un orbe de energía mística con anillos orbitales.
 */
export default function LoadingSpinner({ message = "Invocando criaturas..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative w-24 h-24 mb-6 group">
        {/* Anillo exterior - Giro lento */}
        <div className="absolute inset-0 border-t-2 border-l-2 border-blue-500/30 rounded-full animate-spin [animation-duration:3s]"></div>
        
        {/* Anillo medio - Giro medio invertido */}
        <div className="absolute inset-2 border-r-2 border-b-2 border-purple-500/40 rounded-full animate-spin [animation-direction:reverse] [animation-duration:2s]"></div>
        
        {/* Anillo interior - Giro rápido */}
        <div className="absolute inset-4 border-l-2 border-cyan-400/60 rounded-full animate-spin [animation-duration:1s]"></div>

        {/* Orbe Central */}
        <div className="absolute inset-7 bg-linear-to-br from-blue-400 via-cyan-300 to-purple-600 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse flex items-center justify-center overflow-hidden">
          {/* Brillo interno */}
          <div className="w-full h-full bg-white/20 blur-sm transform -rotate-45 translate-x-1/2 -translate-y-1/2 animate-pulse [animation-duration:1.5s]"></div>
        </div>

        {/* Partículas orbitales (simuladas con sombras) */}
        <div className="absolute -inset-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse [animation-duration:4s]"></div>
      </div>

      {/* Mensaje de carga */}
      <div className="space-y-2">
        <p className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase tracking-widest animate-pulse">
          {message}
        </p>
        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-linear-to-r from-blue-500 to-cyan-400 animate-[loading-bar_2s_infinite]"></div>
        </div>
      </div>

      {/* Definición de la animación de la barra de carga */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
