import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'
import { getInterfaceKeys } from '../../util/ast-util.js'
import { DefinitionNodeResult } from '../analyzer-flavor.js'

/**
 * Discovers element definitions in "IntrinsicElements"
 * @param node The node to visit.
 * @param context The context to use for the visit.
 * @returns The discovered definitions.
 */
export function discoverDefinitions(node: Node, context: AnalyzerVisitContext): DefinitionNodeResult[] | undefined {
  const { ts } = context

  if (ts.isInterfaceDeclaration(node)) {
    if (node.name.text === 'IntrinsicElements') {
      const extensions = getInterfaceKeys(node, context)
      return extensions.map(({ key, keyNode, identifier, declaration }) => ({
        tagName: key,
        tagNameNode: keyNode,
        identifierNode: identifier,
        declarationNode: declaration,
      }))
    }
  }

  return undefined
}
