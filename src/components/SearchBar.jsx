import { useState } from 'react';

export default function SearchBar({
  onSearch,
  typeOptions = [],
  rarityOptions = [],
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRarity, setFilterRarity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, filterType, filterRarity });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFilterType(newType);
    onSearch({ searchTerm, filterType: newType, filterRarity });
  };

  const handleRarityChange = (e) => {
    const newRarity = e.target.value;
    setFilterRarity(newRarity);
    onSearch({ searchTerm, filterType, filterRarity: newRarity });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
      />
      {typeOptions.length > 0 && (
        <select
          value={filterType}
          onChange={handleTypeChange}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Todos los Tipos</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      )}
      {rarityOptions.length > 0 && (
        <select
          value={filterRarity}
          onChange={handleRarityChange}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Todas las Rarezas</option>
          {rarityOptions.map((rarity) => (
            <option key={rarity} value={rarity}>{rarity}</option>
          ))}
        </select>
      )}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
