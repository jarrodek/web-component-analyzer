import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'

/**
 * Excludes nodes from "lib.dom.d.ts" if analyzeLibDom is false
 * @param node The node to check.
 * @param context The context to use for the check.
 * @returns True if the node should be excluded.
 */
export function excludeNode(node: Node, context: AnalyzerVisitContext): boolean | undefined {
  if (context.config.analyzeDefaultLib) {
    return undefined
  }

  return isLibDom(node)
}

function isLibDom(node: Node) {
  return node.getSourceFile().fileName.endsWith('lib.dom.d.ts')
}
