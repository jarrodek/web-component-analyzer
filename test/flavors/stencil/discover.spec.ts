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
