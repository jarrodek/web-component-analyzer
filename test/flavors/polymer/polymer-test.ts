import { isAssignableToSimpleTypeKind } from "ts-simple-type";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { tsTest } from "../../helpers/ts-test.js";
import { getComponentProp } from "../../helpers/util.js";

tsTest("Polymer components are correctly picked up", ({ assert }) => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
		class XCustom extends PolymerElement {
			static get properties() {
				return {
					user: String,
					isHappy: Boolean,
					count: {
						type: Number,
						readOnly: true,
						notify: true,
						value: 10
					}
				}
			}
		}

		customElements.define('x-custom', XCustom);
	 `);

	const { members } = result.componentDefinitions[0].declaration!;

	assert.strictEqual(members.length, 3);

	const userProp = getComponentProp(members, "user");
	assert.isDefined(userProp);
	assert.isTrue(isAssignableToSimpleTypeKind(userProp!.type!(), "STRING", checker));
	assert.strictEqual(userProp!.attrName, "user");

	const isHappyProp = getComponentProp(members, "isHappy");
	assert.isDefined(isHappyProp);
	assert.isTrue(isAssignableToSimpleTypeKind(isHappyProp!.type!(), "BOOLEAN", checker));
	assert.strictEqual(isHappyProp!.attrName, "is-happy");

	const countProp = getComponentProp(members, "count");
	assert.isDefined(countProp);
	assert.isTrue(isAssignableToSimpleTypeKind(countProp!.type!(), "NUMBER", checker));
	assert.strictEqual(countProp!.attrName, "count");
	assert.strictEqual(countProp!.default, 10);
});
