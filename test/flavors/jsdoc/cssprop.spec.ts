import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'
import { test } from '@japa/runner'

test('jsdoc: Discovers css properties with @cssprop', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @cssprop --this-is-a-css-prop  - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `)

  const { cssProperties = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(cssProperties.length, 1)
  assert.strictEqual(cssProperties[0].name, '--this-is-a-css-prop')
  assert.strictEqual(cssProperties[0].jsDoc!.description, 'This is a comment')
})

test('jsdoc: Discovers css properties with @cssproperty', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @cssproperty --this-is-a-css-prop  - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `)

  const { cssProperties = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(cssProperties.length, 1)
  assert.strictEqual(cssProperties[0].name, '--this-is-a-css-prop')
  assert.strictEqual(cssProperties[0].jsDoc?.description, 'This is a comment')
})

test('jsdoc: Discovers css properties with @cssproperty and default', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @cssproperty [--element-color=red] - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `)

  const { cssProperties = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(cssProperties.length, 1)
  assert.strictEqual(cssProperties[0].name, '--element-color')
  assert.strictEqual(cssProperties[0].default, 'red')
  assert.strictEqual(cssProperties[0].jsDoc?.description, 'This is a comment')
})
