/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TestContext } from "@japa/runner";
import { isAssignableToType, typeToString } from "ts-simple-type";
import { TypeChecker } from "typescript";
import { ComponentMember, ComponentMemberProperty } from "../../src/analyze/types/features/component-member.js";
import { arrayDefined } from "../../src/util/array-util.js";

export function assertHasMembers(
	actualMembers: ComponentMember[],
	expectedMembers: Partial<ComponentMember>[],
	assert: TestContext["assert"],
	checker?: TypeChecker
): void {
	assert.strictEqual(actualMembers.length, expectedMembers.length);

	for (const expectedMember of expectedMembers) {
		const matchedMembers = actualMembers.filter(
			member => expectedMember.kind === member.kind && expectedMember.attrName === member.attrName && expectedMember.propName === member.propName
		);

		assert.strictEqual(
			matchedMembers.length,
			1,
			`Couldn't find a member with kind: ${expectedMember.kind}, attrName: ${expectedMember.attrName} and propName: ${expectedMember.propName}`
		);

		const actualMember = matchedMembers[0];

		const name = expectedMember.propName || expectedMember.attrName;

		"attrName" in expectedMember && assert.strictEqual(actualMember.attrName, expectedMember.attrName, `Attribute names are not the same`);
		"propName" in expectedMember && assert.strictEqual(actualMember.propName, expectedMember.propName, `Property names are not the same`);
		"default" in expectedMember && assert.deepEqual(actualMember.default, expectedMember.default, `Default value for ${name} doesn't match`);
		"visibility" in expectedMember && assert.strictEqual(actualMember.visibility, expectedMember.visibility, `Visibility for ${name} doesn't match`);
		"reflect" in expectedMember && assert.strictEqual(actualMember.reflect, expectedMember.reflect, `Reflect for ${name} doesn't match`);
		"required" in expectedMember && assert.strictEqual(actualMember.required, expectedMember.required, `Required for ${name} doesn't match`);
		"deprecated" in expectedMember && assert.strictEqual(actualMember.deprecated, expectedMember.deprecated, `Deprecated for ${name} doesn't match`);
		"typeHint" in expectedMember && assert.strictEqual(actualMember.typeHint, expectedMember.typeHint, `TypeHint for ${name} doesn't match`);
		"jsDoc" in expectedMember && assert.strictEqual(actualMember?.jsDoc?.description, expectedMember?.jsDoc?.description, `JSDoc for ${name} doesn't match`);
		if ("meta" in expectedMember) {
			const metaWithoutNode = { ...(actualMember?.meta || {}) };
			delete metaWithoutNode.node;
			assert.deepEqual(metaWithoutNode, expectedMember?.meta, `Meta for ${name} doesn't match`);
		}

		if ("type" in expectedMember) {
			assert.strictEqual(typeof actualMember.type, typeof expectedMember.type);

			if (expectedMember.type != null && actualMember.type != null) {
				if (checker == null) {
					throw new Error("Type checker is not given to assert util!");
				}
				const typeA = actualMember.type();
				const typeB = expectedMember.type();
				assert.isTrue(
					isAssignableToType(typeA, typeB, checker),
					`Type for ${name} doesn't match: ${typeToString(typeA, checker)} === ${typeToString(typeB, checker)}`
				);
			}
		}
	}
}

export function getComponentProp(members: ComponentMember[], propName: string): ComponentMemberProperty | undefined {
	return members.find(member => member.kind === "property" && member.propName === propName) as ComponentMemberProperty | undefined;
}

export function getAttributeNames(members: ComponentMember[]): string[] {
	return arrayDefined(members.map(member => ("attrName" in member ? member.attrName : undefined)));
}

export function getPropertyNames(members: ComponentMember[]): string[] {
	return arrayDefined(members.map(member => (member.kind === "property" ? member.propName : undefined)));
}
