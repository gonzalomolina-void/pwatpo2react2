import { useTranslation } from 'react-i18next';

export default function Favorites() {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-6">{t('favorites.title')}</h1>
      <p className="text-slate-400">{t('favorites.empty')}</p>
    </div>
  );
}
