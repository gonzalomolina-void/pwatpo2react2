import { useState } from 'react';
import Modal from './Modal';

// Importar avatars de los integrantes
import avatarLautaro from '../assets/Bart.jpg';
import avatarJuan from '../assets/Vegeta.webp';
import avatarGonzalo from '../assets/Grommash.webp';

const AcercaDe = () => {
  const [isOpen, setIsOpen] = useState(false);

  const integrantes = [
    { 
      nombre: 'Juan Cruz Espinoza', 
      legajo: 'FAI-4767', 
      rol: 'Developer',
      avatar: avatarJuan
    },
    { 
      nombre: 'Lautaro Mellado', 
      legajo: 'FAI-2659', 
      rol: 'Developer',
      avatar: avatarLautaro
    },
    { 
      nombre: 'Gonzalo Molina', 
      legajo: '42524', 
      rol: 'PM',
      avatar: avatarGonzalo
    }
  ];

  return (
    <>
      <button 
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg hover:scale-110 hover:border-blue-500 transition-all shadow-lg active:scale-95" 
        onClick={() => setIsOpen(true)}
        aria-label="Acerca de nosotros"
        title="Ver Lore del equipo"
      >
        📜
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Acerca de nosotros"
      >
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm italic mb-6">
            Proyecto desarrollado para la cátedra de Programación Web Avanzada.
          </p>
          
          <blockquote className="max-w-md mx-auto p-4 mb-8 border-l-4 border-blue-500 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg font-serif italic">
            <p className="text-slate-800 dark:text-slate-100 text-lg leading-relaxed mb-2">
              "Preguntate en todo momento: ¿Es esto necesario?"
            </p>
            <cite className="text-sm font-bold text-slate-500 dark:text-slate-400 block text-right">— Marco Aurelio</cite>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {integrantes.map((i, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 rounded-xl w-36 shadow-md hover:border-blue-500/30 transition-colors">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] mb-3">
                  <img src={i.avatar} alt={i.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="text-center space-y-1">
                  <strong className="text-xs text-slate-800 dark:text-slate-100 block leading-tight">{i.nombre}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase tracking-tighter">Legajo: {i.legajo}</span>
                  <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full uppercase border border-blue-500/30">
                    {i.rol}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              PWA TPO2 - React 2026
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AcercaDe;
