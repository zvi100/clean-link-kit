# Clean Link Kit

Clean Link Kit is a privacy-friendly open-source toolkit for cleaning tracking parameters from URLs. It provides a TypeScript core package, a React web app, and a browser extension for creating cleaner, shorter, and safer links before sharing them.

## Why this exists

People share links all day in WhatsApp, email, Slack, LinkedIn, and social networks. Many links include tracking parameters such as `utm_source`, `fbclid`, `gclid`, `msclkid`, and `igshid`. Clean Link Kit removes the obvious tracking noise while keeping useful parameters such as `id`, `page`, `q`, and `sku`.

## Packages

```txt
clean-link-kit/
  apps/
    web/
    extension/
  packages/
    core/
  docs/
```

## Project status

Clean Link Kit is in early `0.1.x` development. The core package is covered by unit tests and the first web app and Chrome extension are ready for local use.

## Demo

The web app is published with GitHub Pages:

https://zvi100.github.io/clean-link-kit/

## Features

- Remove UTM parameters
- Remove `fbclid`, `gclid`, `msclkid`, `igshid`, and similar click identifiers
- Keep meaningful parameters such as `id`, `page`, `q`, `sku`, `variant`, and `currency`
- Safe and strict cleaning modes
- Hebrew and Unicode URL support
- Invalid URL handling
- Local-only React web app with no backend, login, or database
- Local history through `localStorage`
- Chrome extension with popup and context-menu clean copy
- Unit tests for the core package

## Quick start

```bash
npm install
npm run build
npm test
npm run dev:web
```

## Core usage

```ts
import { cleanUrl } from '@clean-link-kit/core';

const result = cleanUrl('https://example.com/product?utm_source=newsletter&utm_campaign=sale&fbclid=abc123&gclid=xyz&id=55');

console.log(result.cleanUrl);
```

Output:

```txt
https://example.com/product?id=55
```

## Safe mode vs strict mode

Safe mode is the default. It removes high-confidence tracking parameters and avoids removing ambiguous parameters that may be required by a website.

Strict mode removes more aggressive share and referral parameters such as `ref`, `ref_src`, `spm`, and `share`.

```ts
cleanUrl('https://example.com/page?ref=twitter&id=55');
cleanUrl('https://example.com/page?ref=twitter&id=55', { mode: 'strict' });
```

## Web app

```bash
npm run dev:web
```

The web app runs fully in the browser. No backend, no login, no database.

## Browser extension

```bash
npm run build -w apps/extension
```

Then load `apps/extension/dist` in Chrome:

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select `apps/extension/dist`

## Recommended first issues

- Add more high-confidence tracking parameters
- Add tests for regional shopping sites
- Add Firefox manifest support
- Add import/export for custom rules
- Improve accessibility checks
- Add screenshots to this README
- Add a public demo deployment

## Community

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Read [SECURITY.md](SECURITY.md) before reporting a security issue.
- Read [docs/architecture.md](docs/architecture.md) to understand how the project is split.
- Read [docs/release.md](docs/release.md) before publishing a release.
- See [ROADMAP.md](ROADMAP.md) for planned and intentionally out-of-scope work.

## License

MIT
