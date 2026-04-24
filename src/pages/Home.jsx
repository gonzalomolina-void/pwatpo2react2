import { useState, useEffect, useCallback } from 'react';
import cardService from '../services/cardService';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';

const TYPE_OPTIONS = ['Criatura', 'Hechizo', 'Artefacto'];
const RARITY_OPTIONS = ['Pobre', 'Común', 'Poco Común', 'Raro', 'Épico', 'Legendario'];

export default function Home() {
  const [cards, setCards] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ selectedTypes: [], selectedRarities: [] });

  const fetchCards = async (searchQuery = '', isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setIsSearching(true);
      }
      setError(null);
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await cardService.getCards(params);
      setCards(data);
    } catch (err) {
      setError('No se pudo cargar el catalogo de cartas. Por favor, reintenta mas tarde.');
    } finally {
      setInitialLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchCards('', true);
  }, []);

  const handleSearch = useCallback(({ searchTerm, selectedTypes, selectedRarities }) => {
    setActiveFilters({ selectedTypes, selectedRarities });
    fetchCards(searchTerm);
  }, []);

  const filteredCards = cards.filter(card => {
    const matchType = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(card.es.type);
    const matchRarity = activeFilters.selectedRarities.length === 0 || activeFilters.selectedRarities.includes(card.es.rarity);
    return matchType && matchRarity;
  });


  if (initialLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 animate-pulse">Invocando criaturas del Nexo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl inline-block max-w-md">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
          Catalogo de Cartas
        </h1>
        <p className="text-slate-400 max-w-2xl mb-8">
          Explora la coleccion completa de cartas de TCG Nexus. Criaturas, hechizos y artefactos te esperan para tu mazo.
        </p>

        <SearchBar
          onSearch={handleSearch}
          typeOptions={TYPE_OPTIONS}
          rarityOptions={RARITY_OPTIONS}
        />
      </header>

      { }
      {isSearching && (
        <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          Buscando...
        </div>
      )}

      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xl">
          No se encontraron resultados
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
          {filteredCards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
