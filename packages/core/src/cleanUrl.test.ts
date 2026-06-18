import { describe, expect, it } from 'vitest';
import { cleanUrl, getKnownTrackingParams, getRemovedParams, getRuleForParam, isValidUrl, shouldRemoveParam } from './index';

describe('cleanUrl', () => {
  it('removes common tracking parameters and keeps meaningful parameters', () => {
    const result = cleanUrl('https://example.com/product?utm_source=newsletter&utm_campaign=sale&fbclid=abc123&gclid=xyz&id=55');

    expect(result.valid).toBe(true);
    expect(result.changed).toBe(true);
    expect(result.cleanUrl).toBe('https://example.com/product?id=55');
    expect(result.removedParams).toEqual([
      { key: 'utm_source', value: 'newsletter', reason: 'UTM campaign tracking parameter' },
      { key: 'utm_campaign', value: 'sale', reason: 'UTM campaign tracking parameter' },
      { key: 'fbclid', value: 'abc123', reason: 'Facebook click identifier' },
      { key: 'gclid', value: 'xyz', reason: 'Google Ads click identifier' }
    ]);
  });

  it.each([
    ['fbclid', 'https://example.com/product?fbclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['gclid', 'https://example.com/product?gclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['dclid', 'https://example.com/product?dclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['gbraid', 'https://example.com/product?gbraid=tracking&id=55', 'https://example.com/product?id=55'],
    ['wbraid', 'https://example.com/product?wbraid=tracking&id=55', 'https://example.com/product?id=55'],
    ['msclkid', 'https://example.com/product?msclkid=tracking&id=55', 'https://example.com/product?id=55'],
    ['igshid', 'https://example.com/product?igshid=tracking&id=55', 'https://example.com/product?id=55'],
    ['mc_cid', 'https://example.com/product?mc_cid=tracking&id=55', 'https://example.com/product?id=55'],
    ['mc_eid', 'https://example.com/product?mc_eid=tracking&id=55', 'https://example.com/product?id=55'],
    ['_hsenc', 'https://example.com/product?_hsenc=tracking&id=55', 'https://example.com/product?id=55'],
    ['_hsmi', 'https://example.com/product?_hsmi=tracking&id=55', 'https://example.com/product?id=55'],
    ['_gl', 'https://example.com/product?_gl=tracking&id=55', 'https://example.com/product?id=55'],
    ['_ga', 'https://example.com/product?_ga=tracking&id=55', 'https://example.com/product?id=55'],
    ['mkt_tok', 'https://example.com/product?mkt_tok=tracking&id=55', 'https://example.com/product?id=55'],
    ['vero_id', 'https://example.com/product?vero_id=tracking&id=55', 'https://example.com/product?id=55'],
    ['yclid', 'https://example.com/product?yclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['ttclid', 'https://example.com/product?ttclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['twclid', 'https://example.com/product?twclid=tracking&id=55', 'https://example.com/product?id=55'],
    ['li_fat_id', 'https://example.com/product?li_fat_id=tracking&id=55', 'https://example.com/product?id=55'],
    ['epik', 'https://example.com/product?epik=tracking&id=55', 'https://example.com/product?id=55'],
    ['irclickid', 'https://example.com/product?irclickid=tracking&id=55', 'https://example.com/product?id=55'],
    ['srsltid', 'https://example.com/product?srsltid=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_source', 'https://example.com/product?utm_source=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_medium', 'https://example.com/product?utm_medium=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_campaign', 'https://example.com/product?utm_campaign=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_content', 'https://example.com/product?utm_content=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_term', 'https://example.com/product?utm_term=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_id', 'https://example.com/product?utm_id=tracking&id=55', 'https://example.com/product?id=55'],
    ['utm_name', 'https://example.com/product?utm_name=tracking&id=55', 'https://example.com/product?id=55'],
    ['pk_campaign', 'https://example.com/product?pk_campaign=tracking&id=55', 'https://example.com/product?id=55'],
    ['pk_kwd', 'https://example.com/product?pk_kwd=tracking&id=55', 'https://example.com/product?id=55'],
    ['piwik_campaign', 'https://example.com/product?piwik_campaign=tracking&id=55', 'https://example.com/product?id=55'],
    ['mtm_campaign', 'https://example.com/product?mtm_campaign=tracking&id=55', 'https://example.com/product?id=55'],
    ['mtm_source', 'https://example.com/product?mtm_source=tracking&id=55', 'https://example.com/product?id=55'],
    ['matomo_campaign', 'https://example.com/product?matomo_campaign=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_acc', 'https://example.com/product?hsa_acc=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_cam', 'https://example.com/product?hsa_cam=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_grp', 'https://example.com/product?hsa_grp=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_ad', 'https://example.com/product?hsa_ad=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_src', 'https://example.com/product?hsa_src=tracking&id=55', 'https://example.com/product?id=55'],
    ['hsa_tgt', 'https://example.com/product?hsa_tgt=tracking&id=55', 'https://example.com/product?id=55'],
  ])('removes safe tracking parameter %s', (_key, input, expected) => {
    expect(cleanUrl(input).cleanUrl).toBe(expected);
  });

  it.each([
    ['ref', 'https://example.com/product?ref=tracking&id=55', 'https://example.com/product?id=55'],
    ['ref_src', 'https://example.com/product?ref_src=tracking&id=55', 'https://example.com/product?id=55'],
    ['spm', 'https://example.com/product?spm=tracking&id=55', 'https://example.com/product?id=55'],
    ['sc_channel', 'https://example.com/product?sc_channel=tracking&id=55', 'https://example.com/product?id=55'],
    ['share', 'https://example.com/product?share=tracking&id=55', 'https://example.com/product?id=55'],
    ['si', 'https://example.com/product?si=tracking&id=55', 'https://example.com/product?id=55'],
  ])('removes strict-only parameter %s in strict mode', (_key, input, expected) => {
    expect(cleanUrl(input, { mode: 'strict' }).cleanUrl).toBe(expected);
  });

  it.each([
    ['ref', 'https://example.com/product?ref=tracking&id=55', 'https://example.com/product?id=55'],
    ['ref_src', 'https://example.com/product?ref_src=tracking&id=55', 'https://example.com/product?id=55'],
    ['spm', 'https://example.com/product?spm=tracking&id=55', 'https://example.com/product?id=55'],
    ['sc_channel', 'https://example.com/product?sc_channel=tracking&id=55', 'https://example.com/product?id=55'],
    ['share', 'https://example.com/product?share=tracking&id=55', 'https://example.com/product?id=55'],
    ['si', 'https://example.com/product?si=tracking&id=55', 'https://example.com/product?id=55'],
  ])('keeps strict-only parameter %s in safe mode', (key, input) => {
    expect(cleanUrl(input).cleanUrl).toBe(`https://example.com/product?${key}=tracking&id=55`);
  });

  it.each([
    [
      'watch URL with playlist',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&si=abc123&utm_source=copy-link&list=PL123',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123',
      ['si', 'utm_source']
    ],
    [
      'short URL with timestamp',
      'https://youtu.be/dQw4w9WgXcQ?ref=twitter&t=42&share=copy',
      'https://youtu.be/dQw4w9WgXcQ?t=42',
      ['ref', 'share']
    ],
    [
      'embed URL with start time',
      'https://www.youtube.com/embed/dQw4w9WgXcQ?start=30&ref_src=twsrc%5Etfw',
      'https://www.youtube.com/embed/dQw4w9WgXcQ?start=30',
      ['ref_src']
    ]
  ])('removes YouTube share parameters while preserving playback parameters for %s', (_label, input, expected, expectedRemovedKeys) => {
    const result = cleanUrl(input, { mode: 'strict' });

    expect(result.cleanUrl).toBe(expected);
    expect(result.removedParams.map((param) => param.key)).toEqual(expectedRemovedKeys);
  });

  it.each([
    [
      'product URL with variant selectors',
      'https://www.amazon.com/Example-Product/dp/B08N5WRWNW?th=1&psc=1&utm_source=newsletter&srsltid=abc123',
      'https://www.amazon.com/Example-Product/dp/B08N5WRWNW?th=1&psc=1',
      ['utm_source', 'srsltid']
    ],
    [
      'search URL with query context',
      'https://www.amazon.com/s?k=wireless+keyboard&crid=ABC123&utm_medium=email&sprefix=wireless%2Caps%2C150',
      'https://www.amazon.com/s?k=wireless+keyboard&crid=ABC123&sprefix=wireless%2Caps%2C150',
      ['utm_medium']
    ]
  ])('removes generic tracking from Amazon-style URLs while preserving identifiers for %s', (_label, input, expected, expectedRemovedKeys) => {
    const result = cleanUrl(input);

    expect(result.cleanUrl).toBe(expected);
    expect(result.removedParams.map((param) => param.key)).toEqual(expectedRemovedKeys);
  });

  it('removes Amazon affiliate parameters in strict mode while preserving product selectors', () => {
    const result = cleanUrl(
      'https://www.amazon.com/dp/B08N5WRWNW?tag=affiliate-20&linkCode=ll1&linkId=123456&ascsubtag=campaign&camp=1789&creative=9325&creativeASIN=B08N5WRWNW&th=1&psc=1',
      { mode: 'strict' }
    );

    expect(result.cleanUrl).toBe('https://www.amazon.com/dp/B08N5WRWNW?th=1&psc=1');
    expect(result.removedParams.map((param) => param.key)).toEqual(['tag', 'linkCode', 'linkId', 'ascsubtag', 'camp', 'creative', 'creativeASIN']);
  });

  it.each([
    ['id', 'https://example.com/search?id=value', 'https://example.com/search?id=value'],
    ['page', 'https://example.com/search?page=value', 'https://example.com/search?page=value'],
    ['p', 'https://example.com/search?p=value', 'https://example.com/search?p=value'],
    ['q', 'https://example.com/search?q=value', 'https://example.com/search?q=value'],
    ['query', 'https://example.com/search?query=value', 'https://example.com/search?query=value'],
    ['search', 'https://example.com/search?search=value', 'https://example.com/search?search=value'],
    ['s', 'https://example.com/search?s=value', 'https://example.com/search?s=value'],
    ['sku', 'https://example.com/search?sku=value', 'https://example.com/search?sku=value'],
    ['variant', 'https://example.com/search?variant=value', 'https://example.com/search?variant=value'],
    ['product', 'https://example.com/search?product=value', 'https://example.com/search?product=value'],
    ['category', 'https://example.com/search?category=value', 'https://example.com/search?category=value'],
    ['collection', 'https://example.com/search?collection=value', 'https://example.com/search?collection=value'],
    ['lang', 'https://example.com/search?lang=value', 'https://example.com/search?lang=value'],
    ['locale', 'https://example.com/search?locale=value', 'https://example.com/search?locale=value'],
    ['currency', 'https://example.com/search?currency=value', 'https://example.com/search?currency=value'],
    ['sort', 'https://example.com/search?sort=value', 'https://example.com/search?sort=value'],
    ['filter', 'https://example.com/search?filter=value', 'https://example.com/search?filter=value'],
    ['color', 'https://example.com/search?color=value', 'https://example.com/search?color=value'],
    ['size', 'https://example.com/search?size=value', 'https://example.com/search?size=value'],
  ])('keeps important parameter %s', (_key, input, expected) => {
    const result = cleanUrl(input);

    expect(result.cleanUrl).toBe(expected);
    expect(result.removedParams).toHaveLength(0);
  });

  it.each([
    ['case 1', 'https://shop.example/items?gclid=x&id=1&sku=ABC1', 'https://shop.example/items?id=1&sku=ABC1'],
    ['case 2', 'https://shop.example/items?dclid=x&id=2&sku=ABC2', 'https://shop.example/items?id=2&sku=ABC2'],
    ['case 3', 'https://shop.example/items?gbraid=x&id=3&sku=ABC3', 'https://shop.example/items?id=3&sku=ABC3'],
    ['case 4', 'https://shop.example/items?wbraid=x&id=4&sku=ABC4', 'https://shop.example/items?id=4&sku=ABC4'],
    ['case 5', 'https://shop.example/items?msclkid=x&id=5&sku=ABC5', 'https://shop.example/items?id=5&sku=ABC5'],
    ['case 6', 'https://shop.example/items?igshid=x&id=6&sku=ABC6', 'https://shop.example/items?id=6&sku=ABC6'],
    ['case 7', 'https://shop.example/items?mc_cid=x&id=7&sku=ABC7', 'https://shop.example/items?id=7&sku=ABC7'],
    ['case 8', 'https://shop.example/items?mc_eid=x&id=8&sku=ABC8', 'https://shop.example/items?id=8&sku=ABC8'],
    ['case 9', 'https://shop.example/items?_hsenc=x&id=9&sku=ABC9', 'https://shop.example/items?id=9&sku=ABC9'],
    ['case 10', 'https://shop.example/items?_hsmi=x&id=10&sku=ABC10', 'https://shop.example/items?id=10&sku=ABC10'],
    ['case 11', 'https://shop.example/items?_gl=x&id=11&sku=ABC11', 'https://shop.example/items?id=11&sku=ABC11'],
    ['case 12', 'https://shop.example/items?_ga=x&id=12&sku=ABC12', 'https://shop.example/items?id=12&sku=ABC12'],
    ['case 13', 'https://shop.example/items?mkt_tok=x&id=13&sku=ABC13', 'https://shop.example/items?id=13&sku=ABC13'],
    ['case 14', 'https://shop.example/items?vero_id=x&id=14&sku=ABC14', 'https://shop.example/items?id=14&sku=ABC14'],
    ['case 15', 'https://shop.example/items?yclid=x&id=15&sku=ABC15', 'https://shop.example/items?id=15&sku=ABC15'],
    ['case 16', 'https://shop.example/items?ttclid=x&id=16&sku=ABC16', 'https://shop.example/items?id=16&sku=ABC16'],
    ['case 17', 'https://shop.example/items?twclid=x&id=17&sku=ABC17', 'https://shop.example/items?id=17&sku=ABC17'],
    ['case 18', 'https://shop.example/items?li_fat_id=x&id=18&sku=ABC18', 'https://shop.example/items?id=18&sku=ABC18'],
    ['case 19', 'https://shop.example/items?epik=x&id=19&sku=ABC19', 'https://shop.example/items?id=19&sku=ABC19'],
    ['case 20', 'https://shop.example/items?irclickid=x&id=20&sku=ABC20', 'https://shop.example/items?id=20&sku=ABC20'],
    ['case 21', 'https://shop.example/items?srsltid=x&id=21&sku=ABC21', 'https://shop.example/items?id=21&sku=ABC21'],
    ['case 22', 'https://shop.example/items?utm_source=x&id=22&sku=ABC22', 'https://shop.example/items?id=22&sku=ABC22'],
    ['case 23', 'https://shop.example/items?utm_medium=x&id=23&sku=ABC23', 'https://shop.example/items?id=23&sku=ABC23'],
    ['case 24', 'https://shop.example/items?utm_campaign=x&id=24&sku=ABC24', 'https://shop.example/items?id=24&sku=ABC24'],
    ['case 25', 'https://shop.example/items?utm_content=x&id=25&sku=ABC25', 'https://shop.example/items?id=25&sku=ABC25'],
    ['case 26', 'https://shop.example/items?utm_term=x&id=26&sku=ABC26', 'https://shop.example/items?id=26&sku=ABC26'],
    ['case 27', 'https://shop.example/items?utm_id=x&id=27&sku=ABC27', 'https://shop.example/items?id=27&sku=ABC27'],
    ['case 28', 'https://shop.example/items?utm_name=x&id=28&sku=ABC28', 'https://shop.example/items?id=28&sku=ABC28'],
    ['case 29', 'https://shop.example/items?pk_campaign=x&id=29&sku=ABC29', 'https://shop.example/items?id=29&sku=ABC29'],
    ['case 30', 'https://shop.example/items?pk_kwd=x&id=30&sku=ABC30', 'https://shop.example/items?id=30&sku=ABC30'],
    ['case 31', 'https://shop.example/items?piwik_campaign=x&id=31&sku=ABC31', 'https://shop.example/items?id=31&sku=ABC31'],
    ['case 32', 'https://shop.example/items?mtm_campaign=x&id=32&sku=ABC32', 'https://shop.example/items?id=32&sku=ABC32'],
    ['case 33', 'https://shop.example/items?mtm_source=x&id=33&sku=ABC33', 'https://shop.example/items?id=33&sku=ABC33'],
    ['case 34', 'https://shop.example/items?matomo_campaign=x&id=34&sku=ABC34', 'https://shop.example/items?id=34&sku=ABC34'],
    ['case 35', 'https://shop.example/items?hsa_acc=x&id=35&sku=ABC35', 'https://shop.example/items?id=35&sku=ABC35'],
    ['case 36', 'https://shop.example/items?hsa_cam=x&id=36&sku=ABC36', 'https://shop.example/items?id=36&sku=ABC36'],
    ['case 37', 'https://shop.example/items?hsa_grp=x&id=37&sku=ABC37', 'https://shop.example/items?id=37&sku=ABC37'],
    ['case 38', 'https://shop.example/items?hsa_ad=x&id=38&sku=ABC38', 'https://shop.example/items?id=38&sku=ABC38'],
    ['case 39', 'https://shop.example/items?hsa_src=x&id=39&sku=ABC39', 'https://shop.example/items?id=39&sku=ABC39'],
    ['case 40', 'https://shop.example/items?hsa_tgt=x&id=40&sku=ABC40', 'https://shop.example/items?id=40&sku=ABC40'],
    ['case 41', 'https://shop.example/items?fbclid=x&id=41&sku=ABC41', 'https://shop.example/items?id=41&sku=ABC41'],
    ['case 42', 'https://shop.example/items?gclid=x&id=42&sku=ABC42', 'https://shop.example/items?id=42&sku=ABC42'],
    ['case 43', 'https://shop.example/items?dclid=x&id=43&sku=ABC43', 'https://shop.example/items?id=43&sku=ABC43'],
    ['case 44', 'https://shop.example/items?gbraid=x&id=44&sku=ABC44', 'https://shop.example/items?id=44&sku=ABC44'],
    ['case 45', 'https://shop.example/items?wbraid=x&id=45&sku=ABC45', 'https://shop.example/items?id=45&sku=ABC45'],
    ['case 46', 'https://shop.example/items?msclkid=x&id=46&sku=ABC46', 'https://shop.example/items?id=46&sku=ABC46'],
    ['case 47', 'https://shop.example/items?igshid=x&id=47&sku=ABC47', 'https://shop.example/items?id=47&sku=ABC47'],
    ['case 48', 'https://shop.example/items?mc_cid=x&id=48&sku=ABC48', 'https://shop.example/items?id=48&sku=ABC48'],
    ['case 49', 'https://shop.example/items?mc_eid=x&id=49&sku=ABC49', 'https://shop.example/items?id=49&sku=ABC49'],
    ['case 50', 'https://shop.example/items?_hsenc=x&id=50&sku=ABC50', 'https://shop.example/items?id=50&sku=ABC50'],
    ['case 51', 'https://shop.example/items?_hsmi=x&id=51&sku=ABC51', 'https://shop.example/items?id=51&sku=ABC51'],
    ['case 52', 'https://shop.example/items?_gl=x&id=52&sku=ABC52', 'https://shop.example/items?id=52&sku=ABC52'],
    ['case 53', 'https://shop.example/items?_ga=x&id=53&sku=ABC53', 'https://shop.example/items?id=53&sku=ABC53'],
    ['case 54', 'https://shop.example/items?mkt_tok=x&id=54&sku=ABC54', 'https://shop.example/items?id=54&sku=ABC54'],
    ['case 55', 'https://shop.example/items?vero_id=x&id=55&sku=ABC55', 'https://shop.example/items?id=55&sku=ABC55'],
    ['case 56', 'https://shop.example/items?yclid=x&id=56&sku=ABC56', 'https://shop.example/items?id=56&sku=ABC56'],
    ['case 57', 'https://shop.example/items?ttclid=x&id=57&sku=ABC57', 'https://shop.example/items?id=57&sku=ABC57'],
    ['case 58', 'https://shop.example/items?twclid=x&id=58&sku=ABC58', 'https://shop.example/items?id=58&sku=ABC58'],
    ['case 59', 'https://shop.example/items?li_fat_id=x&id=59&sku=ABC59', 'https://shop.example/items?id=59&sku=ABC59'],
    ['case 60', 'https://shop.example/items?epik=x&id=60&sku=ABC60', 'https://shop.example/items?id=60&sku=ABC60'],
  ])('handles generated combination %s', (_label, input, expected) => {
    expect(cleanUrl(input).cleanUrl).toBe(expected);
  });

  it('keeps duplicate safe parameters and removes duplicate tracking parameters', () => {
    const result = cleanUrl('https://example.com/page?id=1&id=2&utm_source=a&utm_source=b');

    expect(result.cleanUrl).toBe('https://example.com/page?id=1&id=2');
    expect(result.removedParams).toHaveLength(2);
  });

  it('preserves hash fragments', () => {
    expect(cleanUrl('https://example.com/page?utm_source=a&id=7#details').cleanUrl).toBe('https://example.com/page?id=7#details');
  });

  it('supports Hebrew path and query values', () => {
    const result = cleanUrl('https://example.com/שלום?utm_source=ניוזלטר&q=יהלומים');

    expect(result.valid).toBe(true);
    expect(result.cleanUrl).toBe('https://example.com/שלום?q=יהלומים');
  });

  it('supports Hebrew domains through URL parsing', () => {
    const result = cleanUrl('https://דוגמה.ישראל/מוצר?utm_medium=email&id=55');

    expect(result.valid).toBe(true);
    expect(result.cleanUrl).toContain('/מוצר?id=55');
  });

  it('returns an invalid result for invalid URLs', () => {
    const result = cleanUrl('not a valid url');

    expect(result.valid).toBe(false);
    expect(result.changed).toBe(false);
    expect(result.cleanUrl).toBe('not a valid url');
    expect(result.error).toBe('Invalid URL');
  });

  it('supports bare domains by assuming https', () => {
    const result = cleanUrl('example.com/page?utm_source=a&id=1');

    expect(result.valid).toBe(true);
    expect(result.cleanUrl).toBe('https://example.com/page?id=1');
  });

  it('can reject bare domains when configured', () => {
    const result = cleanUrl('example.com/page?id=1', { assumeHttpsForBareDomains: false });

    expect(result.valid).toBe(false);
  });

  it('supports custom blocked parameters', () => {
    const result = cleanUrl('https://example.com/page?session_id=abc&id=1', { extraBlockedParams: ['session_id'] });

    expect(result.cleanUrl).toBe('https://example.com/page?id=1');
    expect(result.removedParams[0]).toEqual({ key: 'session_id', value: 'abc', reason: 'Custom blocked parameter' });
  });

  it('lets keepParams override default tracking rules unless extraBlockedParams forces removal', () => {
    const kept = cleanUrl('https://example.com/page?utm_source=a&id=1', { keepParams: ['utm_source'] });
    const forced = cleanUrl('https://example.com/page?utm_source=a&id=1', { keepParams: ['utm_source'], extraBlockedParams: ['utm_source'] });

    expect(kept.cleanUrl).toBe('https://example.com/page?utm_source=a&id=1');
    expect(forced.cleanUrl).toBe('https://example.com/page?id=1');
  });

  it('removes empty parameters only when requested', () => {
    const kept = cleanUrl('https://example.com/page?id=1&empty=');
    const removed = cleanUrl('https://example.com/page?id=1&empty=', { removeEmptyParams: true });

    expect(kept.cleanUrl).toBe('https://example.com/page?id=1&empty=');
    expect(removed.cleanUrl).toBe('https://example.com/page?id=1');
  });

  it('can sort parameters after cleaning', () => {
    const result = cleanUrl('https://example.com/page?z=1&utm_source=a&a=1', { sortParams: true });

    expect(result.cleanUrl).toBe('https://example.com/page?a=1&z=1');
  });

  it('can preserve encoded output when preserveUnicode is false', () => {
    const result = cleanUrl('https://example.com/שלום?utm_source=a&q=בדיקה', { preserveUnicode: false });

    expect(result.cleanUrl).toBe('https://example.com/%D7%A9%D7%9C%D7%95%D7%9D?q=%D7%91%D7%93%D7%99%D7%A7%D7%94');
  });
});

describe('helpers', () => {
  it('validates URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('example.com')).toBe(true);
    expect(isValidUrl('not a url')).toBe(false);
  });

  it('returns removed parameters', () => {
    expect(getRemovedParams('https://example.com?utm_source=a&id=1')).toEqual([
      { key: 'utm_source', value: 'a', reason: 'UTM campaign tracking parameter' }
    ]);
  });

  it('returns known tracking params', () => {
    expect(getKnownTrackingParams('safe')).toContain('utm_*');
    expect(getKnownTrackingParams('safe')).toContain('fbclid');
    expect(getKnownTrackingParams('strict')).toContain('ref');
  });

  it('finds rules for exact and prefix matches', () => {
    expect(getRuleForParam('fbclid')?.reason).toBe('Facebook click identifier');
    expect(getRuleForParam('utm_source')?.reason).toBe('UTM campaign tracking parameter');
    expect(getRuleForParam('ref')).toBeUndefined();
    expect(getRuleForParam('ref', 'strict')?.reason).toBe('Referral source parameter');
  });

  it('makes parameter decisions', () => {
    expect(shouldRemoveParam('fbclid')).toEqual({ remove: true, reason: 'Facebook click identifier' });
    expect(shouldRemoveParam('id')).toEqual({ remove: false });
    expect(shouldRemoveParam('ref')).toEqual({ remove: false });
    expect(shouldRemoveParam('ref', { mode: 'strict' })).toEqual({ remove: true, reason: 'Referral source parameter' });
  });
});
