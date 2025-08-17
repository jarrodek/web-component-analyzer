import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'
import { test } from '@japa/runner'

test('jsdoc: Discovers css parts with @csspart', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @csspart thumb - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `)

  const { cssParts } = result.componentDefinitions[0].declaration!

  assert.strictEqual(cssParts.length, 1)
  assert.strictEqual(cssParts[0].name, 'thumb')
  assert.strictEqual(cssParts[0].jsDoc?.description, 'This is a comment')
})
