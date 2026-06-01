# Release Process

This project uses small, clear releases.

## Before a release

1. Make sure the changelog has the new version.
2. Run the checks:

```bash
npm ci
npm test
npm run typecheck
npm run build
```

3. Check the web app locally:

```bash
npm run dev:web
```

4. Check the extension build:

```bash
npm run build -w apps/extension
```

## Versioning

Use `0.x` versions while the project is still early.

- Patch version: bug fixes, docs, or safe tracking-rule additions
- Minor version: new visible features or extension improvements
- Major version: saved for later, after the API is stable

## GitHub release notes

Release notes should include:

- what changed
- how users can try it
- any breaking changes
- known limitations

## After a release

1. Confirm GitHub Pages still deploys.
2. Confirm the README demo link works.
3. Open follow-up issues for unfinished work.

