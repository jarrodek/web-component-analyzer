import { relative } from 'path'
import { Program, TypeChecker } from 'typescript'
import { AnalyzerResult } from '../../analyze/types/analyzer-result.js'
import { ComponentDefinition } from '../../analyze/types/component-definition.js'
import { ComponentCssPart } from '../../analyze/types/features/component-css-part.js'
import { ComponentCssProperty } from '../../analyze/types/features/component-css-property.js'
import { ComponentEvent } from '../../analyze/types/features/component-event.js'
import { ComponentMember } from '../../analyze/types/features/component-member.js'
import { ComponentSlot } from '../../analyze/types/features/component-slot.js'
import { JsDoc } from '../../analyze/types/js-doc.js'
import { arrayDefined, arrayFlat } from '../../util/array-util.js'
import { getTypeHintFromType } from '../../util/get-type-hint-from-type.js'
import { filterVisibility } from '../../util/model-util.js'
import { getFirst } from '../../util/set-util.js'
import { TransformerConfig } from '../transformer-config.js'
import { TransformerFunction } from '../transformer-function.js'
import {
  HtmlData,
  HtmlDataAttribute,
  HtmlDataCssPart,
  HtmlDataCssProperty,
  HtmlDataEvent,
  HtmlDataProperty,
  HtmlDataSlot,
  HtmlDataTag,
} from './custom-elements-json-data.js'

/**
 * Transforms results to json.
 * @param results The results to transform.
 * @param program The program to use.
 * @param config The config to use.
 * @returns The transformed results.
 */
export const jsonTransformer: TransformerFunction = (
  results: AnalyzerResult[],
  program: Program,
  config: TransformerConfig
): string => {
  const checker = program.getTypeChecker()

  // Get all definitions
  const definitions = arrayFlat(results.map((res) => res.componentDefinitions))

  // Transform all definitions into "tags"
  const tags = definitions.map((d) => definitionToHtmlDataTag(d, checker, config))

  const htmlData: HtmlData = {
    version: 'experimental',
    tags,
  }

  return JSON.stringify(htmlData, null, 2)
}

/**
 * Transforms a component definition to a html data tag.
 * @param definition The definition to transform.
 * @param checker The type checker to use.
 * @param config The config to use.
 * @returns The transformed html data tag.
 */
function definitionToHtmlDataTag(
  definition: ComponentDefinition,
  checker: TypeChecker,
  config: TransformerConfig
): HtmlDataTag {
  // Grab path to the definition file if possible
  const node = getFirst(definition.tagNameNodes) || getFirst(definition.identifierNodes)
  const fileName = node?.getSourceFile().fileName
  const path = fileName != null && config.cwd != null ? `./${relative(config.cwd, fileName)}` : undefined

  const declaration = definition.declaration

  if (declaration == null) {
    return {
      name: definition.tagName,
      path,
    }
  }

  const attributes = arrayDefined(
    filterVisibility(config.visibility, declaration.members).map((d) =>
      componentMemberToHtmlDataAttribute(d, checker, config)
    )
  )

  const properties = arrayDefined(
    filterVisibility(config.visibility, declaration.members).map((d) =>
      componentMemberToHtmlDataProperty(d, checker, config)
    )
  )

  const events = arrayDefined(
    filterVisibility(config.visibility, declaration.events).map((e) => componentEventToHtmlDataEvent(e, checker))
  )

  const slots = arrayDefined(declaration.slots.map((e) => componentSlotToHtmlDataSlot(e, checker)))

  const cssProperties = arrayDefined(declaration.cssProperties.map((p) => componentCssPropToHtmlCssProp(p, checker)))

  const cssParts = arrayDefined(declaration.cssParts.map((p) => componentCssPartToHtmlCssPart(p, checker)))

  return {
    name: definition.tagName,
    path,
    description: getDescriptionFromJsDoc(declaration.jsDoc),
    attributes: attributes.length === 0 ? undefined : attributes,
    properties: properties.length === 0 ? undefined : properties,
    events: events.length === 0 ? undefined : events,
    slots: slots.length === 0 ? undefined : slots,
    cssProperties: cssProperties.length === 0 ? undefined : cssProperties,
    cssParts: cssParts.length === 0 ? undefined : cssParts,
    deprecated: declaration.deprecated === true || typeof declaration.deprecated === 'string' || undefined,
    deprecatedMessage: typeof declaration.deprecated === 'string' ? declaration.deprecated : undefined,
  }
}

