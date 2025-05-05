import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../Pages/SearchPage";
import { within } from "@testing-library/react";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";
import { waitFor, act } from "@testing-library/react";
import {
  SearchProvider,
  useSearch,
} from "../components/SearchPageComp1/SearchContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({ user: { username: "testuser" } }),
}));

function TestWrapper() {
  const { query } = useSearch();
  return <p data-testid="query">{query}</p>;
}

test("loads and displays main categories", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Paintings", "Jewelry"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: ["Oil", "Necklace"] });
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </UserProvider>
    );
  });

  expect(await screen.findByText("Paintings")).toBeInTheDocument();
  expect(screen.getByText("Jewelry")).toBeInTheDocument();
});

test("shows no categories if category fetch fails", async () => {
  mockedAxios.get.mockRejectedValue(new Error("Network error"));

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </UserProvider>
    );
  });

  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: /Paintings/i })
    ).not.toBeInTheDocument()
  );
});

test("logs an error if category or tag fetch fails", async () => {
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  mockedAxios.get.mockRejectedValue(new Error("Network error"));

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </UserProvider>
    );
  });

  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: /Paintings/i })
    ).not.toBeInTheDocument()
  );

  expect(consoleErrorSpy).toHaveBeenCalled();
  expect(
    consoleErrorSpy.mock.calls.some(
      (call) =>
        call[0].includes("Failed to load categories") ||
        call[0].includes("Failed to fetch tag lists")
    )
  ).toBe(true);

  consoleErrorSpy.mockRestore();
});

test("updates input value and triggers search on form submit", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Paintings", "Jewelry"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: ["Oil", "Necklace"] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  await act(async () => {
    render(
      <SearchProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </SearchProvider>
    );
  });

  const input = screen.getByPlaceholderText(
    /search by name, category or artisan/i
  );
  const form = screen.getByRole("search");

  fireEvent.change(input, { target: { value: "earrings" } });
  expect(input).toHaveValue("earrings");

  fireEvent.submit(form);

  await waitFor(() => {
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue("earrings");
  });
});

test("typing in search bar shows a matching category suggestion and clicking it fills the input", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Jewelry", "Paintings"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <SearchPage />
        </SearchProvider>
      </MemoryRouter>
    );
  });

  const input = screen.getByPlaceholderText(
    "Search by name, category or artisan…"
  );
  fireEvent.change(input, { target: { value: "je" } });

  // Only search for "Jewelry" in the suggestion list
  const suggestionList = await screen.findByRole("listbox");
  const suggestionButtons = within(suggestionList).getAllByRole("button");
  const jewelrySuggestion = suggestionButtons.find(
    (btn) => btn.textContent === "Jewelry"
  );
  expect(jewelrySuggestion).toBeTruthy();
  fireEvent.click(jewelrySuggestion!);

  expect((input as HTMLInputElement).value).toBe("Jewelry");
});

test("clicking a sidebar category fills the input search bar", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Jewelry", "Paintings"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <SearchPage />
        </SearchProvider>
      </MemoryRouter>
    );
  });

  const categoryButton = await screen.findByText("Jewelry");
  fireEvent.click(categoryButton);

  const input = screen.getByPlaceholderText(
    "Search by name, category or artisan…"
  );
  expect((input as HTMLInputElement).value).toBe("Jewelry");
});

test("sort buttons are rendered and clickable", async () => {
  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </UserProvider>
    );
  });

  const newBtn = screen.getByRole("button", { name: /new/i });
  const ascBtn = screen.getByRole("button", { name: /price ↑/i });
  const descBtn = screen.getByRole("button", { name: /price ↓/i });

  expect(newBtn).toBeInTheDocument();
  expect(ascBtn).toBeInTheDocument();
  expect(descBtn).toBeInTheDocument();

  fireEvent.click(newBtn);
  fireEvent.click(ascBtn);
  fireEvent.click(descBtn);
});

test("clicking a product card navigates to product detail page", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Clay Mug",
            price: 120,
            image_url: "https://example.com/mug.jpg",
            username: "crafty_joe",
          },
        ],
      });
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  render(
    <MemoryRouter initialEntries={["/SearchPage"]}>
      <SearchProvider>
        <SearchPage />
      </SearchProvider>
    </MemoryRouter>
  );

  const productCard = await screen.findByText("Clay Mug");
  const link = productCard.closest("a");

  expect(link).toHaveAttribute("href", "/Product/1");
});

test("clicking the search button submits the query", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Jewelry", "Art"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: ["Necklace", "Sculpture"] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  await act(async () => {
    render(
      <SearchProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </SearchProvider>
    );
  });

  const input = screen.getByPlaceholderText(
    /search by name, category or artisan/i
  );
  const searchButton = screen.getByRole("button", { name: /search/i });

  fireEvent.change(input, { target: { value: "Necklace" } });
  expect(input).toHaveValue("Necklace");

  fireEvent.click(searchButton);

  // After clicking search, input should still have value, and suggestion box should close
  await waitFor(() =>
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue("Necklace")
  );
});

test("pressing Enter in the search input submits the query", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  await act(async () => {
    render(
      <SearchProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <SearchPage />
        </MemoryRouter>
      </SearchProvider>
    );
  });

  const input = screen.getByPlaceholderText(/search by name/i);
  fireEvent.change(input, { target: { value: "scarf" } });

  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  await waitFor(() => {
    expect(input).toHaveValue("scarf");
  });
});
