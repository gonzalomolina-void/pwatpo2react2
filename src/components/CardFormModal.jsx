import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { useCardForm } from '../hooks/useCardForm';
import CardStatsGrid from './CardStatsGrid';
import CardTranslationsForm from './CardTranslationsForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function CardFormModal({ isOpen, cardId, onClose, onSuccess }) {
  const { t } = useTranslation();

  const {
    loading,
    fetching,
    error,
    showDeleteConfirm,
    setShowDeleteConfirm,
    cost,
    setCost,
    atk,
    setAtk,
    def,
    setDef,
    image,
    setImage,
    typeId,
    setTypeId,
    rarityId,
    setRarityId,
    translations,
    handleTranslationChange,
    handleSubmit,
    handleDelete,
    types,
    rarities
  } = useCardForm({ cardId, isOpen, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cardId ? t('card.admin.editTitle') : t('card.admin.createTitle')}
    >
      {fetching ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} data-testid="form-card" className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Grid de Datos Globales */}
          <CardStatsGrid
            cost={cost}
            setCost={setCost}
            atk={atk}
            setAtk={setAtk}
            def={def}
            setDef={setDef}
            image={image}
            setImage={setImage}
            typeId={typeId}
            setTypeId={setTypeId}
            rarityId={rarityId}
            setRarityId={setRarityId}
            typeOptions={types}
            rarityOptions={rarities}
          />

          {/* Tabla de Traducciones */}
          <CardTranslationsForm
            translations={translations}
            onChange={handleTranslationChange}
          />

          {/* Botones de acción */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div>
              {cardId && (
                <button
                  type="button"
                  data-testid="btn-delete"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-600/20"
                  disabled={loading}
                >
                  {t('card.admin.delete')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
                disabled={loading}
              >
                {t('card.admin.cancel')}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 active:scale-95 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  t('card.admin.save')
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Segundo Dialog de Confirmación de Borrado */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        cardName={translations[t('card.admin.language') || 'es']?.name || translations.es.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={loading}
      />
    </Modal>
  );
}
