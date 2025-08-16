import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'
import { ComponentMember } from '../../types/features/component-member.js'
import { getJsDoc } from '../../util/js-doc-util.js'
import { resolveNodeValue } from '../../util/resolve-node-value.js'
import { AnalyzerFlavor } from '../analyzer-flavor.js'

/**
 * Discovers members declared on "IntrinsicAttributes"
 */
export const discoverGlobalFeatures: AnalyzerFlavor['discoverGlobalFeatures'] = {
  member: (node: Node, context: AnalyzerVisitContext): ComponentMember[] | undefined => {
    const { ts } = context

    if (ts.isInterfaceDeclaration(node) && node.name.text === 'IntrinsicAttributes') {
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
              attrName: name,
              type: () => context.checker.getTypeAtLocation(member),
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
