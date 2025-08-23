import { Program } from 'typescript'
import { AnalyzerResult } from '../analyze/types/analyzer-result.js'
import { debugJsonTransformer } from './debug/debug-json-transformer.js'
import { jsonTransformer } from './json/json-transformer.js'
import { json2Transformer } from './json2/json2-transformer.js'
import { markdownTransformer } from './markdown/markdown-transformer.js'
import { TransformerConfig } from './transformer-config.js'
import { TransformerFunction } from './transformer-function.js'
import { TransformerKind } from './transformer-kind.js'
import { vscodeTransformer } from './vscode/vscode-transformer.js'

const transformerFunctionMap: Record<TransformerKind, TransformerFunction> = {
  debug: debugJsonTransformer,
  json: jsonTransformer,
  json2: json2Transformer,
  markdown: markdownTransformer,
  md: markdownTransformer,
  vscode: vscodeTransformer,
}

/**
 * Transforms the analyzer results into a string representation based on the transformer kind.
 * @param kind The kind of transformer to use.
 * @param results The results of the analysis.
 * @param program The typescript program.
 * @param config An options object to configure the transformer.
 * @returns The transformed results as a string.
 */
export function transformAnalyzerResult(
  kind: TransformerKind,
  results: AnalyzerResult | AnalyzerResult[],
  program: Program,
  config: Partial<TransformerConfig> = {}
): string {
  const func = transformerFunctionMap[kind]

  if (func == null) {
    throw new Error(`Couldn't find transformer function for transformer kind: ${kind}`)
  }

  return func(Array.isArray(results) ? results : [results], program, {
    visibility: 'public',
    ...config,
  })
}
