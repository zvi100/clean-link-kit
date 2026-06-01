import type { LinkHistoryItem } from '../types';
import { copyToClipboard } from '../lib/clipboard';

type HistoryListProps = {
  history: LinkHistoryItem[];
  onClear: () => void;
};

export function HistoryList({ history, onClear }: HistoryListProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Local history</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Stored only in this browser.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:enabled:hover:bg-slate-800"
        >
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <div className="mt-5 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          Cleaned links will appear here after you run the cleaner.
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {history.map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-all font-mono text-sm font-semibold">{item.cleanUrl}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.removedCount} removed · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyToClipboard(item.cleanUrl)}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
                >
                  Copy
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
