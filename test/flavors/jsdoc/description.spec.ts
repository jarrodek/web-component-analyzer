import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module.js";
import { test } from "@japa/runner";
import { inspect } from "util";

test("jsdoc: Correctly discovers the description in the jsdoc", ({ assert }) => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	/**
	 * layout to full document height as follows:
	 * \`\`\`
	 * \\@media screen {
	 *   html, body {
	 *     height: 100%;
	 *   }
	 * }
	 * \`\`\`
	 * This is an example
	 * @element
	 */
	 class MyElement extends HTMLElement {
	 }
	 `);

	const declaration = result.componentDefinitions[0].declaration!;

	const description = declaration.jsDoc?.description ?? "";
	const allowed = new Set<string>([
		`layout to full document height as follows:
\`\`\`
@media screen {
  html, body {
    height: 100%;
  }
}
\`\`\`
This is an example`,
		`layout to full document height as follows:
\`\`\`
@media screen {
   html, body {
     height: 100%;
   }
}
\`\`\`
This is an example`
	]);
	assert.isTrue(allowed.has(description), `Expected ${inspect(description)} to be one of ${inspect(allowed)}`);
});
