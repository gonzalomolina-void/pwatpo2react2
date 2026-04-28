import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm duration-300"
      onClick={onClose}
    >
      <section 
        className="animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl duration-300 dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          className="absolute top-4 right-4 text-2xl leading-none text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-white"
          onClick={onClose} 
          aria-label="Cerrar"
        >
          &times;
        </button>

        {/* Encabezado */}
        {title && (
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          </div>
        )}

        {/* Cuerpo con scroll oculto pero funcional */}
        <div className="scrollbar-hide overflow-y-auto p-6 text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </section>
    </div>,
    document.body
  );
};

export default Modal;
