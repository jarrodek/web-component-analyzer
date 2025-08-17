import { isAssignableToSimpleTypeKind, isAssignableToType, SimpleType, typeToString } from "ts-simple-type";
import { getLibTypeWithName } from "../../../src/analyze/util/type-util.js";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { getCurrentTsModule, tsTest } from "../../helpers/ts-test.js";

tsTest("jsdoc: Discovers custom events with @fires", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @fires my-event - This is a comment
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	const { events } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(events.length, 1);
	assert.strictEqual(events[0].name, "my-event");
	assert.strictEqual(events[0].jsDoc?.description, "This is a comment");
});

tsTest("jsdoc: Discovers the detail type of custom events with @fires", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @fires {string} my-event
	 * @fires my-second-event {number}
	 */
	 class MyElement extends HTMLElement { 
	 }
	 `);

	const { events } = result.componentDefinitions[0].declaration!;
	const myEvent = events.find(e => e.name === "my-event")!;
	const mySecondEvent = events.find(e => e.name === "my-second-event")!;
	assert.isTrue(isAssignableToSimpleTypeKind(myEvent.type!() as SimpleType, "STRING"));
	assert.isTrue(isAssignableToSimpleTypeKind(mySecondEvent.type!() as SimpleType, "NUMBER"));
});

tsTest("jsdoc: Discovers events declared with @fires that includes extra jsdoc information", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * @element
	 * @fires InputSwitch#[CustomEvent]input-switch-check-changed Fires when check property changes
	 */
	 class MyElement extends HTMLElement {
	 }
	 `);

	const { events } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(events.length, 1);
	assert.strictEqual(events[0].name, "input-switch-check-changed");
	assert.strictEqual(events[0].jsDoc?.description, "Fires when check property changes");
});

tsTest("jsdoc: Discovers and correctly parses event types", ({ assert }) => {
	const {
		results: [result],
		program
	} = analyzeTextWithCurrentTsModule({
		includeLib: true,
		fileName: "file.ts",
		text: `
	/**
	 * @element
	 * @fires {MouseEvent} mouse-move
	 * @fires {CustomEvent} custom-event-1
	 * @fires {CustomEvent<string>} custom-event-2
	 * @fires {Event} my-event
	 */
	 class MyElement extends HTMLElement {
	 }
	 `
	});

	const { events } = result.componentDefinitions[0].declaration!;

	const assertEvent = (name: string, typeName: string, type: SimpleType) => {
		const event = events.find(e => e.name === name);
		if (event == null) {
			assert.fail(`Couldn't find event with name: ${name}`);
			return;
		}

		//console.log(event.type());
		assert.strictEqual(typeToString(event.type!() as SimpleType, program.getTypeChecker()), typeName);
		assert.isTrue(isAssignableToType(type, event.type!(), program));
	};

	assert.strictEqual(events.length, 4);

	assertEvent("mouse-move", "MouseEvent", getLibTypeWithName("MouseEvent", { ts: getCurrentTsModule(), program: program })!);
	assertEvent("custom-event-1", "CustomEvent", getLibTypeWithName("CustomEvent", { ts: getCurrentTsModule(), program: program })!);
	assertEvent("custom-event-2", "CustomEvent<string>", getLibTypeWithName("CustomEvent", { ts: getCurrentTsModule(), program: program })!);
	assertEvent("my-event", "Event", getLibTypeWithName("Event", { ts: getCurrentTsModule(), program: program })!);
});
