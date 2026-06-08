import type { CleanMode, CleanUrlResult } from '@clean-link-kit/core';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { HistoryList } from '../components/HistoryList';
import { RemovedParamsList } from '../components/RemovedParamsList';
import { UrlCleaner } from '../components/UrlCleaner';
import { clearHistory, readHistory, saveHistoryItem } from '../lib/history';
import type { LinkHistoryItem } from '../types';

export function HomePage() {
  const [mode, setMode] = useState<CleanMode>('safe');
  const [darkMode, setDarkMode] = useState(false);
  const [lastResult, setLastResult] = useState<CleanUrlResult | null>(null);
  const [history, setHistory] = useState<LinkHistoryItem[]>([]);

  useEffect(() => {
    setHistory(readHistory());
    setDarkMode(localStorage.getItem('clean-link-kit:theme') === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('clean-link-kit:theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function handleClean(result: CleanUrlResult) {
    if (result.valid && result.changed) {
      setHistory(saveHistoryItem({
        originalUrl: result.originalUrl,
        cleanUrl: result.cleanUrl,
        removedCount: result.removedParams.length
      }));
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0),rgba(15,23,42,0.04))] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.20),transparent_35%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,1))]">
      <Header
        darkMode={darkMode}
        mode={mode}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
        onModeChange={setMode}
      />
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-12">
        <UrlCleaner mode={mode} onClean={handleClean} onResultChange={setLastResult} />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <RemovedParamsList removedParams={lastResult?.removedParams ?? []} />
          <HistoryList history={history} onClear={() => setHistory(clearHistory())} />
        </div>
      </main>
    </div>
  );
}
