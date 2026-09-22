import { readFile } from 'node:fs/promises';

export async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}
