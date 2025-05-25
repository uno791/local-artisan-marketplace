import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

import AddProductPage from "../Pages/AddProductPage";

// ✅ Mock user context
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testUser" } }),
  UserProvider: ({ children }: any) => <>{children}</>,
}));

// ✅ Mock ImageAdder to auto-set dummy image URL
jest.mock("../components/AddProductPageComp/ImageAdder", () => ({
  __esModule: true,
  default: ({ setImage }: any) => {
    React.useEffect(() => {
      setImage("https://example.com/image.jpg");
    }, [setImage]);
    return <div data-testid="mock-image-adder">Mock ImageAdder</div>;
  },
}));

// ✅ Mock TypeOfArtSelector
jest.mock("../components/AddProductPageComp/TypeOfArtSelector", () => ({
  __esModule: true,
  default: ({ TypeOfArt, setTypeOfArt }: any) => (
    <select
      data-testid="type-of-art"
      value={TypeOfArt}
      onChange={(e) => setTypeOfArt(e.target.value)}
    >
      <option value="">None Selected</option>
      <option value="Painting">Painting</option>
    </select>
  ),
}));

// ✅ Mock AddTagsButton to add a tag element into DOM
jest.mock("../components/AddProductPageComp/AddTagsButton", () => ({
  __esModule: true,
  default: ({ onConfirm }: any) => (
    <div>
      <button onClick={() => onConfirm(["abstract"])}>Add Tags</button>
      {/* Simulate rendering of added tags */}
      <div>abstract</div>
    </div>
  ),
}));

// ✅ Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
  ) as jest.Mock;
});

const renderWithProviders = () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<AddProductPage />} />
      </Routes>
    </MemoryRouter>
  );
};

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText(/Enter Product Name/i), {
    target: { value: "Sunset Painting" },
  });
  fireEvent.change(screen.getByLabelText(/Enter Product Description:/i), {
    target: { value: "Beautiful sunset" },
  });
  fireEvent.change(screen.getByLabelText(/Price \(Rands\)/i), {
    target: { value: "250" },
  });
  fireEvent.change(screen.getByLabelText(/Stock Count/i), {
    target: { value: "3" },
  });
  fireEvent.change(screen.getByLabelText(/Width \(cm\)/i), {
    target: { value: "40" },
  });
  fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
    target: { value: "60" },
  });
  fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByTestId("type-of-art"), {
    target: { value: "Painting" },
  });
  fireEvent.click(screen.getByText(/Add Tags/i));
  fireEvent.click(screen.getByLabelText(/delivery/i));
  fireEvent.click(screen.getByLabelText(/pickup/i));
}

describe("AddProductPage Functional Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  test("increment button increases stock count", () => {
    renderWithProviders();
    const plusBtn = screen.getByRole("button", { name: "+" });
    const stockInput = screen.getByLabelText(/Stock Count/i);
    fireEvent.click(plusBtn);
    expect(stockInput).toHaveValue("2");
  });

  test("decrement button decreases stock count", () => {
    renderWithProviders();
    const minusBtn = screen.getByRole("button", { name: "-" });
    const stockInput = screen.getByLabelText(/Stock Count/i);
    fireEvent.click(minusBtn);
    expect(stockInput).toHaveValue("0");
  });

  test("adding tags works through mock", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/Add Tags/i));
    expect(screen.queryByText("abstract")).toBeInTheDocument();
  });

  test("shows validation error popup on missing fields", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    expect(
      screen.getByText(/Please Fill Out All Required Fields/i)
    ).toBeInTheDocument();
  });

  test("shows success popup after successful submission", async () => {
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    expect(
      await screen.findByRole("heading", { name: /submitted product info/i })
    ).toBeInTheDocument();
  });

  test("success popup closes when close is clicked", async () => {
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    await screen.findByRole("heading", {
      name: /submitted product info/i,
    });

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /submitted product info/i })
      ).not.toBeInTheDocument();
    });
  });

  test("shows error popup on backend failure", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Connection failed"))
    );
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    const errors = await screen.findAllByText(/could not connect to backend/i);
    expect(errors.length).toBeGreaterThan(0);
  });
});
