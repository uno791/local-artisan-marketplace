import React, { act } from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import EditProductPage from "../Pages/EditProductPage";
import { UserProvider } from "../Users/UserContext";

jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testUser" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

const defaultFetch = (url: RequestInfo, options?: RequestInit) => {
  if (url === "http://localhost:3000/product/123") {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          product_name: "Original",
          details: "Original description",
          price: 100,
          stock_quantity: 1,
          width: 10,
          height: 10,
          weight: 1,
          category_name: "Art",
          tags: ["bold"],
          product_image: "",
        }),
    });
  }

  if (
    url === "http://localhost:3000/editproduct/123" &&
    options?.method === "PUT"
  ) {
    return Promise.resolve({ ok: true });
  }

  if (url === "http://localhost:3000/main-categories") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(["Art", "Photography", "Sculpture"]),
    });
  }

  return Promise.reject(new Error(`Unhandled fetch call to ${url}`));
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn(defaultFetch) as jest.Mock;
});

const renderWithProviders = async () => {
  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/edit/123"]}>
          <Routes>
            <Route path="/edit/:id" element={<EditProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  await screen.findByLabelText(/Edit Product Name:/i);
};

function fillEditForm() {
  fireEvent.change(screen.getByLabelText(/Edit Product Name:/i), {
    target: { value: "Updated Painting" },
  });
  fireEvent.change(screen.getByLabelText(/Edit Product Description:/i), {
    target: { value: "Updated description" },
  });
  fireEvent.change(screen.getByLabelText(/^Price \(Rands\):$/i), {
    target: { value: "500" },
  });
  fireEvent.change(screen.getByLabelText(/^Stock Count$/i), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText(/^Width \(cm\):$/i), {
    target: { value: "80" },
  });
  fireEvent.change(screen.getByLabelText(/^Height \(cm\):$/i), {
    target: { value: "100" },
  });
  fireEvent.change(screen.getByLabelText(/^Weight \(kg\):$/i), {
    target: { value: "10" },
  });
  fireEvent.change(screen.getByLabelText(/^Type of Art:$/i), {
    target: { value: "Photography" },
  });

  const delivery = screen.getByLabelText(/Delivery/i) as HTMLInputElement;
  if (!delivery.checked) fireEvent.click(delivery);
}

// ───────────────────────────────────────────────
// ✅ TEST SUITE
// ───────────────────────────────────────────────

describe("EditProductPage Functional Tests", () => {
  test("stock increment (+) increases quantity", async () => {
    await renderWithProviders();
    const plusBtn = screen.getByRole("button", { name: "Increase stock" });
    const stockInput = screen.getByLabelText(
      /Stock Count/i
    ) as HTMLInputElement;
    fireEvent.click(plusBtn);
    expect(stockInput.value).toBe("2");
  });

  test("stock decrement (-) decreases quantity", async () => {
    await renderWithProviders();
    const minusBtn = screen.getByRole("button", { name: "Decrease stock" });
    const stockInput = screen.getByLabelText(
      /Stock Count/i
    ) as HTMLInputElement;
    fireEvent.click(minusBtn);
    expect(stockInput.value).toBe("0");
  });

  test("edit tags pop-up opens", async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /edit tags/i }));
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  test("adding tag shows it in list", async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /edit tags/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), {
      target: { value: "vintage" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
    expect(screen.getByText("vintage")).toBeInTheDocument();
  });

  test("remove button removes tag", async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /edit tags/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), {
      target: { value: "minimal" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
    expect(screen.getByText("minimal")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("remove-minimal"));
    expect(screen.queryByText("minimal")).not.toBeInTheDocument();
  });

  test("confirm tag closes pop-up", async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /edit tags/i }));
    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("valid form submits update and shows success popup", async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole("button", { name: /confirm edits/i }));
    expect(
      await screen.findByText(/Updated Product Info/i)
    ).toBeInTheDocument();
  });

  test("close button on success popup works", async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole("button", { name: /confirm edits/i }));
    const closeBtn = await screen.findByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(
        screen.queryByText(/Updated Product Info/i)
      ).not.toBeInTheDocument();
    });
  });

  test("missing fields show warning popup", async () => {
    await renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Edit Product Name:/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /confirm edits/i }));
    expect(
      screen.getByText(/Please Fill Out All Required Fields/i)
    ).toBeInTheDocument();
  });

  test("price input rejects numbers above 10 billion", async () => {
    await renderWithProviders();
    const input = screen.getByLabelText(/^Price \(Rands\):$/i);
    fireEvent.change(input, { target: { value: "10000000001" } });
    expect(await screen.findByText(/Max R10,000,000,000/i)).toBeInTheDocument();
  });

  test("delivery method toggles update correctly", async () => {
    await renderWithProviders();
    const [deliveryCheckbox, pickupCheckbox] = screen.getAllByRole("checkbox");
    fireEvent.click(deliveryCheckbox);
    expect(deliveryCheckbox).not.toBeChecked();
    fireEvent.click(pickupCheckbox);
    expect(pickupCheckbox).toBeChecked();
  });

  test('shows "No Changes Made" popup when no edits are done', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /confirm edits/i }));
    expect(await screen.findByText(/No Changes Made/i)).toBeInTheDocument();
  });

  test("displays error message when product fetch fails", async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("/product/")) {
        return Promise.reject(new Error("Network error"));
      }
      if (url === "http://localhost:3000/main-categories") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(["Art"]),
        });
      }
      return defaultFetch(url);
    });

    await act(async () => {
      render(
        <UserProvider>
          <MemoryRouter initialEntries={["/edit/123"]}>
            <Routes>
              <Route path="/edit/:id" element={<EditProductPage />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      );
    });

    expect(
      await screen.findByText((text) =>
        text.includes("Failed to load product details")
      )
    ).toBeInTheDocument();
  });

  test("displays error message when update fails", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes("/editproduct/") && options?.method === "PUT") {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Update failed" }),
        });
      }

      return defaultFetch(url, options);
    });

    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole("button", { name: /confirm edits/i }));
    expect(await screen.findByText(/Update failed/i)).toBeInTheDocument();
  });
});
