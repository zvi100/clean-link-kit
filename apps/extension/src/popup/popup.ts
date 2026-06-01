import { cleanUrl, type CleanUrlResult } from '@clean-link-kit/core';
import './popup.css';

const urlInput = getElement<HTMLTextAreaElement>('url');
const cleanButton = getElement<HTMLButtonElement>('clean');
const copyButton = getElement<HTMLButtonElement>('copy');
const statusElement = getElement<HTMLSpanElement>('status');
const resultElement = getElement<HTMLParagraphElement>('result');
const removedList = getElement<HTMLUListElement>('removed');

let latestResult: CleanUrlResult | null = null;

cleanButton.addEventListener('click', () => {
  latestResult = cleanUrl(urlInput.value, { mode: 'safe' });
  renderResult(latestResult);
});

copyButton.addEventListener('click', async () => {
  if (!latestResult?.valid) {
    return;
  }

  await navigator.clipboard.writeText(latestResult.cleanUrl);
  statusElement.textContent = 'Copied clean link.';
});

function renderResult(result: CleanUrlResult) {
  copyButton.disabled = !result.valid;
  resultElement.textContent = result.valid ? result.cleanUrl : '';
  statusElement.textContent = result.valid ? `${result.removedParams.length} parameter${result.removedParams.length === 1 ? '' : 's'} removed.` : result.error ?? 'Invalid URL';
  removedList.replaceChildren(...result.removedParams.map(createRemovedItem));
}

function createRemovedItem(param: CleanUrlResult['removedParams'][number]): HTMLLIElement {
  const item = document.createElement('li');
  item.textContent = `${param.key}: ${param.reason}`;
  return item;
}

function getElement<TElement extends HTMLElement>(id: string): TElement {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing element: ${id}`);
  }

  return element as TElement;
}
