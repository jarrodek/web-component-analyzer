import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'
import { test } from '@japa/runner'
import { getComponentProp } from '../../helpers/util.js'

test('jsDoc: Handles visibility modifier on internal event', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule(`
		/**
		 * @element
	     */
		class MyElement extends HTMLElement {
			myMethod () {
				/**
				 * @private
				 */
				this.dispatchEvent(new CustomEvent("my-event"));
			}
		}
	 `)

  const {
    events: [event],
  } = result.componentDefinitions[0].declaration!

  assert.isDefined(event)
  assert.strictEqual(event.visibility, 'private')
})

test('jsDoc: Handles visibility modifier on constructor assignment', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'test.js',
    text: `
		/**
		 * @element
	     */
		class MyElement extends HTMLElement {
			constructor () {
				super();
				/**
				 * @protected
			     */
				this.foo = "bar";
			}	
		}
	 `,
  })

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  const member = getComponentProp(members, 'foo')

  assert.isDefined(member)
  assert.strictEqual(member!.visibility, 'protected')
})
