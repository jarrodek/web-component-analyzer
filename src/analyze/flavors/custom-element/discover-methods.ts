import { Node } from 'typescript'
import { ComponentMethod } from '../../types/features/component-method.js'
import { getMemberVisibilityFromNode, hasModifier } from '../../util/ast-util.js'
import { getJsDoc } from '../../util/js-doc-util.js'
import { lazy } from '../../util/lazy.js'
import { AnalyzerDeclarationVisitContext } from '../analyzer-flavor.js'

/**
 * Discovers methods
 * @param node The node to discover methods from.
 * @param context The context to use for the discovery.
 * @returns The discovered methods.
 */
export function discoverMethods(node: Node, context: AnalyzerDeclarationVisitContext): ComponentMethod[] | undefined {
  const { ts } = context

  // Never pick up method declaration not declared directly on the declaration node being traversed
  if (node.parent !== context.declarationNode) {
    return undefined
  }

  // class { myMethod () {} }
  if (
    (ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) &&
    !hasModifier(node, ts.SyntaxKind.StaticKeyword, ts)
  ) {
    // Outscope static methods for now
    const name = node.name.getText()

    if (!context.config.analyzeDefaultLib && isHTMLElementMethodName(name)) {
      return undefined
    }

    // Allow the analyzer to analyze within methods
    context.emitContinue?.()

    return [
      {
        jsDoc: getJsDoc(node, ts),
        name,
        node: node,
        visibility: getMemberVisibilityFromNode(node, ts),
        type: lazy(() => context.checker.getTypeAtLocation(node)),
      },
    ]
  }

  return undefined
}

function isHTMLElementMethodName(name: string): boolean {
  return ['attributeChangedCallback', 'connectedCallback', 'disconnectedCallback'].includes(name)
}
