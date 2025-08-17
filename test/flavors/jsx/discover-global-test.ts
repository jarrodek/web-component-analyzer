import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";
import { assertHasMembers } from "../../helpers/util.js";

tsTest("Discovers global features on JSX.IntrinsicAttributes", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(
		{
			fileName: "test.d.ts",
			text: `
	declare namespace JSX {
	  interface IntrinsicAttributes {
	    /**
	     * @attr
	     */
		bar?: boolean;
	  }
	}
	 `
		},
		{ config: { analyzeGlobalFeatures: true } }
	);

	const { globalFeatures } = result;

	assertHasMembers(
		globalFeatures?.members || [],
		[
			{
				kind: "property",
				propName: "bar",
				attrName: "bar",
				type: () => ({ kind: "BOOLEAN" })
			}
		], assert,
		checker
	);
});
