import { useCallback, useState } from "react";
import type { Movie } from "../types";
import { useMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";

interface HomePageProps {
  searchQuery?: string;
}

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const MOVIES_URL = `${BASE_URL}/movie/popular?language=en-US&page=1`;
const GENRES_URL = `${BASE_URL}/genre/movie/list?language=en`;

const HomePage = ({ searchQuery = "" }: HomePageProps) => {
  const { movies, loading, error } = useMovies(MOVIES_URL);
  const { genres } = useGenres(GENRES_URL);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // stable reference so MovieModal's effect doesn't re-subscribe on every render
  const closeModal = useCallback(() => setSelectedMovie(null), []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="main-container">
      <h1>Movie App</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Something went wrong. {error}</p>}
      {!loading && !error && (
        <MovieList
          movies={filteredMovies}
          genres={genres}
          onMovieClick={setSelectedMovie}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          genres={genres}
          onClose={closeModal}
        />
      )}
    </main>
  );
};

export default HomePage;
