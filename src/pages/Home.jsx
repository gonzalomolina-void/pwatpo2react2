import { useState, useEffect } from 'react';
import cardService from '../services/cardService';
import Card from '../components/Card';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRarity, setFilterRarity] = useState('');

  const fetchCards = async (searchQuery = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await cardService.getCards(params);
      setCards(data);
    } catch (err) {
      setError('No se pudo cargar el catalogo de cartas. Por favor, reintenta mas tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCards(searchTerm);
  };

  const filteredCards = cards.filter(card => {
    const matchType = filterType === '' || card.es.type === filterType;
    const matchRarity = filterRarity === '' || card.es.rarity === filterRarity;
    return matchType && matchRarity;
  });

  if (isLoading) {
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

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los Tipos</option>
            <option value="Criatura">Criatura</option>
            <option value="Hechizo">Hechizo</option>
            <option value="Artefacto">Artefacto</option>
          </select>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Todas las Rarezas</option>
            <option value="Pobre">Pobre</option>
            <option value="Común">Común</option>
            <option value="Poco Común">Poco Común</option>
            <option value="Raro">Raro</option>
            <option value="Épico">Épico</option>
            <option value="Legendario">Legendario</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Buscar
          </button>
        </form>
      </header>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xl">
          No se encontraron resultados
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
