import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BackButton({ to = '/', label }) {
  const { t } = useTranslation();
  const displayLabel = label || t('backButton.defaultLabel');

  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-600 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-slate-700 dark:hover:text-blue-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transform transition-transform duration-300 group-hover:-translate-x-1"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {displayLabel}
    </Link>
  );
}
