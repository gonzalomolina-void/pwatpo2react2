import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BackButton({ to = '/', label }) {
  const { t } = useTranslation();
  const displayLabel = label || t('backButton.defaultLabel');

  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-slate-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-700 hover:text-blue-400"
    >
      <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
      {displayLabel}
    </Link>
  );
}
