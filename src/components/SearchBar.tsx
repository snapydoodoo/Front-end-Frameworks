interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

// The .header-search wrapper now lives in App (see Session 4)
const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <div className="search-input-wrapper">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search movies, plot keywords, titles..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="search-clear-btn"
        onClick={() => onChange("")}
        title="Clear search"
        type="button"
      >
        ✕
      </button>
    </div>
  );
};

export default SearchBar;
