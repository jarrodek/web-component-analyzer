import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";

tsTest("Correctly finds method declarations on a class", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 */
	class MyElement extends HTMLElement {
		myMethod () {
		}
	}
	`);

	const { methods = [] } = result.componentDefinitions[0]?.declaration || {};

	assert.strictEqual(methods.length, 1);
	assert.strictEqual(methods[0].name, "myMethod");
});

tsTest("Doesn't pick up method declarations not on class declaration", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 */
	class MyElement extends HTMLElement {
		myMethod () {
			lib.init({
			  fooMethod() {
			  }
			})
		}
	}
	`);

	const { methods = [] } = result.componentDefinitions[0]?.declaration || {};

	assert.strictEqual(methods.length, 1);
	assert.strictEqual(methods[0].name, "myMethod");
});
