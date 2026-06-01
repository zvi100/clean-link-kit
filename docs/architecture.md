# Architecture

Clean Link Kit is split into three small parts.

## Core package

`packages/core` contains the URL cleaning logic.

It does not depend on React, Chrome APIs, a backend, or a database. The core package receives a URL string and returns:

- the original URL
- the clean URL
- the parameters that were removed
- the reason each parameter was removed
- whether the URL was valid

This keeps the important logic easy to test and reuse.

## Web app

`apps/web` is a Vite and React app.

It runs fully in the browser. Users can paste a URL, clean it, copy the result, and see a local history saved only in their browser.

The web app imports the core package instead of duplicating cleaning rules.

## Browser extension

`apps/extension` is a Chrome extension.

It uses the same core package as the web app. The extension includes:

- a popup for pasting and cleaning links
- a context-menu action for copying a clean version of a link

## Privacy boundary

Clean Link Kit should stay local-first:

- no backend
- no login
- no database
- no analytics that track users
- no automatic link rewriting without user control

If a future feature needs to change one of these rules, it should be discussed in an issue before implementation.

