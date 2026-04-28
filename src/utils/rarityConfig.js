const styles = {
  legendary: { text: 'text-orange-400', border: 'border-orange-500/50', hover: 'hover:border-orange-400', glow: 'shadow-orange-500/20' },
  epic:      { text: 'text-purple-400', border: 'border-purple-500/50', hover: 'hover:border-purple-400', glow: 'shadow-purple-500/20' },
  rare:      { text: 'text-blue-400',   border: 'border-blue-500/50',   hover: 'hover:border-blue-400',   glow: 'shadow-blue-500/20' },
  uncommon:  { text: 'text-green-400',  border: 'border-green-500/50',  hover: 'hover:border-green-400',  glow: 'shadow-green-500/20' },
  common:    { text: 'text-slate-100',  border: 'border-slate-200/50',  hover: 'hover:border-slate-100',  glow: 'shadow-slate-500/20' },
  poor:      { text: 'text-slate-500',  border: 'border-slate-600/50',  hover: 'hover:border-slate-500',  glow: 'shadow-slate-600/20' },
};

const rarityMap = {
  'Legendario': styles.legendary,
  'Legendary':  styles.legendary,
  'Épico':      styles.epic,
  'Epic':       styles.epic,
  'Raro':       styles.rare,
  'Rare':       styles.rare,
  'Poco Común': styles.uncommon,
  'Uncommon':   styles.uncommon,
  'Común':      styles.common,
  'Common':     styles.common,
  'Normal':     styles.common,
  'Pobre':      styles.poor,
  'Poor':       styles.poor,
};

const defaultConfig = {
  text: 'text-slate-400',
  border: 'border-slate-700',
  hover: 'hover:border-blue-500',
  glow: 'shadow-slate-700/20',
};

export const getRarityConfig = (rarity) => rarityMap[rarity] || defaultConfig;

export default rarityMap;
