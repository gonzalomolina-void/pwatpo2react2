import { useState, useEffect } from 'react';

const SPLASH_BASE_URL = import.meta.env.VITE_SPLASH_URL;

/**
 * Listado de conceptos para las imágenes del Splash.
 */
const SPLASH_CONCEPTS = [
  { id: 'TheNexusGateway', alt: { es: 'El Portal del Nexo',  en: 'The Nexus Gateway'} },
  { id: 'ClashOfPowers', alt: {es: 'Choque de Poderes', en: 'Clash of Powers'} },
  { id: 'TheInfiniteArchive', alt: {es: 'El Archivo Infinito', en: 'Guardian of the Crystal'} },
  { id: 'GuardianOfTheCrystal', alt: {es: 'Guardián del Cristal', en: 'Guardian of the Crystal'} },
  { id: 'TheAncientSummoning', alt: {es: 'La Invocación Ancestral', en: 'The Ancient Summoning'} }
];

/**
 * Función para obtener un concepto aleatorio de forma segura.
 * La definimos fuera para que el linter no chille por impureza en el render.
 */
const getRandomConcept = () => {
  const randomIndex = Math.floor(Math.random() * SPLASH_CONCEPTS.length);
  return SPLASH_CONCEPTS[randomIndex];
};

/**
 * SplashScreen - Pantalla de presentación épica para TCG Nexus.
 */
export default function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  
  // Usamos un inicializador de estado perezoso (lazy initializer)
  // Esto se ejecuta solo una vez cuando el componente se monta.
  const [selectedConcept] = useState(getRandomConcept);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 100000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Fondo con brillo místico */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-75 h-75 bg-purple-500/10 blur-[100px] rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6 text-center">
        {/* Contenedor de la Imagen Épica */}
        <div className="relative mb-8 group w-full max-w-md md:max-w-none aspect-9/16 md:aspect-video">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <picture>
            <source 
              srcSet={`${SPLASH_BASE_URL}${selectedConcept.id}_wide.png`} 
              media="(min-width: 768px)" alt={selectedConcept.alt.es}
            />
            <img 
              src={`${SPLASH_BASE_URL}${selectedConcept.id}_mobile.png`} 
              alt={selectedConcept.alt.es} 
              className="relative rounded-2xl shadow-2xl w-full h-full object-cover transform transition-transform duration-500 hover:scale-102"
              onError={(e) => {
                e.target.src = '/cards/Portada.png';
                e.target.onerror = null;
              }}
            />
          </picture>
        </div>

        {/* Título y Lemas */}
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-2 bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-lg uppercase">
          TCG NEXUS
        </h1>
        <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-sm md:text-base animate-pulse">
          {selectedConcept.alt.es}...
        </p>

        {/* Barra de progreso decorativa */}
        <div className="mt-8 w-48 md:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500 animate-[progress_3s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
