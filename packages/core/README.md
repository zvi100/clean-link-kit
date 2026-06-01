# @clean-link-kit/core

The core TypeScript package behind Clean Link Kit.

```ts
import { cleanUrl } from '@clean-link-kit/core';

const result = cleanUrl('https://example.com/page?utm_source=email&fbclid=123&id=55');

console.log(result.cleanUrl);
```

Output:

```txt
https://example.com/page?id=55
```
