import type { Genre } from "../types";
import { getGenreNames } from "../data/genres";

// Uses the genres fetched from the API when we have them,
// and falls back to the hardcoded map in data/genres.ts otherwise.
export function resolveGenreNames(
  ids: number[] = [],
  genres: Genre[] = [],
): string[] {
  if (genres.length === 0) return getGenreNames(ids);
  if (ids.length === 0) return ["General"];
  return ids.map((id) => genres.find((g) => g.id === id)?.name ?? "Other");
}
