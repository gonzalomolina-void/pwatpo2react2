import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import TeamMember from './TeamMember';

// Importar avatars de los integrantes
import avatarLautaro from '../assets/Bart.jpg';
import avatarJuan from '../assets/Vegeta.webp';
import avatarGonzalo from '../assets/Grommash.webp';

const AcercaDe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEpictetus, setShowEpictetus] = useState(false);
  const { t } = useTranslation();

  const handleEasterEgg = (e) => {
    if (e.ctrlKey) {
      setShowEpictetus(!showEpictetus);
    }
  };

  // Soporte para móviles: Long Press (mantener presionado)
  const [pressTimer, setPressTimer] = useState(null);

  const startPress = () => {
    const timer = setTimeout(() => {
      setShowEpictetus(prev => !prev);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 800);
    setPressTimer(timer);
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const integrantes = [
    {
      nombre: 'Lautaro Mellado',
      legajo: 'FAI-2659',
      rol: t('about.roles.pm'),
      avatar: avatarLautaro
    },
    {
      nombre: 'Gonzalo Molina',
      legajo: '42524',
      rol: t('about.roles.developer'),
      avatar: avatarGonzalo
    }, 
    {
      nombre: 'Juan Cruz Espinoza',
      legajo: 'FAI-4767',
      rol: t('about.roles.developer'),
      avatar: avatarJuan
    }
  ];

  return (
    <>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-lg transition-all hover:scale-110 hover:border-blue-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800"
        onClick={() => setIsOpen(true)}
        aria-label={t('about.title')}
        title={t('about.title')}
      >
        📜
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setShowEpictetus(false);
        }}
        title={t('about.title')}
      >
        <div className="text-center">
          <p className="mb-6 text-sm text-slate-500 italic dark:text-slate-400">
            {t('about.description')}
          </p>

          <blockquote className="mx-auto mb-8 max-w-md rounded-r-lg border-l-4 border-blue-500 bg-slate-50 p-4 font-serif italic dark:bg-slate-900/50">
            <p className="mb-2 text-lg leading-relaxed text-slate-800 dark:text-slate-100">
              "{showEpictetus ? t('about.easterEggQuote') : t('about.quote')}"
            </p>
            <cite 
              className="block cursor-help text-right text-sm font-bold text-slate-500 select-none dark:text-slate-400"
              onDoubleClick={handleEasterEgg}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
              onTouchMove={cancelPress}
            >
              — {showEpictetus ? t('about.easterEggAuthor') : t('about.quoteAuthor')}
            </cite>
          </blockquote>

          <div className="mb-8 flex flex-wrap justify-center gap-4 md:flex-nowrap">
            {integrantes.map((i, index) => (
              <TeamMember key={index} {...i} />
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700/50">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              HEXA TCG (PWA TPO2) - React 2026
            </p>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              v{import.meta.env.PACKAGE_VERSION}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AcercaDe;
