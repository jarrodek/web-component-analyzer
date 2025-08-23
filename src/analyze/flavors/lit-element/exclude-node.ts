import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'
import { getNodeName } from '../../util/ast-util.js'

/**
 * Excludes nodes from lit-element if analyzeDependencies is false.
 * @param node The node to check.
 * @param context The context to use for the check.
 * @returns True if the node should be excluded.
 */
export function excludeNode(node: Node, context: AnalyzerVisitContext): boolean | undefined {
  if (context.config.analyzeDependencies) {
    return undefined
  }

  // Exclude lit element related super classes if "analyzeLib" is false
  const declName = getNodeName(node, context)
  if (declName != null) {
    return declName === 'LitElement' || declName === 'UpdatingElement'
  } else {
    const fileName = node.getSourceFile().fileName

    return fileName.includes('/lit-element.') || fileName.endsWith('/updating-element.')
  }
}
