import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

// Importar avatars de los integrantes
import avatarLautaro from '../assets/Bart.jpg';
import avatarJuan from '../assets/Vegeta.webp';
import avatarGonzalo from '../assets/Grommash.webp';

const AcercaDe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const integrantes = [
    { 
      nombre: 'Juan Cruz Espinoza', 
      legajo: 'FAI-4767', 
      rol: t('about.roles.developer'),
      avatar: avatarJuan
    },
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
        onClose={() => setIsOpen(false)} 
        title={t('about.title')}
      >
        <div className="text-center">
          <p className="mb-6 text-sm text-slate-500 italic dark:text-slate-400">
            {t('about.description')}
          </p>
          
          <blockquote className="mx-auto mb-8 max-w-md rounded-r-lg border-l-4 border-blue-500 bg-slate-50 p-4 font-serif italic dark:bg-slate-900/50">
            <p className="mb-2 text-lg leading-relaxed text-slate-800 dark:text-slate-100">
              "{t('about.quote')}"
            </p>
            <cite className="block text-right text-sm font-bold text-slate-500 dark:text-slate-400">— {t('about.quoteAuthor')}</cite>
          </blockquote>

          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {integrantes.map((i, index) => (
              <div key={index} className="flex w-36 flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-md transition-colors hover:border-blue-500/30 dark:border-slate-700/50 dark:bg-slate-900/40">
                <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  <img src={i.avatar} alt={i.nombre} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1 text-center">
                  <strong className="block text-xs leading-tight text-slate-800 dark:text-slate-100">{i.nombre}</strong>
                  <span className="block text-[10px] tracking-tighter text-slate-500 uppercase dark:text-slate-500">{t('about.studentId')}: {i.legajo}</span>
                  <span className="mt-2 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-black text-blue-600 uppercase dark:text-blue-400">
                    {i.rol}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700/50">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              PWA TPO2 - React 2026
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AcercaDe;
