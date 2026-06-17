import { useTranslation } from 'react-i18next';
import { useEffect, useCallback, useState } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useInfiniteCards } from '../hooks/useInfiniteCards';
import { lookupService } from '../services/lookupService';
import { useAuth } from '../context/AuthContext';
import CardFormModal from '../components/CardFormModal';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', selectedTypes: [], selectedRarities: [] });
  const [typeOptions, setTypeOptions] = useState([]);
  const [rarityOptions, setRarityOptions] = useState([]);

  const handleEditCard = useCallback((id) => {
    setSelectedCardId(id);
    setIsModalOpen(true);
  }, []);

  const lang = i18n.language.startsWith('es') ? 'es' : 'en';

  // Cargar tipos y rarezas dinámicamente según el idioma
  useEffect(() => {
    lookupService.getTypes()
      .then((data) => {
        setTypeOptions(data.map(t => ({
          value: t.code,
          label: t.name
        })));
      })
      .catch(console.error);

    lookupService.getRarities()
      .then((data) => {
        setRarityOptions(data.map(r => ({
          value: r.code,
          label: r.name
        })));
      })
      .catch(console.error);
  }, [i18n.language]);

  const {
    cards,
    isLoading,
    error,
    hasMore,
    page,
    handleSearch: triggerSearch,
    updateCardOptimistic,
    lastCardElementRef
  } = useInfiniteCards({
    limit: 12,
    initialFilters: { searchTerm: '', selectedTypes: [], selectedRarities: [] },
    lang
  });

  const handleSearch = useCallback((newFilters) => {
    // Al buscar, reseteamos la posición guardada para que empiece desde arriba
    sessionStorage.removeItem('home_scroll_pos');
    window.scrollTo(0, 0);
    setSearchFilters(newFilters);
    triggerSearch(newFilters);
  }, [triggerSearch]);

  // Persistencia de Scroll
  useEffect(() => {
    // Desactivar la restauración automática del navegador
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Restaurar scroll si hay un valor guardado y tenemos cartas
    const savedScroll = sessionStorage.getItem('home_scroll_pos');
    if (savedScroll && cards.length > 0) {
      // Usamos requestAnimationFrame para esperar al siguiente frame de pintura
      const timer = setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScroll, 10),
          behavior: 'instant'
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [cards.length]);

  // Guardar scroll periódicamente mientras el usuario navega
  useEffect(() => {
    const handleScroll = () => {
      // Solo guardamos si no estamos en el tope (para evitar falsos resets)
      if (window.scrollY > 0) {
        sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSuccess = useCallback((result) => {
    if (!result) {
      handleSearch({ searchTerm: '', selectedTypes: [], selectedRarities: [] });
      return;
    }

    const { action, card } = result;

    if (action === 'create' || action === 'delete') {
      handleSearch({ searchTerm: '', selectedTypes: [], selectedRarities: [] });
    } else if (action === 'edit' && card) {
      updateCardOptimistic(card);
      triggerSearch(searchFilters);
    }
  }, [handleSearch, triggerSearch, searchFilters, updateCardOptimistic]);

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block max-w-md rounded-xl border border-red-500/50 bg-red-500/10 p-6">
          <p className="mb-4 font-medium text-red-400">{t('home.error')}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
          >
            {t('home.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="mb-12">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-4xl font-extrabold text-transparent dark:from-blue-400 dark:to-purple-500">
            {t('home.title')}
          </h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer self-start rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 active:scale-95 sm:self-center"
              aria-label={t('card.admin.newCard')}
              title={t('card.admin.newCard')}
            >
              {t('card.admin.newCard')}
            </button>
          )}
        </div>
        <p className="mb-8 max-w-3xl text-slate-600 dark:text-slate-400">
          {t('home.description')}
        </p>

        <SearchBar
          onSearch={handleSearch}
          typeOptions={typeOptions}
          rarityOptions={rarityOptions}
          filters={searchFilters}
        />
      </header>

      {isLoading && page === 1 ? (
        <div className="flex min-h-[40vh] items-center justify-center py-12">
          <LoadingSpinner message={t('home.loading')} />
        </div>
      ) : (
        <>
          {cards.length === 0 ? (
            <div className="py-12 text-center text-xl text-slate-400 dark:text-slate-500">
              {t('home.noResults')}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isLoading && page === 1 ? 'opacity-50' : 'opacity-100'}`}>
              {cards.map((card, index) => {
                const isLast = cards.length === index + 1;
                return (
                  <Card
                    key={card.id}
                    card={card}
                    ref={isLast ? lastCardElementRef : null}
                    onEdit={handleEditCard}
                  />
                );
              })}
            </div>
          )}

          {/* Indicador de carga para páginas siguientes */}
          {isLoading && page > 1 && (
            <div className="flex justify-center py-12">
              <LoadingSpinner message={t('home.loading')} />
            </div>
          )}

          {/* Mensaje de final del catálogo */}
          {!hasMore && cards.length > 0 && (
            <div className="mt-12 border-t border-slate-200 py-12 text-center text-slate-500 italic dark:border-slate-800">
              {t('home.endOfCatalog')}
            </div>
          )}
        </>
      )}

      <CardFormModal
        isOpen={isModalOpen}
        cardId={selectedCardId}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCardId(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}