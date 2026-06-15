import { useTranslation } from 'react-i18next';

export default function DeleteConfirmDialog({
  isOpen,
  cardName,
  onConfirm,
  onCancel,
  loading,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      data-testid="delete-confirm-dialog"
      className="animate-in fade-in fixed inset-0 z-110 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm duration-200"
    >
      <div className="animate-in zoom-in-95 w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl duration-200">
        <h3 className="mb-2 text-lg font-bold text-slate-100">
          {t('card.admin.deleteConfirmTitle')}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          {t('card.admin.deleteConfirmMsg', { name: cardName })}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
            disabled={loading}
          >
            {t('card.admin.deleteCancelBtn')}
          </button>
          <button
            type="button"
            data-testid="btn-confirm-delete"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              t('card.admin.deleteConfirmBtn')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
