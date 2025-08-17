import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";

tsTest("jsDoc: Handles @ignore jsdoc tag", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		/**
		 * @element
	     */
		class MyElement extends HTMLElement {
		    /**
		     * @ignore
		     */
			myMethod () {
				/**
				 * @ignore
				 */
				this.dispatchEvent(new CustomEvent("my-event"));
			}
			
			/**
			 * @ignore
			 */
			foo = "bar";
		}
	 `);

	const { events, methods, members } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(events.length, 0);
	assert.strictEqual(members.length, 0);
	assert.strictEqual(methods.length, 0);
});
