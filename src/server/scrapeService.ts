import fs from 'fs/promises';
import path from 'path';
import { DATA_DIR } from './serverContext.ts';

export async function getDeletedIds(): Promise<string[]> {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'deleted_ids.json'), 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function saveDeletedIds(ids: string[]) {
  await fs.writeFile(path.join(DATA_DIR, 'deleted_ids.json'), JSON.stringify(ids));
}

export async function mergeScrapedData(_source: string) {
  return { success: true, count: 0 };
}

export function hammingDistance(h1: string, h2: string): number {
  if (!h1 || !h2 || h1.length !== h2.length) return 999;
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    const b1 = parseInt(h1[i], 16).toString(2).padStart(4, '0');
    const b2 = parseInt(h2[i], 16).toString(2).padStart(4, '0');
    for (let j = 0; j < 4; j++) {
      if (b1[j] !== b2[j]) dist++;
    }
  }
  return dist;
}
