import test, { Implementation } from "ava";
import { dirname } from "path";
import { createRequire } from "module";
import * as tsModule from "typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);

type TestFunction = (title: string, implementation: Implementation<unknown[]>) => void;

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
 * Sets up an ava test with the current TypeScript version
 * @param testFunction
 * @param title
 * @param cb
 */
function setupTest(testFunction: TestFunction, title: string, cb: Implementation<unknown[]>) {
	// Generate title with TypeScript version
	const version = tsModule.version;
	const titleWithModule = `[ts${version}] ${title}`;

	// Setup the ava test
	testFunction(titleWithModule, cb);
}

/**
 * Wraps an ava test to include TypeScript version in the title
 * @param testFunction
 */
export function wrapAvaTest(testFunction: TestFunction): TestFunction {
	return (title, implementation) => {
		return setupTest(testFunction, title, implementation);
	};
}

/**
 * Wrap the ava test module in these helper functions
 */
export const tsTest = Object.assign(wrapAvaTest(test), {
	only: wrapAvaTest(test.only),
	skip: wrapAvaTest(test.skip)
});
