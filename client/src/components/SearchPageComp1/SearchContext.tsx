import React, { createContext, useContext, useState, ReactNode } from "react";

type SortKey = "new" | "priceAsc" | "priceDesc";

interface SearchContextType {
  query: string;
  sort: SortKey;
  setQuery: (q: string) => void;
  setSort: (s: SortKey) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  return (
    <SearchContext.Provider value={{ query, sort, setQuery, setSort }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
