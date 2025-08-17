import { SimpleType } from "ts-simple-type";
import { parseSimpleJsDocTypeExpression } from "../../../src/analyze/util/js-doc-util.js";
import { getCurrentTsModule } from "../../helpers/ts-test.js";
import { test } from "@japa/runner";

test("Parse required and union", ({ assert }) => {
	const ts = getCurrentTsModule();
	const program = ts.createProgram([], {});
	const type = parseSimpleJsDocTypeExpression("!Array|undefined", { ts, program });

	assert.deepEqual(type, {
		kind: "UNION",
		types: [{ kind: "ARRAY", type: { kind: "ANY" } }, { kind: "UNDEFINED" }]
	} as SimpleType);
});
