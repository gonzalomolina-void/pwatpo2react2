import { useTranslation } from 'react-i18next';

const TeamMember = ({ nombre, legajo, rol, avatar }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-36 flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-md transition-colors hover:border-blue-500/30 dark:border-slate-700/50 dark:bg-slate-900/40">
      <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
        <img src={avatar} alt={nombre} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-1 text-center">
        <strong className="block text-xs leading-tight text-slate-800 dark:text-slate-100">{nombre}</strong>
        <span className="block text-[10px] tracking-tighter text-slate-500 dark:text-slate-400 uppercase">
          {t('about.studentId')}: {legajo}
        </span>
        <span className="mt-2 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-black text-blue-600 uppercase dark:text-blue-400">
          {rol}
        </span>
      </div>
    </div>
  );
};

export default TeamMember;
