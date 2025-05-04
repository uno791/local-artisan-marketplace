import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
}

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
