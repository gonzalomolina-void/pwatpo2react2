import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import cardService from '../services/cardService';
import { CARD_TYPES, CARD_RARITIES } from '../constants/cardConstants';
import LoadingSpinner from './LoadingSpinner';

export default function CardFormModal({ isOpen, cardId, onClose, onSuccess }) {
  const { t } = useTranslation();

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Campos globales del formulario
  const [cost, setCost] = useState('');
  const [atk, setAtk] = useState('');
  const [def, setDef] = useState('');
  const [image, setImage] = useState('');
  const [typeId, setTypeId] = useState('');
  const [rarityId, setRarityId] = useState('');

  // Diccionario de traducciones
  const [translations, setTranslations] = useState({
    es: { name: '', description: '' },
    en: { name: '', description: '' }
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isOpen && cardId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetching(true);
      setError('');
      cardService.getCardForEdit(cardId)
        .then((data) => {
          setCost(data.cost ?? '');
          setAtk(data.atk ?? '');
          setDef(data.def ?? '');
          setImage(data.image ?? '');
          setTypeId(data.typeId ? String(data.typeId) : '');
          setRarityId(data.rarityId ? String(data.rarityId) : '');
          setTranslations({
            es: {
              name: data.translations?.es?.name ?? '',
              description: data.translations?.es?.description ?? ''
            },
            en: {
              name: data.translations?.en?.name ?? '',
              description: data.translations?.en?.description ?? ''
            }
          });
        })
        .catch((err) => {
          console.error(err);
          setError(t('card.admin.fetchError') || 'Error al cargar los datos de la carta.');
        })
        .finally(() => {
          setFetching(false);
        });
    } else {
      // Limpiar formulario en caso de alta
      setCost('');
      setAtk('');
      setDef('');
      setImage('');
      setTypeId('');
      setRarityId('');
      setTranslations({
        es: { name: '', description: '' },
        en: { name: '', description: '' }
      });
      setError('');
      setShowDeleteConfirm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cardId]);

  const handleTranslationChange = (lang, field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      cost: cost !== '' ? Number(cost) : 0,
      atk: atk !== '' ? Number(atk) : 0,
      def: def !== '' ? Number(def) : 0,
      image,
      typeId: typeId !== '' ? Number(typeId) : 1,
      rarityId: rarityId !== '' ? Number(rarityId) : 1,
      translations: [
        { language: 'es', name: translations.es.name, description: translations.es.description },
        { language: 'en', name: translations.en.name, description: translations.en.description }
      ]
    };

    try {
      if (cardId) {
        await cardService.updateCard(cardId, payload);
      } else {
        await cardService.createCard(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('card.admin.saveError') || 'Error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await cardService.deleteCard(cardId);
      if (onSuccess) onSuccess();
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('card.admin.saveError') || 'Error al eliminar la carta.');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.cost')}
              </label>
              <input
                type="number"
                data-testid="input-cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.atk')}
              </label>
              <input
                type="number"
                data-testid="input-atk"
                value={atk}
                onChange={(e) => setAtk(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.def')}
              </label>
              <input
                type="number"
                data-testid="input-def"
                value={def}
                onChange={(e) => setDef(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.image')}
              </label>
              <input
                type="text"
                data-testid="input-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.type')}
              </label>
              <select
                data-testid="select-type"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              >
                <option value="">{t('search.clear') || 'Seleccionar...'}</option>
                {CARD_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {t(type.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {t('card.admin.rarity')}
              </label>
              <select
                data-testid="select-rarity"
                value={rarityId}
                onChange={(e) => setRarityId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              >
                <option value="">{t('search.clear') || 'Seleccionar...'}</option>
                {CARD_RARITIES.map((rarity) => (
                  <option key={rarity.id} value={rarity.id}>
                    {t(rarity.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Traducciones */}
          <div className="space-y-4">
            <h4 className="border-b border-slate-700 pb-2 text-sm font-bold tracking-wide text-slate-300 uppercase">
              {t('card.admin.translations')}
            </h4>

            {/* Español */}
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-400/30 ring-inset">
                Español
              </span>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">
                  {t('card.admin.name')}
                </label>
                <input
                  type="text"
                  data-testid="input-name-es"
                  value={translations.es.name}
                  onChange={(e) => handleTranslationChange('es', 'name', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">
                  {t('card.admin.description')}
                </label>
                <textarea
                  data-testid="textarea-desc-es"
                  value={translations.es.description}
                  onChange={(e) => handleTranslationChange('es', 'description', e.target.value)}
                  rows="2"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Inglés */}
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-400/30 ring-inset">
                English
              </span>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">
                  {t('card.admin.name')}
                </label>
                <input
                  type="text"
                  data-testid="input-name-en"
                  value={translations.en.name}
                  onChange={(e) => handleTranslationChange('en', 'name', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">
                  {t('card.admin.description')}
                </label>
                <textarea
                  data-testid="textarea-desc-en"
                  value={translations.en.description}
                  onChange={(e) => handleTranslationChange('en', 'description', e.target.value)}
                  rows="2"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

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
      {showDeleteConfirm && (
        <div
          data-testid="delete-confirm-dialog"
          className="animate-in fade-in fixed inset-0 z-110 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm duration-200"
        >
          <div className="animate-in zoom-in-95 w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl duration-200">
            <h3 className="mb-2 text-lg font-bold text-slate-100">
              {t('card.admin.deleteConfirmTitle')}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {t('card.admin.deleteConfirmMsg', { name: translations[t('card.admin.language') || 'es']?.name || translations.es.name })}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
                disabled={loading}
              >
                {t('card.admin.deleteCancelBtn')}
              </button>
              <button
                type="button"
                data-testid="btn-confirm-delete"
                onClick={handleDelete}
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
      )}
    </Modal>
  );
}
