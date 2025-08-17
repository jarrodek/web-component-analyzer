import { join } from "path";
import { test } from "@japa/runner";
import { analyzeHTMLElement } from "../../../src/analyze/analyze-html-element.js";
import { ComponentHeritageClause } from "../../../src/analyze/types/component-declaration.js";
import { getCurrentTsModule, getCurrentTsModuleDirectory } from "../../helpers/ts-test.js";
import { getComponentProp } from '../../helpers/util.js';

test("analyzeHTMLElement returns correct result", ({ assert }) => {
	const tsModule = getCurrentTsModule();
	const program = tsModule.createProgram([join(getCurrentTsModuleDirectory(), "lib.dom.d.ts")], {});
	const result = analyzeHTMLElement(program, tsModule);

	assert.isDefined(result);

	const ext = getAllInheritedNames(result!.heritageClauses);

	// Test that the node extends some of the interfaces
	if (!tsModule.version.startsWith("5.")) {
		assert.isTrue(ext.has("DocumentAndElementEventHandlers"));
	}
	assert.isTrue(ext.has("GlobalEventHandlers"));
	assert.isTrue(ext.has("EventTarget"));
	assert.isTrue(ext.has("Node"));
	assert.isTrue(ext.has("ElementContentEditable"));

	// From ElementContentEditable interface
	assert.isDefined(getComponentProp(result!.members, "contentEditable"));
	// From Node interface
	assert.isDefined(getComponentProp(result!.members, "baseURI"));
	// From EventTarget interface
	assert.isDefined(result!.methods.find(m => m.name === "addEventListener"));
});

function getAllInheritedNames(heritageClauses: ComponentHeritageClause[], names: Set<string> = new Set()) {
	for (const heritageClause of heritageClauses) {
		names.add(heritageClause.identifier.getText());
		if (heritageClause.declaration != null) {
			getAllInheritedNames(heritageClause.declaration.heritageClauses, names);
		}
	}

	return names;
}
