import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";
import { assertHasMembers } from "../../helpers/util.js";

test("Discovers elements defined JSX.IntrinsicElements", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.d.ts",
		text: `
	declare namespace JSX {
	  interface IntrinsicElements {
		"my-element": { bar?: boolean }
	  }
	}
	 `
	});

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");

	const { members } = componentDefinitions[0].declaration!;

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "bar",
				attrName: undefined,
				jsDoc: undefined,
				type: () => ({ kind: "BOOLEAN" }),
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			}
		], assert,
		checker
	);
});
