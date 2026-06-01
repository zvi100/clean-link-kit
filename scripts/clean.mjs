import { rm } from 'node:fs/promises';

const folders = [
  'node_modules',
  'dist',
  'coverage',
  'apps/web/dist',
  'apps/extension/dist',
  'packages/core/dist'
];

await Promise.all(
  folders.map((folder) => rm(new URL(`../${folder}`, import.meta.url), { recursive: true, force: true }))
);
