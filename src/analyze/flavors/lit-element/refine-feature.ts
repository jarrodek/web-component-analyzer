import { AnalyzerVisitContext } from '../../analyzer-visit-context.js'
import { ComponentMethod } from '../../types/features/component-method.js'
import { AnalyzerFlavor } from '../analyzer-flavor.js'

export const refineFeature: AnalyzerFlavor['refineFeature'] = {
  /**
   * Refines a method feature.
   * @param method The method to refine.
   * @param _context The context to use for the refinement.
   */
  method: (method: ComponentMethod, _context: AnalyzerVisitContext): ComponentMethod | undefined => {
    // This is temporary, but for now we force lit-element named methods to be protected
    if (LIT_ELEMENT_PROTECTED_METHODS.includes(method.name)) {
      return {
        ...method,
        visibility: 'protected',
      }
    }

    return method
  },
}

const LIT_ELEMENT_PROTECTED_METHODS = [
  'render',
  'requestUpdate',
  'firstUpdated',
  'updated',
  'update',
  'shouldUpdate',
  'hasUpdated',
  'updateComplete',
]
