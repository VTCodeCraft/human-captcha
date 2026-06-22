/**
 * Returns true when the traced path exactly equals the expected path: same
 * length and same tile ids in the same order.
 *
 * Callers are expected to pass `visited` already de-duplicated for consecutive
 * repeats (e.g. [1,1,1] collapsed to [1]).
 */
export function validatePath(expected: number[], visited: number[]): boolean {
  if (expected.length !== visited.length) return false;
  return expected.every((id, index) => id === visited[index]);
}
