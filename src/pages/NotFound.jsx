import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden py-20 text-center">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-600/10 blur-[120px] [animation-duration:4s]"></div>
        <div className="absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-[80px] [animation-duration:2.5s]"></div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-48 animate-spin rounded-full border border-purple-500/20 [animation-duration:12s]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 animate-spin rounded-full border border-blue-500/10 [animation-direction:reverse] [animation-duration:18s]"></div>
        </div>

        <h1 className="bg-linear-to-b from-purple-400 via-blue-500 to-slate-800 bg-clip-text text-[10rem] leading-none font-black text-transparent drop-shadow-2xl select-none">
          {t('notFound.title')}
        </h1>

      </div>

      <h2 className="mb-3 bg-linear-to-r from-purple-300 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
        {t('notFound.heading')}
      </h2>
      <p className="mb-10 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        {t('notFound.description')}
      </p>

      <BackButton to="/" label={t('notFound.backToCatalog')} />
    </div>
  );
}
