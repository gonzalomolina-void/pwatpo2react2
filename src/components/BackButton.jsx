import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BackButton({ to = '/', label }) {
  const { t } = useTranslation();
  const displayLabel = label || t('backButton.defaultLabel');

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 transition-all duration-300 group"
    >
      <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
      {displayLabel}
    </Link>
  );
}
