import type { RemovedParam } from '@clean-link-kit/core';

type RemovedParamsListProps = {
  removedParams: RemovedParam[];
};

export function RemovedParamsList({ removedParams }: RemovedParamsListProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Removed parameters</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">See exactly what was removed and why.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-800">{removedParams.length}</span>
      </div>

      {removedParams.length === 0 ? (
        <div className="mt-5 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          Nothing removed yet. Paste a link with tracking parameters and run the cleaner.
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {removedParams.map((param, index) => (
            <details key={`${param.key}-${param.value}-${index}`} className="group rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-mono text-sm font-bold">{param.key}</span>
                <span className="text-xs font-semibold text-slate-500 group-open:hidden dark:text-slate-400">Show reason</span>
              </summary>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-900 dark:text-slate-50">Value:</span> <span className="break-all font-mono">{param.value || '(empty)'}</span></p>
                <p><span className="font-semibold text-slate-900 dark:text-slate-50">Reason:</span> {param.reason}</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
