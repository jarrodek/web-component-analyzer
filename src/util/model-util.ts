import { VisibilityKind } from '../analyze/types/visibility-kind.js'

const VISIBILITY_NUMBER_MAP: Record<VisibilityKind, number> = {
  private: 1,
  protected: 2,
  public: 3,
}

/**
 * Removes all items from an array with visibilities that are less visible than "visibility".
 * @param visibility The visibility to filter by.
 * @param array The array to filter.
 * @returns The filtered array.
 */
export function filterVisibility<T extends { visibility?: VisibilityKind }>(
  visibility: VisibilityKind = 'public',
  array: T[]
): T[] {
  const target = VISIBILITY_NUMBER_MAP[visibility]
  return array.filter((item) => VISIBILITY_NUMBER_MAP[item.visibility || 'public'] >= target)
}
