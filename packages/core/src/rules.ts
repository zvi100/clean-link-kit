import type { CleanMode, CleanUrlOptions, ParamDecision, TrackingPrefixRule, TrackingRule } from './types';

const SAFE_MODES: CleanMode[] = ['safe', 'strict'];
const STRICT_MODES: CleanMode[] = ['strict'];

export const DEFAULT_KEEP_PARAMS = [
  'id',
  'page',
  'p',
  'q',
  'query',
  'search',
  's',
  'sku',
  'variant',
  'product',
  'category',
  'collection',
  'lang',
  'locale',
  'currency',
  'sort',
  'filter',
  'color',
  'size'
] as const;

export const EXACT_TRACKING_RULES: TrackingRule[] = [
  { key: 'fbclid', reason: 'Facebook click identifier', modes: SAFE_MODES },
  { key: 'gclid', reason: 'Google Ads click identifier', modes: SAFE_MODES },
  { key: 'dclid', reason: 'Google Display click identifier', modes: SAFE_MODES },
  { key: 'gbraid', reason: 'Google Ads iOS campaign identifier', modes: SAFE_MODES },
  { key: 'wbraid', reason: 'Google Ads web to app campaign identifier', modes: SAFE_MODES },
  { key: 'msclkid', reason: 'Microsoft Ads click identifier', modes: SAFE_MODES },
  { key: 'igshid', reason: 'Instagram share tracking identifier', modes: SAFE_MODES },
  { key: 'mc_cid', reason: 'Mailchimp campaign identifier', modes: SAFE_MODES },
  { key: 'mc_eid', reason: 'Mailchimp subscriber identifier', modes: SAFE_MODES },
  { key: '_hsenc', reason: 'HubSpot email tracking parameter', modes: SAFE_MODES },
  { key: '_hsmi', reason: 'HubSpot email tracking parameter', modes: SAFE_MODES },
  { key: '_gl', reason: 'Google linker tracking parameter', modes: SAFE_MODES },
  { key: '_ga', reason: 'Google Analytics client linker parameter', modes: SAFE_MODES },
  { key: 'mkt_tok', reason: 'Marketing automation tracking token', modes: SAFE_MODES },
  { key: 'vero_id', reason: 'Email marketing tracking identifier', modes: SAFE_MODES },
  { key: 'yclid', reason: 'Yandex click identifier', modes: SAFE_MODES },
  { key: 'ttclid', reason: 'TikTok click identifier', modes: SAFE_MODES },
  { key: 'twclid', reason: 'Twitter click identifier', modes: SAFE_MODES },
  { key: 'li_fat_id', reason: 'LinkedIn first-party ad tracking identifier', modes: SAFE_MODES },
  { key: 'epik', reason: 'Pinterest click tracking identifier', modes: SAFE_MODES },
  { key: 'irclickid', reason: 'Impact affiliate click identifier', modes: SAFE_MODES },
  { key: 'srsltid', reason: 'Search result tracking identifier', modes: SAFE_MODES },
  { key: 'ref', reason: 'Referral source parameter', modes: STRICT_MODES },
  { key: 'ref_src', reason: 'Referral source parameter', modes: STRICT_MODES },
  { key: 'spm', reason: 'Marketplace tracking parameter', modes: STRICT_MODES },
  { key: 'sc_channel', reason: 'Social campaign tracking parameter', modes: STRICT_MODES },
  { key: 'share', reason: 'Share tracking parameter', modes: STRICT_MODES },
  { key: 'si', reason: 'Share identifier', modes: STRICT_MODES }
];

export const PREFIX_TRACKING_RULES: TrackingPrefixRule[] = [
  { prefix: 'utm_', reason: 'UTM campaign tracking parameter', modes: SAFE_MODES },
  { prefix: 'pk_', reason: 'Piwik Pro campaign tracking parameter', modes: SAFE_MODES },
  { prefix: 'piwik_', reason: 'Piwik campaign tracking parameter', modes: SAFE_MODES },
  { prefix: 'mtm_', reason: 'Matomo campaign tracking parameter', modes: SAFE_MODES },
  { prefix: 'matomo_', reason: 'Matomo campaign tracking parameter', modes: SAFE_MODES },
  { prefix: 'hsa_', reason: 'HubSpot ads tracking parameter', modes: SAFE_MODES },
  { prefix: 'sc_', reason: 'Social campaign tracking parameter', modes: STRICT_MODES }
];

const exactRuleMap = new Map(EXACT_TRACKING_RULES.map((rule) => [rule.key, rule]));

export function normalizeParamKey(key: string): string {
  return key.trim().toLowerCase();
}

export function getRuleForParam(key: string, mode: CleanMode = 'safe'): TrackingRule | TrackingPrefixRule | undefined {
  const normalizedKey = normalizeParamKey(key);
  const exactRule = exactRuleMap.get(normalizedKey);

  if (exactRule?.modes.includes(mode)) {
    return exactRule;
  }

  return PREFIX_TRACKING_RULES.find((rule) => normalizedKey.startsWith(rule.prefix) && rule.modes.includes(mode));
}

export function shouldRemoveParam(key: string, options: CleanUrlOptions = {}): ParamDecision {
  const mode = options.mode ?? 'safe';
  const normalizedKey = normalizeParamKey(key);
  const keepParams = new Set([...DEFAULT_KEEP_PARAMS, ...(options.keepParams ?? [])].map(normalizeParamKey));
  const extraBlockedParams = new Set((options.extraBlockedParams ?? []).map(normalizeParamKey));

  if (keepParams.has(normalizedKey) && !extraBlockedParams.has(normalizedKey)) {
    return { remove: false };
  }

  if (extraBlockedParams.has(normalizedKey)) {
    return { remove: true, reason: 'Custom blocked parameter' };
  }

  const rule = getRuleForParam(normalizedKey, mode);

  if (!rule) {
    return { remove: false };
  }

  return { remove: true, reason: rule.reason };
}

export function getKnownTrackingParams(mode: CleanMode = 'safe'): string[] {
  const exact = EXACT_TRACKING_RULES.filter((rule) => rule.modes.includes(mode)).map((rule) => rule.key);
  const prefixes = PREFIX_TRACKING_RULES.filter((rule) => rule.modes.includes(mode)).map((rule) => `${rule.prefix}*`);

  return [...exact, ...prefixes].sort((a, b) => a.localeCompare(b));
}