/**
 * Transforms a component css property to a html css property.
 * @param prop The property to transform.
 * @param _checker The type checker to use.
 * @returns The transformed html css property.
 */
function componentCssPropToHtmlCssProp(
  prop: ComponentCssProperty,
  _checker: TypeChecker
): HtmlDataCssProperty | undefined {
  return {
    name: prop.name || '',
    description: getDescriptionFromJsDoc(prop.jsDoc),
    type: prop.typeHint,
    default: prop.default != null ? JSON.stringify(prop.default) : undefined,
  }
}

/**
 * Transforms a component css part to a html css part.
 * @param part The part to transform.
 * @param _checker The type checker to use.
 * @returns The transformed html css part.
 */
function componentCssPartToHtmlCssPart(part: ComponentCssPart, _checker: TypeChecker): HtmlDataCssPart | undefined {
  return {
    name: part.name || '',
    description: getDescriptionFromJsDoc(part.jsDoc),
  }
}

/**
 * Transforms a component slot to a html data slot.
 * @param slot The slot to transform.
 * @param _checker The type checker to use.
 * @returns The transformed html data slot.
 */
function componentSlotToHtmlDataSlot(slot: ComponentSlot, _checker: TypeChecker): HtmlDataSlot | undefined {
  return {
    name: slot.name || '',
    description: getDescriptionFromJsDoc(slot.jsDoc),
  }
}

/**
 * Transforms a component event to a html data event.
 * @param event The event to transform.
 * @param _checker The type checker to use.
 * @returns The transformed html data event.
 */
function componentEventToHtmlDataEvent(event: ComponentEvent, _checker: TypeChecker): HtmlDataEvent | undefined {
  return {
    name: event.name,
    description: getDescriptionFromJsDoc(event.jsDoc),
    deprecated: event.deprecated === true || undefined,
    deprecatedMessage: typeof event.deprecated === 'string' ? event.deprecated : undefined,
  }
}

/**
 * Transforms a component member to a html data attribute.
 * @param member The member to transform.
 * @param checker The type checker to use.
 * @param config The config to use.
 * @returns The transformed html data attribute.
 */
function componentMemberToHtmlDataAttribute(
  member: ComponentMember,
  checker: TypeChecker,
  config: TransformerConfig
): HtmlDataAttribute | undefined {
  if (member.attrName == null) {
    return undefined
  }

  return {
    name: member.attrName,
    description: getDescriptionFromJsDoc(member.jsDoc),
    type: getTypeHintFromType(member.typeHint ?? member.type?.(), checker, config),
    default: member.default != null ? JSON.stringify(member.default) : undefined,
    deprecated: member.deprecated === true || undefined,
    deprecatedMessage: typeof member.deprecated === 'string' ? member.deprecated : undefined,
  }
}

/**
 * Transforms a component member to a html data property.
 * @param member The member to transform.
 * @param checker The type checker to use.
 * @param config The config to use.
 * @returns The transformed html data property.
 */
function componentMemberToHtmlDataProperty(
  member: ComponentMember,
  checker: TypeChecker,
  config: TransformerConfig
): HtmlDataProperty | undefined {
  if (member.propName == null) {
    return undefined
  }

  return {
    name: member.propName,
    attribute: member.attrName,
    description: getDescriptionFromJsDoc(member.jsDoc),
    type: getTypeHintFromType(member.typeHint ?? member.type?.(), checker, config),
    default: member.default != null ? JSON.stringify(member.default) : undefined,
    deprecated: member.deprecated === true || undefined,
    deprecatedMessage: typeof member.deprecated === 'string' ? member.deprecated : undefined,
  }
}

/**
 * Returns the description from a jsdoc.
 * @param jsDoc The jsdoc to get the description from.
 * @returns The description.
 */
function getDescriptionFromJsDoc(jsDoc: JsDoc | undefined): string | undefined {
  return jsDoc?.description
}
