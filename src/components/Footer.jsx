import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TCG Nexus - Uncoma PWA</p>
        <p className="mt-2 italic">{t('footer.subtitle')}</p>
      </div>
    </footer>
  );
}