import { useTranslation } from 'react-i18next';

export default function CardTranslationsForm({ translations, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h4 className="border-b border-slate-700 pb-2 text-sm font-bold tracking-wide text-slate-300 uppercase">
        {t('card.admin.translations')}
      </h4>

      {/* Español */}
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-400/30 ring-inset">
          Español
        </span>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            {t('card.admin.name')}
          </label>
          <input
            type="text"
            data-testid="input-name-es"
            value={translations.es.name}
            onChange={(e) => onChange('es', 'name', e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            {t('card.admin.description')}
          </label>
          <textarea
            data-testid="textarea-desc-es"
            value={translations.es.description}
            onChange={(e) => onChange('es', 'description', e.target.value)}
            rows="2"
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Inglés */}
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-400/30 ring-inset">
          English
        </span>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            {t('card.admin.name')}
          </label>
          <input
            type="text"
            data-testid="input-name-en"
            value={translations.en.name}
            onChange={(e) => onChange('en', 'name', e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            {t('card.admin.description')}
          </label>
          <textarea
            data-testid="textarea-desc-en"
            value={translations.en.description}
            onChange={(e) => onChange('en', 'description', e.target.value)}
            rows="2"
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
