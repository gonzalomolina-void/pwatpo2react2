import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <section 
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors text-2xl leading-none"
          onClick={onClose} 
          aria-label="Cerrar"
        >
          &times;
        </button>

        {/* Encabezado */}
        {title && (
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          </div>
        )}

        {/* Cuerpo con scroll oculto pero funcional */}
        <div className="p-6 overflow-y-auto scrollbar-hide text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </section>
    </div>,
    document.body
  );
};

export default Modal;
