# Getting Started

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Install

```bash
npm install
```

## Run the web app

```bash
npm run dev:web
```

## Build everything

```bash
npm run build
```

## Test everything

```bash
npm test
```

## Recommended workflow

Start with the core package. The web app and browser extension should not duplicate URL cleaning logic.

```bash
npm run test -w packages/core
npm run dev:web
```
