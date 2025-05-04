import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../Pages/SearchPage";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";
import { waitFor } from "@testing-library/react";
import {
  SearchProvider,
  useSearch,
} from "../components/SearchPageComp1/SearchContext";
import { act } from "react";

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
      return Promise.resolve({ data: ["Oil", "Necklace"] }); // fetched but not rendered
    }
    return Promise.reject(new Error("Unhandled request: " + url));
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/SearchPage"]}>
        <SearchPage />
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText("Paintings")).toBeInTheDocument();
  expect(screen.getByText("Jewelry")).toBeInTheDocument();
});

test("shows no categories if category fetch fails", async () => {
  mockedAxios.get.mockRejectedValue(new Error("Network error"));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/SearchPage"]}>
        <SearchPage />
      </MemoryRouter>
    </UserProvider>
  );

  // Wait to ensure fetch completes
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

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/SearchPage"]}>
        <SearchPage />
      </MemoryRouter>
    </UserProvider>
  );

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: /Paintings/i })
    ).not.toBeInTheDocument();
  });

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
  mockedAxios.get.mockResolvedValue({ data: [] });

  await act(async () => {
    render(
      <SearchProvider>
        <MemoryRouter initialEntries={["/SearchPage"]}>
          <>
            <SearchPage />
            <TestWrapper />
          </>
        </MemoryRouter>
      </SearchProvider>
    );
  });

  const input = screen.getByPlaceholderText(/search/i);
  const form = screen.getByRole("search");

  // Simulate typing in the input
  fireEvent.change(input, { target: { value: "earrings" } });
  expect(input).toHaveValue("earrings");

  // Submit the form
  fireEvent.submit(form);

  // Verify query in context updated
  expect(screen.getByTestId("query").textContent).toBe("earrings");
});

test("typing in search bar shows a matching category suggestion and clicking it fills the input", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/main-categories")) {
      return Promise.resolve({ data: ["Jewelry", "Paintings"] });
    }
    if (url.includes("/minor-categories")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });

  render(
    <MemoryRouter>
      <SearchProvider>
        <SearchPage />
      </SearchProvider>
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Search");
  fireEvent.change(input, { target: { value: "je" } });

  const suggestion = await screen.findByText("Jewelry");
  fireEvent.click(suggestion);

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
    return Promise.reject(new Error("Unknown endpoint"));
  });

  render(
    <MemoryRouter>
      <SearchProvider>
        <SearchPage />
      </SearchProvider>
    </MemoryRouter>
  );

  // Wait for the sidebar category to load
  const categoryButton = await screen.findByText("Jewelry");
  fireEvent.click(categoryButton);

  // After clicking, the input should reflect the query
  const input = screen.getByPlaceholderText("Search");
  expect((input as HTMLInputElement).value).toBe("Jewelry");
});

test("sort buttons are rendered and clickable", () => {
  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/SearchPage"]}>
        <SearchPage />
      </MemoryRouter>
    </UserProvider>
  );

  const newBtn = screen.getByRole("button", { name: /new/i });
  const ascBtn = screen.getByRole("button", { name: /price ascending/i });
  const descBtn = screen.getByRole("button", { name: /price descending/i });

  // Ensure they are in the document
  expect(newBtn).toBeInTheDocument();
  expect(ascBtn).toBeInTheDocument();
  expect(descBtn).toBeInTheDocument();

  // Click them to cover any render-triggered event paths (even if empty)
  fireEvent.click(newBtn);
  fireEvent.click(ascBtn);
  fireEvent.click(descBtn);
});
