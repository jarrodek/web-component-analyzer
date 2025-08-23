import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'
import { ComponentEvent } from '../../types/features/component-event.js'
import { ComponentMember } from '../../types/features/component-member.js'
import { getJsDoc } from '../../util/js-doc-util.js'
import { lazy } from '../../util/lazy.js'
import { resolveNodeValue } from '../../util/resolve-node-value.js'
import { AnalyzerFlavor } from '../analyzer-flavor.js'

/**
 * Discovers global feature defined on "HTMLElementEventMap" or "HTMLElement"
 */
export const discoverGlobalFeatures: AnalyzerFlavor['discoverGlobalFeatures'] = {
  /**
   * Discovers global events.
   * @param node The node to visit.
   * @param context The context to use for the visit.
   */
  event: (node: Node, context: AnalyzerVisitContext): ComponentEvent[] | undefined => {
    const { ts, checker } = context

    if (
      context.ts.isInterfaceDeclaration(node) &&
      ['HTMLElementEventMap', 'GlobalEventHandlersEventMap'].includes(node.name.text)
    ) {
      const events: ComponentEvent[] = []

      for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
          const name = resolveNodeValue(member.name, context)?.value

          if (name != null && typeof name === 'string') {
            events.push({
              node: member,
              jsDoc: getJsDoc(member, ts),
              name: name,
              type: lazy(() => checker.getTypeAtLocation(member)),
            })
          }
        }
      }

      context?.emitContinue?.()

      return events
    }
    return undefined
  },
  /**
   * Discovers global members.
   * @param node The node to visit.
   * @param context The context to use for the visit.
   */
  member: (node: Node, context: AnalyzerVisitContext): ComponentMember[] | undefined => {
    const { ts } = context

    if (context.ts.isInterfaceDeclaration(node) && node.name.text === 'HTMLElement') {
      const members: ComponentMember[] = []

      for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
          const name = resolveNodeValue(member.name, context)?.value

          if (name != null && typeof name === 'string') {
            members.push({
              priority: 'medium',
              node: member,
              jsDoc: getJsDoc(member, ts),
              kind: 'property',
              propName: name,
              type: lazy(() => context.checker.getTypeAtLocation(member)),
            })
          }
        }
      }

      context?.emitContinue?.()

      return members
    }
    return undefined
  },
}
