import { cleanUrl } from '@clean-link-kit/core';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isCleanCurrentLocationMessage(message)) {
    return false;
  }

  sendResponse(cleanUrl(window.location.href, { mode: message.mode }));
  return true;
});

function isCleanCurrentLocationMessage(message: unknown): message is { type: 'CLEAN_CURRENT_LOCATION'; mode: 'safe' | 'strict' } {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const value = message as Record<string, unknown>;

  return value.type === 'CLEAN_CURRENT_LOCATION' && (value.mode === 'safe' || value.mode === 'strict');
}
