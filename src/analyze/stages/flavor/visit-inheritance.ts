import { Node } from 'typescript'
import { AnalyzerVisitContext } from '../../analyzer-visit-context'
import { InheritanceResult } from '../../flavors/analyzer-flavor'

/**
 * Uses flavors to find inheritance for a node
 * @param node
 * @param context
 * @param emit
 * @param visitSet
 */
export function visitInheritance(
  node: Node,
  context: AnalyzerVisitContext,
  emit: (result: InheritanceResult) => void
): void {
  for (const flavor of context.flavors) {
    const result = flavor.discoverInheritance?.(node, context)
    if (result != null) {
      emit(result)
    }
  }
}
