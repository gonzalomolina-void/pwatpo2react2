import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SPLASH_BASE_URL = import.meta.env.VITE_SPLASH_URL;

/**
 * Listado de conceptos para las imágenes del Splash.
 */
const SPLASH_CONCEPTS = [
  { id: 'TheNexusGateway', alt: { es: 'El Portal del Nexo',  en: 'The Nexus Gateway'} },
  { id: 'ClashOfPowers', alt: {es: 'Choque de Poderes', en: 'Clash of Powers'} },
  { id: 'TheInfiniteArchive', alt: {es: 'El Archivo Infinito', en: 'The Infinite Archive'} },
  { id: 'GuardianOfTheCrystal', alt: {es: 'Guardián del Cristal', en: 'Guardian of the Crystal'} },
  { id: 'TheAncientSummoning', alt: {es: 'La Invocación Ancestral', en: 'The Ancient Summoning'} }
];

/**
 * Función para obtener un concepto aleatorio de forma segura.
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
  const [imageLoaded, setImageLoaded] = useState(false); // Nuevo estado
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  
  const [selectedConcept] = useState(getRandomConcept);

  useEffect(() => {
    // Solo arrancamos el timer si la imagen ya se cargó
    if (!imageLoaded) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 2500); // Bajamos un toque el tiempo ya que esperamos a la carga

    return () => clearTimeout(timer);
  }, [onComplete, imageLoaded]);

  const conceptAlt = selectedConcept.alt[lang] || selectedConcept.alt['es'];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Fondo con brillo místico */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute top-1/4 left-1/4 h-75 w-75 animate-pulse rounded-full bg-purple-500/10 blur-[100px] [animation-delay:1s]"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Contenedor de la Imagen Épica */}
        <div className={`group relative mb-8 aspect-9/16 w-full max-w-md transition-opacity duration-1000 md:aspect-video md:max-w-none ${imageLoaded ? 'opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
          
          <picture>
            <source 
              srcSet={`${SPLASH_BASE_URL}${selectedConcept.id}_wide.png`} 
              media="(min-width: 768px)" alt={conceptAlt}
            />
            <img 
              src={`${SPLASH_BASE_URL}${selectedConcept.id}_mobile.png`} 
              alt={conceptAlt} 
              onLoad={() => setImageLoaded(true)} // ¡ACÁ ESTÁ LA MAGIA!
              className="relative h-full w-full transform rounded-2xl object-cover shadow-2xl transition-transform duration-500 hover:scale-102"
              onError={(e) => {
                e.target.src = '/cards/Portada.png';
                e.target.onerror = null;
                setImageLoaded(true); // Si falla, igual seguimos para no trabar la app
              }}
            />
          </picture>
        </div>

        {/* Título y Lemas */}
        <h1 className="mb-2 bg-linear-to-b from-white to-slate-400 bg-clip-text text-5xl font-black tracking-tighter text-transparent uppercase italic drop-shadow-lg md:text-6xl">
          HEXA
        </h1>
        <p className="animate-pulse text-sm font-bold tracking-[0.3em] text-blue-400 uppercase md:text-base">
          {conceptAlt}...
        </p>

        {/* Barra de progreso decorativa */}
        <div className="mx-auto mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800 md:w-64">
          <div className="h-full animate-[progress_3s_ease-in-out_infinite] bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500"></div>
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
