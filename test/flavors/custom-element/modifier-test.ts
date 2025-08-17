import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";
import { assertHasMembers } from "../../helpers/util.js";

tsTest("Readonly modifier is found", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			readonly myProp: string;
		}
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"])
			}
		], assert,
		checker
	);
});

tsTest("Getter have readonly modifier", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			get myProp() {
				return "foo";
			}
		}
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"])
			}
		], assert,
		checker
	);
});

tsTest("Getter and setter become one property without readonly modifier", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			get myProp() {
				return "foo";
			}
		}
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(),
				type: () => ({ kind: "STRING" })
			}
		], assert,
		checker
	);
});
