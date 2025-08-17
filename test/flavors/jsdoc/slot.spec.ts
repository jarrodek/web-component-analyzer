import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";

test("jsdoc: Discovers slots with @slots", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @slot myslot - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	const { slots } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(slots.length, 1);
	assert.strictEqual(slots[0].name, "myslot");
	assert.strictEqual(slots[0].jsDoc?.description, "This is a comment");
});

test("jsdoc: Discovers unnamed slots with @slots", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @slot - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	const { slots } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(slots.length, 1);

	assert.strictEqual(slots[0].name, undefined);
	assert.strictEqual(slots[0].jsDoc?.description, "This is a comment");
});

test("jsdoc: Discovers permitted tag names on @slot", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @slot {"div"|"span"} myslot1
	 * @slot {"li"} myslot2
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	const {
		slots: [slot1, slot2]
	} = result.componentDefinitions[0].declaration!;

	assert.strictEqual(slot1.permittedTagNames!.length, 2);
	assert.deepEqual(slot1.permittedTagNames, ["div", "span"]);

	assert.strictEqual(slot2.permittedTagNames!.length, 1);
	assert.deepEqual(slot2.permittedTagNames, ["li"]);
});
