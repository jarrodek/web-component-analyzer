import { Program } from 'typescript'
import { AnalyzerResult } from '../../analyze/types/analyzer-result.js'
import { arrayFlat } from '../../util/array-util.js'
import { stripTypescriptValues } from '../../util/strip-typescript-values.js'
import { TransformerConfig } from '../transformer-config.js'
import { TransformerFunction } from '../transformer-function.js'

/**
 * Transforms results to json.
 * @param results The results to transform.
 * @param program The program to use.
 * @param _config The config to use.
 * @returns The transformed results.
 */
export const debugJsonTransformer: TransformerFunction = (
  results: AnalyzerResult[],
  program: Program,
  _config: TransformerConfig
): string => {
  const definitions = arrayFlat(results.map((res) => res.componentDefinitions))
  return JSON.stringify(stripTypescriptValues(definitions, program.getTypeChecker()), null, 2)
}
