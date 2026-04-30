/**
 * LoadingSpinner - Componente de carga épico para HEXA.
 * Simula un orbe de energía mística con anillos orbitales.
 */
export default function LoadingSpinner({ message = "Invocando criaturas..." }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="group relative mb-6 h-24 w-24">
        {/* Anillo exterior - Giro lento */}
        <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-l-2 border-blue-500/30 [animation-duration:3s]"></div>
        
        {/* Anillo medio - Giro medio invertido */}
        <div className="absolute inset-2 animate-spin rounded-full border-r-2 border-b-2 border-purple-500/40 [animation-direction:reverse] [animation-duration:2s]"></div>
        
        {/* Anillo interior - Giro rápido */}
        <div className="absolute inset-4 animate-spin rounded-full border-l-2 border-cyan-400/60 [animation-duration:1s]"></div>

        {/* Orbe Central */}
        <div className="absolute inset-7 flex animate-pulse items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-400 via-cyan-300 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          {/* Brillo interno */}
          <div className="h-full w-full translate-x-1/2 -translate-y-1/2 -rotate-45 transform animate-pulse bg-white/20 blur-sm [animation-duration:1.5s]"></div>
        </div>

        {/* Partículas orbitales (simuladas con sombras) */}
        <div className="absolute -inset-2 animate-pulse rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)] [animation-duration:4s]"></div>
      </div>

      {/* Mensaje de carga */}
      <div className="space-y-2">
        <p className="animate-pulse bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-xl font-bold tracking-widest text-transparent uppercase">
          {message}
        </p>
        <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full animate-[loading-bar_2s_infinite] bg-linear-to-r from-blue-500 to-cyan-400"></div>
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
