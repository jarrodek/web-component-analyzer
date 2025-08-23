const NOTHING = Symbol()

/**
 * This function wraps a callback returning a value and cahced the value.
 * @param callback The callback to wrap.
 * @returns A function that returns the cached value.
 */
export function lazy<T>(callback: () => T): () => T {
  let value: T | typeof NOTHING = NOTHING

  return () => {
    if (value === NOTHING) {
      value = callback()
    }

    return value
  }
}
