const rarityConfig = {
  'Legendario': { text: 'text-orange-400', border: 'border-orange-500/50', hover: 'hover:border-orange-400', glow: 'shadow-orange-500/20' },
  'Legendary':  { text: 'text-orange-400', border: 'border-orange-500/50', hover: 'hover:border-orange-400', glow: 'shadow-orange-500/20' },
  'Épico':      { text: 'text-purple-400', border: 'border-purple-500/50', hover: 'hover:border-purple-400', glow: 'shadow-purple-500/20' },
  'Epic':       { text: 'text-purple-400', border: 'border-purple-500/50', hover: 'hover:border-purple-400', glow: 'shadow-purple-500/20' },
  'Raro':       { text: 'text-blue-400',   border: 'border-blue-500/50',   hover: 'hover:border-blue-400',   glow: 'shadow-blue-500/20' },
  'Rare':       { text: 'text-blue-400',   border: 'border-blue-500/50',   hover: 'hover:border-blue-400',   glow: 'shadow-blue-500/20' },
  'Poco Común': { text: 'text-green-400',  border: 'border-green-500/50',  hover: 'hover:border-green-400',  glow: 'shadow-green-500/20' },
  'Uncommon':   { text: 'text-green-400',  border: 'border-green-500/50',  hover: 'hover:border-green-400',  glow: 'shadow-green-500/20' },
  'Común':      { text: 'text-slate-100',  border: 'border-slate-200/50',  hover: 'hover:border-slate-100',  glow: 'shadow-slate-500/20' },
  'Common':     { text: 'text-slate-100',  border: 'border-slate-200/50',  hover: 'hover:border-slate-100',  glow: 'shadow-slate-500/20' },
  'Normal':     { text: 'text-slate-100',  border: 'border-slate-200/50',  hover: 'hover:border-slate-100',  glow: 'shadow-slate-500/20' },
  'Pobre':      { text: 'text-slate-500',  border: 'border-slate-600/50',  hover: 'hover:border-slate-500',  glow: 'shadow-slate-600/20' },
  'Poor':       { text: 'text-slate-500',  border: 'border-slate-600/50',  hover: 'hover:border-slate-500',  glow: 'shadow-slate-600/20' },
};

const defaultConfig = {
  text: 'text-slate-400',
  border: 'border-slate-700',
  hover: 'hover:border-blue-500',
  glow: 'shadow-slate-700/20',
};

export const getRarityConfig = (rarity) => rarityConfig[rarity] || defaultConfig;

export default rarityConfig;
