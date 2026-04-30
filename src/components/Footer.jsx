import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-slate-50 py-8 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        <p className="mt-2 italic">{t('footer.description')}</p>
      </div>
    </footer>
  );
}
