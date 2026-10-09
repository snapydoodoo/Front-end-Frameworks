interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <header className="navbar">
      <h1 className="logo">CineGrid</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="nav-actions">
        <button className="nav-btn" title="Show favourites">♥</button>
        <button className="nav-btn" title="Toggle theme">☾</button>
      </div>
    </header>
  );
}