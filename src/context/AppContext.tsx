import { createContext, useContext, useReducer, useEffect } from "react";
import type { Movie, Theme } from "../types";

// 1. State shape and actions
type State = {
  theme: Theme;
  favorites: Movie[];
};

type Action =
  | { type: "SET_THEME" }
  | { type: "TOGGLE_FAVOURITE"; payload: Movie };

// 2. Reducer: a pure function, no side effects (no localStorage in here)
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
      };
    case "TOGGLE_FAVOURITE": {
      const exists = state.favorites.some((m) => m.id === action.payload.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((m) => m.id !== action.payload.id) // remove
          : [...state.favorites, action.payload], // add
      };
    }
    default:
      return state;
  }
};

// 3. What consumers receive
type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Read the saved values once, when the provider first mounts
const getInitialState = (): State => {
  const savedTheme = localStorage.getItem("cinegrid_theme");
  let favorites: Movie[] = [];
  try {
    favorites = JSON.parse(localStorage.getItem("cinegrid_favorites") || "[]");
  } catch {
    favorites = []; // corrupted value in storage: start fresh instead of crashing
  }
  return {
    theme: savedTheme === "light" ? "light" : "dark",
    favorites: Array.isArray(favorites) ? favorites : [],
  };
};

// 4. Provider: wraps the app and owns the state
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Sync the theme to localStorage + the <html data-theme="..."> attribute
  useEffect(() => {
    localStorage.setItem("cinegrid_theme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Sync favourites to localStorage
  useEffect(() => {
    localStorage.setItem("cinegrid_favorites", JSON.stringify(state.favorites));
  }, [state.favorites]);

  const toggleTheme = () => dispatch({ type: "SET_THEME" });

  const toggleFavorite = (movie: Movie) =>
    dispatch({ type: "TOGGLE_FAVOURITE", payload: movie });

  const isFavorite = (id: number) => state.favorites.some((m) => m.id === id);

  return (
    <AppContext.Provider
      value={{
        theme: state.theme,
        toggleTheme,
        favorites: state.favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 5. Custom hook: gives a clear error if someone forgets the Provider
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
