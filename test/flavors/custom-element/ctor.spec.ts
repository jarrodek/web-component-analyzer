import { test } from "@japa/runner";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { assertHasMembers } from "../../helpers/util.js";

test("Property assignments in the constructor are picked up", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		class MyElement extends HTMLElement {
			constructor () {
				super();
				
				/**
				 * This is a property
				 */
				this.title = "My title";
				
				/**
				 * This property also has an attribute
				 * @attribute
				 */
				this.darkMode = false;
				
				this.item = { title: "foo", description: "bar" };
				
				this._formatter = null;
				this._timeout = setTimeout(console.log, 1000);
			}
		}
		
		customElements.define("my-element", MyElement);
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "title",
				attrName: undefined,
				jsDoc: {
					description: "This is a property"
				},
				default: "My title",
				type: () => ({ kind: "STRING" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			},
			{
				kind: "property",
				propName: "darkMode",
				attrName: "darkMode",
				jsDoc: {
					description: "This property also has an attribute"
				},
				default: false,
				type: () => ({ kind: "BOOLEAN" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			},
			{
				kind: "property",
				propName: "item",
				attrName: undefined,
				jsDoc: undefined,
				default: { title: "foo", description: "bar" },
				type: () => ({ kind: "OBJECT" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			},
			{
				kind: "property",
				propName: "_formatter",
				attrName: undefined,
				jsDoc: undefined,
				default: null,
				type: () => ({ kind: "ANY" }),
				visibility: "private",
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			},
			{
				kind: "property",
				propName: "_timeout",
				attrName: undefined,
				jsDoc: undefined,
				default: undefined,
				type: () => ({ kind: "OBJECT" }),
				visibility: "private",
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			}
		], assert,
		checker
	);
});

test("Property assignments in the constructor are correctly merged", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
	    /**
	     * @attribute my-attr
	     */
		class MyElement extends HTMLElement {
			foo;
			
			constructor () {
				super();
				
				/**
				 * This is a property
				 * @attribute my-attr
				 */
				this.foo = "Bar";
			}
		}
		
		customElements.define("my-element", MyElement);
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "foo",
				attrName: "my-attr",
				jsDoc: {
					description: "This is a property"
				},
				default: "Bar",
				type: () => ({ kind: "STRING" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			}
		], assert,
		checker
	);
});

test("Property assignments in the constructor don't overwrite Typescript modifiers", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		class MyElement extends HTMLElement {
			private foo;
			
			constructor () {
				super();
				this.foo = "Bar";
			}
		}
		
		customElements.define("my-element", MyElement);
	 `
	});

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "foo",
				attrName: undefined,
				jsDoc: undefined,
				default: "Bar",
				type: () => ({ kind: "STRING" }),
				visibility: "private",
				reflect: undefined,
				deprecated: undefined,
				required: undefined,
				typeHint: undefined
			}
		], assert,
		checker
	);
});
