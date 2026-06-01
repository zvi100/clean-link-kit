# Contributing

Thanks for helping improve Clean Link Kit.

## Development setup

```bash
npm install
npm run build
npm test
```

## Project rules

- Keep the core package small and dependency-free.
- Prefer safe cleaning over aggressive cleaning.
- Every new tracking rule should include tests.
- Do not add a backend, login, or database to the first version.
- Keep the web app accessible and usable on mobile.

## Adding a tracking rule

1. Add the rule in `packages/core/src/rules.ts`.
2. Add at least one safe-mode or strict-mode test in `packages/core/src/cleanUrl.test.ts`.
3. Update `docs/rules.md` if the rule is user-facing.

## Pull request checklist

- Tests pass
- Type checks pass
- Documentation is updated when behavior changes
- No tracking or analytics is added to the project
