import { AnalyzerFlavor } from './flavors/analyzer-flavor.js'
import { CustomElementFlavor } from './flavors/custom-element/custom-element-flavor.js'
import { JsDocFlavor } from './flavors/js-doc/js-doc-flavor.js'
import { JSXFlavor } from './flavors/jsx/jsx-flavor.js'
import { LitElementFlavor } from './flavors/lit-element/lit-element-flavor.js'
import { LwcFlavor } from './flavors/lwc/lwc-flavor.js'

export const VERSION = '<@VERSION@>'

export const DEFAULT_FLAVORS: AnalyzerFlavor[] = [
  new LitElementFlavor(),
  new LwcFlavor(),
  new CustomElementFlavor(),
  new JsDocFlavor(),
  new JSXFlavor(),
]

export const DEFAULT_FEATURE_COLLECTION_CACHE = new WeakMap()

export const DEFAULT_COMPONENT_DECLARATION_CACHE = new WeakMap()
