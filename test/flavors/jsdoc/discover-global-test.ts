import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";

tsTest("jsdoc: Discovers global features on HTMLElement", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(
		{
			fileName: "test.d.ts",
			text: `
	declare global {
	  /**
	   * @fires my-event
	   * @csspart my-part
	   */
	  interface HTMLElement {
	  }
	}
	 `
		},
		{ config: { analyzeGlobalFeatures: true } }
	);

	const { globalFeatures } = result;

	assert.strictEqual(globalFeatures?.cssParts[0]?.name, "my-part");
	assert.strictEqual(globalFeatures?.events[0]?.name, "my-event");
});
