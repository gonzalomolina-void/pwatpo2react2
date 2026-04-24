import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Detail() {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-6">{t('detail.title')}</h1>
      <p className="text-slate-400">
        {t('detail.viewing')} <span className="text-blue-400">{id}</span>
      </p>
    </div>
  );
}