import { useEffect, useState } from "react";
import type { Movie } from "../types";

export function useMovies(url: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lets us cancel the request if the component unmounts or `url` changes
    const controller = new AbortController();

    const loadMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        });

        // fetch only rejects on network errors; HTTP errors (401, 404...) must be checked by hand
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setMovies(data.results ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadMovies();

    return () => controller.abort();
  }, [url]);

  return { movies, loading, error };
}
