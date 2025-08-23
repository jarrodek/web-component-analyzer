/**
 * Returns the first element in the set
 * @param set The set to get the first element from.
 * @returns The first element in the set.
 */
export function getFirst<T>(set: Set<T>): T | undefined {
  return set.values().next().value
}
