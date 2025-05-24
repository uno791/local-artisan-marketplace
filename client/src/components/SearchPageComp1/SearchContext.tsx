import React, { createContext, useContext, useState, ReactNode } from "react";

// allowed sort values
type SortKey = "new" | "priceAsc" | "priceDesc";

// context interface for global search state
interface SearchContextType {
  query: string;
  sort: SortKey;
  setQuery: (q: string) => void;
  setSort: (s: SortKey) => void;
}

// create context with undefined default
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// provider to wrap app in search state
export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  return (
    <SearchContext.Provider value={{ query, sort, setQuery, setSort }}>
      {children}
    </SearchContext.Provider>
  );
}

// hook to access context from any component
export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
