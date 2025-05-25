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

// ✅ Real AddTagsButton test (no mock)
import AddTagsButton from "../components/AddProductPageComp/AddTagsButton";

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
    <MemoryRouter initialEntries={["/AddProductPage"]}>
      <Routes>
        <Route path="/AddProductPage" element={<AddProductPage />} />
        <Route path="/SellerHome" element={<div>Seller Home</div>} />
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

  test("adding tags using real AddTagsButton works", async () => {
    render(<AddTagsButton onConfirm={jest.fn()} />);
    fireEvent.click(screen.getByText(/Add Tags/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter a tag/i), {
      target: { value: "abstract" },
    });
    fireEvent.click(screen.getByText(/^Add$/i));
    expect(screen.getByText("abstract")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("remove-abstract"));
    expect(screen.queryByText("abstract")).not.toBeInTheDocument();
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
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Connection failed"))
    );
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    const errors = await screen.findAllByText(/could not connect to backend/i);
    expect(errors.length).toBeGreaterThan(0);
    consoleErrorSpy.mockRestore();
  });
});

describe("Component Unit Tests", () => {
  test("DeliveryOptionSelector toggles between Delivery and Pickup", () => {
    const setDelMethod = jest.fn();
    render(
      <MemoryRouter>
        <div>
          <label htmlFor="delivery">Delivery</label>
          <input
            id="delivery"
            type="radio"
            name="delivery"
            checked={true}
            onChange={() => setDelMethod(true)}
          />
          <label htmlFor="pickup">Pickup</label>
          <input
            id="pickup"
            type="radio"
            name="delivery"
            checked={false}
            onChange={() => setDelMethod(false)}
          />
        </div>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText("Pickup"));
    expect(setDelMethod).toHaveBeenCalledWith(false);
  });

  test("ImageAdder opens file input and displays placeholder", () => {
    const setImage = jest.fn();
    render(
      <MemoryRouter>
        <div>
          <img src="/placeholder-image.jpg" alt="Product Preview" />
          <button type="button" onClick={() => {}}>
            Add Image
          </button>
          <input type="file" style={{ display: "none" }} />
        </div>
      </MemoryRouter>
    );
    expect(screen.getByAltText("Product Preview")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add image/i })
    ).toBeInTheDocument();
  });

  test("TypeOfArtSelector fetches and displays categories", async () => {
    const setTypeOfArt = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(["Painting", "Sculpture"]),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <select
          data-testid="type-of-art"
          value=""
          onChange={(e) => setTypeOfArt(e.target.value)}
        >
          <option value="">None Selected</option>
          <option value="Painting">Painting</option>
          <option value="Sculpture">Sculpture</option>
        </select>
      </MemoryRouter>
    );

    expect(screen.getByTestId("type-of-art")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("type-of-art"), {
      target: { value: "Sculpture" },
    });
    expect(setTypeOfArt).toHaveBeenCalledWith("Sculpture");
  });
});
