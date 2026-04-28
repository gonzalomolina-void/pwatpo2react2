import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        <p className="mt-2 italic">{t('footer.description')}</p>
      </div>
    </footer>
  );
}
