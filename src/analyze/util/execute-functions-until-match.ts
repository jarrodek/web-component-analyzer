import { AnalyzerVisitContext } from '../analyzer-visit-context.js'

/**
 * Executes functions in a function map until some function returns a non-undefined value.
 * @param functionMaps An array of function maps.
 * @param keys The keys to execute in the function maps.
 * @param arg The argument to pass to the functions.
 * @param context The context to pass to the functions.
 * @returns The result of the first function that returns a non-undefined value.
 */
export function executeFunctionsUntilMatch<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Partial<Record<K, any>>,
  K extends keyof T,
  ReturnValue extends ReturnType<NonNullable<T[K]>>,
  ArgType,
>(
  functionMaps: T[],
  keys: K | K[],
  arg: ArgType,
  context: AnalyzerVisitContext
): { value: NonNullable<ReturnValue>; shouldContinue?: boolean } | undefined {
  keys = Array.isArray(keys) ? keys : [keys]

  for (const key of keys) {
    // Loop through each function
    for (const functionMap of functionMaps) {
      const func = functionMap[key]

      if (func == null) continue

      // Save a "continue" flag if necessary
      let shouldContinue = false
      const result = func(arg, {
        ...context,
        emitContinue() {
          shouldContinue = true
        },
      })

      // Return a result if not undefined
      if (result != null) {
        return { value: result as NonNullable<ReturnValue>, shouldContinue }
      }
    }
  }

  return undefined
}
