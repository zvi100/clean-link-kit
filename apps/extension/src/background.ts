import { cleanUrl } from '@clean-link-kit/core';

const CONTEXT_MENU_ID = 'copy-clean-link';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Copy clean link',
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.linkUrl || !tab?.id) {
    return;
  }

  const result = cleanUrl(info.linkUrl, { mode: 'safe' });
  void copyTextInTab(tab.id, result.cleanUrl).catch(() => {
    console.warn('Clean Link Kit could not copy the cleaned link.');
  });
});

async function copyTextInTab(tabId: number, text: string): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    args: [text],
    func: async (value: string) => {
      await navigator.clipboard.writeText(value);
    }
  });
}
