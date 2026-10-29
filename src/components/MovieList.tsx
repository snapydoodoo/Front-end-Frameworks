import type { Genre, Movie } from "../types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  genres?: Genre[];
  onMovieClick?: (movie: Movie) => void;
}

const MovieList = ({ movies, genres, onMovieClick }: MovieListProps) => {
  if (movies.length === 0) {
    return <p className="empty-state">No movies found.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          genres={genres}
          onMovieClick={onMovieClick}
        />
      ))}
    </div>
  );
};

export default MovieList;
