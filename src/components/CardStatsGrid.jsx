import { useTranslation } from 'react-i18next';

export default function CardStatsGrid({
  cost,
  setCost,
  atk,
  setAtk,
  def,
  setDef,
  image,
  setImage,
  typeId,
  setTypeId,
  rarityId,
  setRarityId,
  typeOptions = [],
  rarityOptions = [],
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.cost')}
        </label>
        <input
          type="number"
          data-testid="input-cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
          min="0"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.atk')}
        </label>
        <input
          type="number"
          data-testid="input-atk"
          value={atk}
          onChange={(e) => setAtk(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
          min="0"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.def')}
        </label>
        <input
          type="number"
          data-testid="input-def"
          value={def}
          onChange={(e) => setDef(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
          min="0"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.image')}
        </label>
        <input
          type="text"
          data-testid="input-image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.type')}
        </label>
        <select
          data-testid="select-type"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
        >
          <option value="">{t('search.clear') || 'Seleccionar...'}</option>
          {typeOptions.map((type) => (
            <option key={type.id} value={type.id}>
              {t(type.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('card.admin.rarity')}
        </label>
        <select
          data-testid="select-rarity"
          value={rarityId}
          onChange={(e) => setRarityId(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          required
        >
          <option value="">{t('search.clear') || 'Seleccionar...'}</option>
          {rarityOptions.map((rarity) => (
            <option key={rarity.id} value={rarity.id}>
              {t(rarity.labelKey)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
