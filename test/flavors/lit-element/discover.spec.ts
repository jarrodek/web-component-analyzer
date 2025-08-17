import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'
import { test } from '@japa/runner'

test('LitElement: Discovers elements defined using @customElement decorator', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
		@customElement("my-element")
		class MyElement extends HTMLElement {
		}
	 `)

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'my-element')
})

let testName = 'LitElement: Discovers @customElement(stringConstant)'
test(testName, ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
		const str = 'string-constant';
		@customElement(str)
		class MyElement extends HTMLElement {
		}
	 `)

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'string-constant')
})

testName = "LitElement: Doesn't discover @customElement(stringVariable)"
test(testName, ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
		function defineElem(str: string) {;
			@customElement(str)
			class MyElement extends HTMLElement {
			}
		}
	 `)

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 0)
})
