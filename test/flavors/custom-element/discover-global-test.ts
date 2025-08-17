import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";
import { assertHasMembers } from "../../helpers/util.js";

tsTest("Discovers global members on HTMLElement", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(
		{
			fileName: "test.d.ts",
			text: `
	declare global {
	  /**
	   * @attr anAttr
	   * @prop aProp
	   */
	  interface HTMLElement {
		"mdc-dialog-action": string;
		myProp: boolean;
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
				propName: "mdc-dialog-action",
				type: () => ({ kind: "STRING" })
			},
			{
				kind: "property",
				propName: "myProp",
				type: () => ({ kind: "BOOLEAN" })
			},
			{
				kind: "property",
				propName: "aProp"
			},
			{
				kind: "attribute",
				attrName: "anAttr"
			}
		], assert,
		checker
	);
});

tsTest("Discovers global events on HTMLElementEventMap and HTMLElement", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(
		{
			fileName: "test.d.ts",
			text: `
	declare global {
	  /**
	   * @fires update
	   */
	  interface HTMLElement {
	  }
	  interface HTMLElementEventMap {
        'change': CustomEvent;
       }
	}
	 `
		},
		{ config: { analyzeGlobalFeatures: true } }
	);

	const { globalFeatures } = result;

	assert.strictEqual(globalFeatures?.events.length, 2);
	assert.strictEqual(globalFeatures?.events[0].name, "update");
	assert.strictEqual(globalFeatures?.events[1].name, "change");
});
