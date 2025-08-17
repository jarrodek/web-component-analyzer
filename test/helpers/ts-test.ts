import { dirname } from 'path'
import { createRequire } from 'module'
import * as tsModule from 'typescript'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const require = createRequire(__filename)

/**
 * Returns the current ts module
 */
export function getCurrentTsModule(): typeof tsModule {
  return tsModule
}

/**
 * Returns the directory of the current ts module
 */
export function getCurrentTsModuleDirectory(): string {
  return dirname(require.resolve('typescript'))
}
