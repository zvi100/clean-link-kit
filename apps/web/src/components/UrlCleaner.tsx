import { cleanUrl, type CleanMode, type CleanUrlResult } from '@clean-link-kit/core';
import { useEffect, useMemo, useState } from 'react';
import { copyToClipboard } from '../lib/clipboard';

type UrlCleanerProps = {
  mode: CleanMode;
  onClean: (result: CleanUrlResult) => void;
  onResultChange: (result: CleanUrlResult) => void;
};

const exampleUrl = 'https://example.com/product?utm_source=newsletter&utm_campaign=sale&fbclid=abc123&gclid=xyz&id=55';

export function UrlCleaner({ mode, onClean, onResultChange }: UrlCleanerProps) {
  const [url, setUrl] = useState(exampleUrl);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CleanUrlResult>(() => cleanUrl(exampleUrl, { mode }));

  useEffect(() => {
    const nextResult = cleanUrl(url, { mode });
    setResult(nextResult);
    setCopied(false);
    onResultChange(nextResult);
  }, [mode, onResultChange]);

  const removedCountLabel = useMemo(() => {
    if (!result.valid) {
      return 'No link cleaned yet';
    }

    if (result.removedParams.length === 0) {
      return 'No tracking parameters found';
    }

    return `${result.removedParams.length} parameter${result.removedParams.length === 1 ? '' : 's'} removed`;
  }, [result]);

  function handleClean() {
    const nextResult = cleanUrl(url, { mode });
    setResult(nextResult);
    setCopied(false);
    onResultChange(nextResult);
    onClean(nextResult);
  }

  async function handleCopy() {
    const didCopy = await copyToClipboard(result.cleanUrl);
    setCopied(didCopy);
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Share cleaner links.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Paste a URL, remove tracking noise, copy the clean version, and keep the useful parameters that make the link work.
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {mode === 'safe' ? 'Safe mode' : 'Strict mode'}
        </span>
      </div>

      <div className="mt-8 grid gap-4">
        <label htmlFor="url" className="text-sm font-semibold text-slate-700 dark:text-slate-200">URL to clean</label>
        <textarea
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none ring-slate-300 transition focus:ring-4 dark:border-slate-800 dark:bg-slate-950 dark:ring-slate-700"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleClean}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-950"
          >
            Clean Link
          </button>
          <button
            type="button"
            onClick={() => setUrl('')}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Clean result</p>
            <p className={result.valid ? 'mt-2 break-all font-mono text-sm text-slate-950 dark:text-slate-50' : 'mt-2 text-sm font-semibold text-red-600 dark:text-red-400'}>
              {result.valid ? result.cleanUrl : result.error ?? 'Invalid URL'}
            </p>
          </div>
          <button
            type="button"
            disabled={!result.valid}
            onClick={handleCopy}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{removedCountLabel}</p>
      </div>
    </section>
  );
}
