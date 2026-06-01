export type CleanMode = 'safe' | 'strict';

export type RemovedParam = {
  key: string;
  value: string;
  reason: string;
};

export type CleanUrlOptions = {
  mode?: CleanMode;
  keepParams?: string[];
  extraBlockedParams?: string[];
  removeEmptyParams?: boolean;
  sortParams?: boolean;
  preserveUnicode?: boolean;
  assumeHttpsForBareDomains?: boolean;
};

export type CleanUrlResult = {
  originalUrl: string;
  cleanUrl: string;
  removedParams: RemovedParam[];
  changed: boolean;
  valid: boolean;
  error?: string;
};

export type TrackingRule = {
  key: string;
  reason: string;
  modes: CleanMode[];
};

export type TrackingPrefixRule = {
  prefix: string;
  reason: string;
  modes: CleanMode[];
};

export type ParamDecision = {
  remove: boolean;
  reason?: string;
};
