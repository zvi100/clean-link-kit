# Browser Extension

The extension uses the same `@clean-link-kit/core` package as the web app.

## Build

```bash
npm run build -w apps/extension
```

## Load in Chrome

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select `apps/extension/dist`

## Features

- Popup for pasting and cleaning a URL
- Copy button
- Right-click a link and choose Copy clean link

## Permissions

The extension keeps permissions narrow for the first release:

- `contextMenus` adds the right-click clean-copy action.
- `activeTab` and `scripting` let the extension copy a cleaned link after a user action.
- `clipboardWrite` lets the popup and context-menu flow write the cleaned link to the clipboard.

The extension does not inject a content script into every website.

## Design principles

- Keep all cleaning local
- Do not send URLs to a server
- Do not add analytics
- Keep permissions minimal for the feature set
