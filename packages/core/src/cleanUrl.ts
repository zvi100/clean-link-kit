import { shouldRemoveParam } from './rules';
import type { CleanUrlOptions, CleanUrlResult, RemovedParam } from './types';

const INVALID_URL_MESSAGE = 'Invalid URL';

function looksLikeBareDomain(value: string): boolean {
  if (/\s/.test(value)) {
    return false;
  }

  if (value.startsWith('//')) {
    return false;
  }

  return /^[\p{L}\p{N}-]+(\.[\p{L}\p{N}-]+)+(\/|\?|#|$)/u.test(value);
}

function parseUrl(value: string, assumeHttpsForBareDomains: boolean): URL | null {
  try {
    return new URL(value);
  } catch {
    if (!assumeHttpsForBareDomains || !looksLikeBareDomain(value)) {
      return null;
    }

    try {
      return new URL(`https://${value}`);
    } catch {
      return null;
    }
  }
}

function serializeUrl(url: URL, preserveUnicode: boolean): string {
  const serialized = url.toString();

  if (!preserveUnicode) {
    return serialized;
  }

  try {
    return decodeURI(serialized);
  } catch {
    return serialized;
  }
}

function buildCleanSearchParams(url: URL, options: CleanUrlOptions): RemovedParam[] {
  const removedParams: RemovedParam[] = [];
  const cleanSearchParams = new URLSearchParams();

  for (const [key, value] of url.searchParams.entries()) {
    const decision = shouldRemoveParam(key, options);
    const removeEmptyParam = options.removeEmptyParams === true && value.trim() === '';

    if (decision.remove || removeEmptyParam) {
      removedParams.push({
        key,
        value,
        reason: decision.reason ?? 'Empty parameter'
      });
      continue;
    }

    cleanSearchParams.append(key, value);
  }

  if (options.sortParams === true) {
    cleanSearchParams.sort();
  }

  url.search = cleanSearchParams.toString();

  return removedParams;
}

export function cleanUrl(input: string, options: CleanUrlOptions = {}): CleanUrlResult {
  const originalUrl = input;
  const trimmedUrl = input.trim();

  if (!trimmedUrl) {
    return {
      originalUrl,
      cleanUrl: originalUrl,
      removedParams: [],
      changed: false,
      valid: false,
      error: INVALID_URL_MESSAGE
    };
  }

  const parsedUrl = parseUrl(trimmedUrl, options.assumeHttpsForBareDomains ?? true);

  if (!parsedUrl) {
    return {
      originalUrl,
      cleanUrl: originalUrl,
      removedParams: [],
      changed: false,
      valid: false,
      error: INVALID_URL_MESSAGE
    };
  }

  const removedParams = buildCleanSearchParams(parsedUrl, options);
  const cleanUrlValue = serializeUrl(parsedUrl, options.preserveUnicode ?? true);

  return {
    originalUrl,
    cleanUrl: cleanUrlValue,
    removedParams,
    changed: cleanUrlValue !== originalUrl,
    valid: true
  };
}

export function isValidUrl(input: string, options: Pick<CleanUrlOptions, 'assumeHttpsForBareDomains'> = {}): boolean {
  return parseUrl(input.trim(), options.assumeHttpsForBareDomains ?? true) !== null;
}

export function getRemovedParams(input: string, options: CleanUrlOptions = {}): RemovedParam[] {
  return cleanUrl(input, options).removedParams;
}
