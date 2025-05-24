import React, { createContext, useContext, useState, ReactNode } from "react";

// available sort options
type SortKey = "new" | "priceAsc" | "priceDesc";

// context shape
interface SearchContextType {
  query: string;
  sort: SortKey;
  setQuery: (q: string) => void;
  setSort: (s: SortKey) => void;
}

// create search context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// provider that wraps children with search state
export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("new");

  return (
    <SearchContext.Provider value={{ query, sort, setQuery, setSort }}>
      {children}
    </SearchContext.Provider>
  );
}

// custom hook to use search context
export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
