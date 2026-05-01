import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useInfiniteCards } from '../hooks/useInfiniteCards';
import { TYPE_OPTIONS, RARITY_OPTIONS } from '../constants/game';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';

  // Mapeamos las constantes a sus objetos de opción { value, label }
  const typeOptions = TYPE_OPTIONS.map(key => ({
    value: key,
    label: t(`home.filters.types.${key}`)
  }));

  const rarityOptions = RARITY_OPTIONS.map(key => ({
    value: key,
    label: t(`home.filters.rarities.${key}`)
  }));

  const {
    cards,
    isLoading,
    error,
    hasMore,
    page,
    handleSearch,
    lastCardElementRef
  } = useInfiniteCards({
    limit: 12,
    initialFilters: { searchTerm: '', selectedTypes: [], selectedRarities: [] },
    lang
  });

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
        <h1 className="mb-4 inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-4xl font-extrabold text-transparent dark:from-blue-400 dark:to-purple-500">
          {t('home.title')}
        </h1>
        <p className="mb-8 max-w-3xl text-slate-600 dark:text-slate-400">
          {t('home.description')}
        </p>

        <SearchBar
          onSearch={handleSearch}
          typeOptions={typeOptions}
          rarityOptions={rarityOptions}
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
                return <Card key={card.id} card={card} ref={isLast ? lastCardElementRef : null} />;
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
    </div>
  );
}