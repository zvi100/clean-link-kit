import type { CleanMode } from '@clean-link-kit/core';

type HeaderProps = {
  darkMode: boolean;
  mode: CleanMode;
  onToggleDarkMode: () => void;
  onModeChange: (mode: CleanMode) => void;
};

export function Header({ darkMode, mode, onToggleDarkMode, onModeChange }: HeaderProps) {
  const homeHref = import.meta.env.BASE_URL || '/';

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <a href={homeHref} className="inline-flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">CL</span>
          <span>Clean Link Kit</span>
        </a>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Clean tracking parameters from links before sharing them, directly in your browser.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => onModeChange('safe')}
            className={mode === 'safe' ? activeToggleClass : inactiveToggleClass}
          >
            Safe
          </button>
          <button
            type="button"
            onClick={() => onModeChange('strict')}
            className={mode === 'strict' ? activeToggleClass : inactiveToggleClass}
          >
            Strict
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  );
}

const activeToggleClass = 'rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950';
const inactiveToggleClass = 'rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';
