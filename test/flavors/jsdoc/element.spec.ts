import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";

test("jsdoc: Discovers custom elements with @element", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element my-element
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	assert.strictEqual(result.componentDefinitions.length, 1);
	assert.strictEqual(result.componentDefinitions[0].tagName, "my-element");
});

test("jsdoc: Discovers custom elements with @element but without tag name", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	assert.strictEqual(result.componentDefinitions.length, 1);
	assert.strictEqual(result.componentDefinitions[0].tagName, "");
});

test("jsdoc: Discovers custom elements with multiline @element", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element my-element
	 * \`This is a multiline element\`
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	assert.strictEqual(result.componentDefinitions.length, 1);
	assert.strictEqual(result.componentDefinitions[0].tagName, "my-element");
});
