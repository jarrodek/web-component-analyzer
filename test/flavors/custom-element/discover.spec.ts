import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";

test("Discovers elements defined using customElements.define", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		class MyElement extends HTMLElement {
		}

		customElements.define("my-element", MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
});

test("Discovers elements defined using window.customElements.define", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		class MyElement extends HTMLElement {
		}

		window.customElements.define("my-element", MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
});

test("Discovers only one element defined using multiple customElements.define", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		class MyElement extends HTMLElement {
		}

		customElements.define("my-element", MyElement);
		customElements.define("my-element", MyElement);
		customElements.define("my-element", MyElement);
		customElements.define("my-element", MyElement);
		customElements.define("my-element", MyElement);
		declare global {
			interface HTMLElementTagNameMap {
				"my-element": MyElement;
			}
		}
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
});

test("Does not discover elements defined using custom define function", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		function define (tagName: string, elem: any) {}

		class MyElement extends HTMLElement {
		}

		define("my-element", MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 0);
});

test("Discovers elements defined using customElements.define without string literal", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		class MyElement extends HTMLElement {
			static get tag() {
				return "my-element";
			}
		}

		customElements.define(MyElement.tag, MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
});

test("Doesn't crash when encountering component declaration nodes that can't be resolved", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		customElements.define("my-element", MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
	assert.strictEqual(componentDefinitions[0].declaration, undefined);
});

test("Discovers declaration in other file", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule([
		{
			analyze: true,
			fileName: "def.ts",
			text: `
				import {MyElement} from './decl.js';
				customElements.define("my-element", MyElement);
			`
		},
		{
			fileName: "decl.ts",
			text: `
				/**
				 * hello
				 */
				export class MyElement extends HTMLElement {
				}
			`
		}
	]);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
	assert.strictEqual(componentDefinitions[0].declaration?.jsDoc?.description, "hello");
});

test("Correctly discovers multiple declarations", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.d.ts",
		text: `
			interface MyElement extends HTMLElement {
			}
			var MyElement: {
				prototype: MyElement;
				new (): MyElement;
			};
			customElements.define("my-element", MyElement);
		`
	});

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
	assert.strictEqual(componentDefinitions[0].declaration?.members?.some(m => m.propName === "prototype"), false);
	assert.strictEqual(componentDefinitions[0].declaration?.methods?.some(m => m.name === "new"), false);
});

test("Discovers elements using typescript >=4.3 syntax", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
		class BaseElement extends HTMLElement {
			connectedCallback() {
				console.log(808);
			}
		}

		class MyElement extends BaseElement {
			override connectedCallback() {
				super.connectedCallback();
			}
		}

		customElements.define("my-element", MyElement);
	`);

	const { componentDefinitions } = result;

	assert.strictEqual(componentDefinitions.length, 1);
	assert.strictEqual(componentDefinitions[0].tagName, "my-element");
});
