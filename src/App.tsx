import { useState } from 'react';
import type { Movie } from './types';
import { SAMPLE_MOVIES } from './data/sampleMovies';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';

export default function App() {
  const [movies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [query, setQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  // derived, NOT in state
  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) &&
      m.vote_average >= minRating,
  );

  return (
    <div className="app">
      <SearchBar query={query} onChange={setQuery} />
      <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
        <option value={0}>All ratings</option>
        <option value={6}>6+</option>
        <option value={7}>7+</option>
        <option value={8}>8+</option>
      </select>
      <MovieList movies={filteredMovies} />
    </div>
  );
}