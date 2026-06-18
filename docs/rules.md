# Cleaning Rules

Clean Link Kit has two modes.

## Safe mode

Safe mode removes high-confidence tracking parameters:

* `utm_*`
* `fbclid`
* `gclid`
* `dclid`
* `gbraid`
* `wbraid`
* `msclkid`
* `igshid`
* `mc_cid`
* `mc_eid`
* `_hsenc`
* `_hsmi`
* `_gl`
* `_ga`
* `mkt_tok`
* `vero_id`
* `yclid`
* `ttclid`
* `twclid`
* `li_fat_id`
* `epik`
* `irclickid`
* `srsltid`
* `pk_*`
* `piwik_*`
* `mtm_*`
* `matomo_*`
* `hsa_*`

## Strict mode

Strict mode includes safe mode and also removes more ambiguous share and referral parameters:

* `ref`
* `ref_src`
* `tag`
* `ascsubtag`
* `linkCode`
* `linkId`
* `camp`
* `creative`
* `creativeASIN`
* `spm`
* `sc_channel`
* `share`
* `si`
* `sc_*`

## Parameters kept by default

The cleaner keeps useful parameters such as:

* `id`
* `page`
* `p`
* `q`
* `query`
* `search`
* `sku`
* `variant`
* `product`
* `category`
* `collection`
* `lang`
* `locale`
* `currency`
* `sort`
* `filter`
* `color`
* `size`

## Custom rules

Use `extraBlockedParams` to remove project-specific parameters.

```ts
cleanUrl('https://example.com?a=1&session_id=abc', {
  extraBlockedParams: ['session_id']
});
```

Use `keepParams` when a parameter looks like tracking but is required for a specific website.

```ts
cleanUrl('https://example.com?utm_source=internal&id=1', {
  keepParams: ['utm_source']
});
```
