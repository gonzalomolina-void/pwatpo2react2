import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';
import { lookupService } from '../services/lookupService';
import { useToast } from '../context/ToastContext';

export function useCardForm({ cardId, isOpen, onSuccess, onClose }) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isOpen);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sincronizar fetching y error inline cuando isOpen cambia a true
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFetching(true);
      setError('');
    }
  }

  // Opciones dinámicas cargadas de la API
  const [types, setTypes] = useState([]);
  const [rarities, setRarities] = useState([]);

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

  // Cargar datos si estamos en modo edición o alta
  useEffect(() => {
    if (!isOpen) return;

    const typesPromise = lookupService.getTypes();
    const raritiesPromise = lookupService.getRarities();
    const cardPromise = cardId ? cardService.getCardForEdit(cardId) : Promise.resolve(null);

    Promise.all([typesPromise, raritiesPromise, cardPromise])
      .then(([typesData, raritiesData, cardData]) => {
        setTypes(typesData);
        setRarities(raritiesData);

        if (cardData) {
          setCost(cardData.cost ?? '');
          setAtk(cardData.atk ?? '');
          setDef(cardData.def ?? '');
          setImage(cardData.image ?? '');
          const matchedType = typesData.find(t => t.code === cardData.typeCode);
          const matchedRarity = raritiesData.find(r => r.code === cardData.rarityCode);
          setTypeId(matchedType ? String(matchedType.id) : '');
          setRarityId(matchedRarity ? String(matchedRarity.id) : '');
          setTranslations({
            es: {
              name: cardData.translations?.es?.name ?? '',
              description: cardData.translations?.es?.description ?? ''
            },
            en: {
              name: cardData.translations?.en?.name ?? '',
              description: cardData.translations?.en?.description ?? ''
            }
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
          setShowDeleteConfirm(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(t('card.admin.fetchError') || 'Error al cargar los datos.');
      })
      .finally(() => {
        setFetching(false);
      });
  }, [isOpen, cardId, t]);

  const handleTranslationChange = useCallback((lang, field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
        const updatedCard = await cardService.updateCard(cardId, payload);
        showToast(t('card.admin.updateSuccess'), 'success');
        if (onSuccess) onSuccess({ action: 'edit', card: updatedCard });
      } else {
        const createdCard = await cardService.createCard(payload);
        showToast(t('card.admin.createSuccess'), 'success');
        if (onSuccess) onSuccess({ action: 'create', card: createdCard });
      }
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError(t('card.admin.saveError') || 'Error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  }, [cost, atk, def, image, typeId, rarityId, translations, cardId, onSuccess, onClose, showToast, t]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await cardService.deleteCard(cardId);
      showToast(t('card.admin.deleteSuccess'), 'success');
      if (onSuccess) onSuccess({ action: 'delete', cardId });
      setShowDeleteConfirm(false);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError(t('card.admin.saveError') || 'Error al eliminar la carta.');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  }, [cardId, onSuccess, onClose, showToast, t]);

  return {
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
  };
}
