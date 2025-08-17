import { test } from "@japa/runner";
import { dirname } from "path";
import { createRequire } from "module";
import * as tsModule from "typescript";
import { fileURLToPath } from "url";
import { TestContext } from "@japa/runner";

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);

type TestFunction = (title: string, callback: (context: TestContext) => void) => void;

/**
 * Returns the current ts module
 */
export function getCurrentTsModule(): typeof tsModule {
	return tsModule;
}

/**
 * Returns the directory of the current ts module
 */
export function getCurrentTsModuleDirectory(): string {
	return dirname(require.resolve("typescript"));
}

/**
 * Sets up a Japa test with the current TypeScript version
 * @param testFunction
 * @param title
 * @param cb
 */
function setupTest(testFunction: TestFunction, title: string, cb: (context: TestContext) => void) {
	// Generate title with TypeScript version
	const version = tsModule.version;
	const titleWithModule = `[ts${version}] ${title}`;

	// Setup the Japa test
	testFunction(titleWithModule, cb);
}

/**
 * Wraps a Japa test to include TypeScript version in the title
 * @param testFunction
 */
export function wrapJapaTest(testFunction: TestFunction): TestFunction {
	return (title, implementation) => {
		return setupTest(testFunction, title, implementation);
	};
}

/**
 * Wrap the Japa test module in these helper functions
 */
export const tsTest = Object.assign(wrapJapaTest(test), {
	only: wrapJapaTest(test.only),
	skip: wrapJapaTest(test.skip)
});
