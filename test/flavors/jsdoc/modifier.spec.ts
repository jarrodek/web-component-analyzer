import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";
import { assertHasMembers } from "../../helpers/util.js";

test("jsDoc: Handles @readonly on members", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
		/**
		 * @element
	     */
		class MyElement extends HTMLElement {
			/**
			 * @readonly
			 */
			myProp = "foo";
		}
	 `);

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"]),
				type: () => ({ kind: "STRING" })
			}
		], assert,
		checker
	);
});
