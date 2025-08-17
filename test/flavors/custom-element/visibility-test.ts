import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";
import { assertHasMembers } from "../../helpers/util.js";

tsTest("Handle Typescript visibility modifiers", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 */
	class MyElement extends HTMLElement {
		private myProp1;
		protected myProp2;
	}
`);

	const members = result.componentDefinitions[0]?.declaration?.members || [];

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp1",
				visibility: "private"
			},
			{
				kind: "property",
				propName: "myProp2",
				visibility: "protected"
			}
		], assert,
		checker
	);
});

tsTest("Handle visibility for private '_' prefixed names", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 */
	class MyElement extends HTMLElement {
		_myProp = 123;
		_myMethod () {
		}
	}
`);

	const { members = [], methods: [method] = [] } = result.componentDefinitions[0]?.declaration || {};

	assert.strictEqual(method.name, "_myMethod");
	assert.strictEqual(method.visibility, "private");

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "_myProp",
				visibility: "private"
			}
		], assert,
		checker
	);
});
