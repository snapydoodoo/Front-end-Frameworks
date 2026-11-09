import { useState } from "react";
import type { Genre, Movie } from "../types";
import { resolveGenreNames } from "../utils/genreNames";

interface SurpriseMeProps {
  movies: Movie[];
  genres: Genre[];
  onPick: (movie: Movie) => void;
}

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 6, label: "6+ stars" },
  { value: 7, label: "7+ stars" },
  { value: 8, label: "8+ stars" },
];

const SurpriseMe = ({ movies, genres, onPick }: SurpriseMeProps) => {
  const [genreId, setGenreId] = useState(0); // 0 means "any genre"
  const [minRating, setMinRating] = useState(0);
  const [message, setMessage] = useState("");

  // Only offer genres that exist in the movies we loaded, so the user
  // can never pick a genre that has no movie behind it.
  const genreOptions = Array.from(
    new Set(movies.flatMap((movie) => movie.genre_ids ?? [])),
  )
    .map((id) => ({ id, name: resolveGenreNames([id], genres)[0] }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSurprise = () => {
    // 1. keep only the movies that match both filters
    const candidates = movies.filter(
      (movie) =>
        (genreId === 0 || movie.genre_ids?.includes(genreId)) &&
        (movie.vote_average ?? 0) >= minRating,
    );

    // 2. nothing matches: tell the user instead of failing silently
    if (candidates.length === 0) {
      setMessage("No movie matches those filters. Try loosening them.");
      return;
    }

    // 3. pick one at random from the matches and hand it to the parent
    setMessage("");
    onPick(candidates[Math.floor(Math.random() * candidates.length)]);
  };

  return (
    <section className="filter-bar surprise-me" aria-label="Surprise me">
      <div className="surprise-text">
        <strong>Not sure what to watch next?</strong>
        <span>Let us pick one for you.</span>
      </div>

      <div className="surprise-controls">
        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            aria-label="Genre"
            value={genreId}
            onChange={(e) => setGenreId(Number(e.target.value))}
          >
            <option value={0}>Any genre</option>
            {genreOptions.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            aria-label="Minimum rating"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn-primary" onClick={handleSurprise}>
          <span aria-hidden="true">🎲</span> Surprise me
        </button>
      </div>

      {message && (
        <p className="surprise-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
};

export default SurpriseMe;