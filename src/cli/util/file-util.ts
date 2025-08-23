import { mkdirSync } from 'fs'

/**
 * Ensures that a directory exists.
 * @param dir The directory to ensure.
 */
export function ensureDirSync(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true })
  } catch (err) {
    if ((err as Error & { code: string }).code !== 'EEXIST') throw err
  }
}
