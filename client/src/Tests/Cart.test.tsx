import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../Users/UserContext";
jest.mock("../utils/getYocoKey", () => ({
  getYocoKey: () => "test_public_key",
}));

import Cart from "../Pages/Cart";
import { act } from "react";
import axios from "axios";

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("removes item from cart when Remove button is clicked", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        price: 100,
        stock_quantity: 5,
        image_url: "https://via.placeholder.com/64",
        quantity: 1,
        username: "testuser",
      },
    ],
  });

  mockedAxios.delete.mockResolvedValueOnce({});

  render(
    <UserProvider>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  const removeButton = await screen.findByRole("button", { name: /remove/i });
  fireEvent.click(removeButton);

  await waitFor(() => {
    expect(mockedAxios.delete).toHaveBeenCalled();
  });
});

/*test("removes item from cart when Remove button is clicked", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        quantity: 1,
        price: 100,
        image_url: "https://via.placeholder.com/64",
        seller_username: "seller",
        added_at: "2023-01-01",
        stock_quantity: 10,
      },
    ],
  });

  mockedAxios.delete.mockResolvedValueOnce({ status: 200 });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText(/Test Product/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /remove/i }));

  await waitFor(() =>
    expect(screen.queryByText(/Test Product/i)).not.toBeInTheDocument()
  );

  expect(mockedAxios.delete).toHaveBeenCalledWith(
    "http://localhost:3000/rem-cart-item",
    { data: { username: "testuser", product_id: 1 } }
  );
});*/

/*test("updates quantity when dropdown value changes", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        price: 100,
        stock_quantity: 5,
        image_url: "https://via.placeholder.com/64",
        quantity: 2,
        username: "testuser",
      },
    ],
  });

  mockedAxios.put.mockResolvedValueOnce({});

  render(
    <UserProvider>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  // Wait for dropdown to be ready
  const dropdown = await screen.findByRole("combobox");

  // Wait until options are populated
  await waitFor(() => {
    expect(dropdown.querySelectorAll("option").length).toBeGreaterThan(0);
  });

  // Check default value is 2 (initial quantity)
  expect(dropdown).toHaveValue("2");

  // Simulate user selecting new quantity
  fireEvent.change(dropdown, { target: { value: "3" } });

  await waitFor(() => {
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining("/cart/update-quantity"),
      expect.objectContaining({ productId: 1, quantity: 3 })
    );
  });
});*/
/*test("updates quantity when dropdown value changes", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        price: 100,
        stock_quantity: 5,
        image_url: "https://via.placeholder.com/64",
        quantity: 2,
        username: "testuser",
      },
    ],
  });

  mockedAxios.put.mockResolvedValueOnce({});

  render(
    <UserProvider>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  const dropdown = await screen.findByRole("combobox");
  expect(dropdown).toHaveValue("2");

  fireEvent.change(dropdown, { target: { value: "3" } });

  await waitFor(() => {
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining("/cart/update-quantity"),
      expect.objectContaining({ productId: 1, quantity: 3 })
    );
  });
});*/
/*test("updates quantity when dropdown value changes", async () => {
  const fakeCart = [
    {
      product_id: 1,
      product_name: "Test Product",
      price: 50,
      quantity: 2,
      added_at: "2024-01-01",
      image_url: "",
      stock_quantity: 10,
      seller_username: "seller1",
    },
  ];

  mockedAxios.get.mockResolvedValueOnce({ data: fakeCart });
  mockedAxios.put.mockResolvedValueOnce({
    data: { message: "Quantity updated successfully." },
  });

  const handleTotalChange = jest.fn();

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Cart"]}>
          <Cart />
        </MemoryRouter>
      </UserProvider>
    );
  });

  const dropdown = screen.getByRole("combobox");
  expect(dropdown).toHaveValue("2");

  fireEvent.change(dropdown, { target: { value: "3" } });

  expect(mockedAxios.put).toHaveBeenCalledWith(
    expect.stringContaining("/upd-cart-item"),
    {
      username: "testuser",
      product_id: 1,
      quantity: 3,
    }
  );
});*/

test("displays error message if cart GET request fails", async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  await waitFor(() =>
    expect(screen.getByText("Failed to load cart.")).toBeInTheDocument()
  );
});

test("displays error message if DELETE request fails when removing item", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        quantity: 1,
        price: 100,
        image_url: "https://via.placeholder.com/64",
        seller_username: "seller",
        added_at: "2023-01-01",
        stock_quantity: 10,
      },
    ],
  });

  mockedAxios.delete.mockRejectedValueOnce(new Error("Delete failed"));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText(/Test Product/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /remove/i }));

  await waitFor(() =>
    expect(screen.getByText("Failed to remove item.")).toBeInTheDocument()
  );
});

/*test("displays error message if PUT request fails when updating quantity", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        quantity: 1,
        price: 100,
        image_url: "https://via.placeholder.com/64",
        seller_username: "seller",
        added_at: "2023-01-01",
        stock_quantity: 10,
      },
    ],
  });

  mockedAxios.put.mockRejectedValueOnce(new Error("Update failed"));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText(/Test Product/i)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });

  await waitFor(() =>
    expect(
      screen.getByText("Failed to update item quantity.")
    ).toBeInTheDocument()
  );
});*/

test("renders correct subtotal based on price and quantity", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Subtotal Test Product",
        quantity: 2,
        price: 100,
        image_url: "https://via.placeholder.com/64",
        seller_username: "seller",
        added_at: "2023-01-01",
        stock_quantity: 10,
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText("Subtotal Test Product")).toBeInTheDocument();

  // Match subtotal flexibly across multiple text nodes
  expect(
    screen.getByText(
      (content, element) =>
        element?.textContent?.replace(/\s+/g, "") === "Sub-Total:R200.00"
    )
  ).toBeInTheDocument();
});

test("initiates Yoco payment and sends token to backend", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [],
  });

  // Mock window.YocoSDK and the showPopup method
  const mockShowPopup = jest.fn();

  (window as any).YocoSDK = jest.fn().mockImplementation(() => ({
    showPopup: mockShowPopup,
  }));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  // Click the payment button
  const proceedButton = await screen.findByRole("button", {
    name: /pay/i,
  });

  fireEvent.click(proceedButton);

  expect(mockShowPopup).toHaveBeenCalled();

  // Extract and call the callback manually to simulate successful token
  const popupArgs = mockShowPopup.mock.calls[0][0];
  expect(popupArgs.amountInCents).toBeDefined();
  expect(typeof popupArgs.callback).toBe("function");

  // Mock successful token callback
  mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

  await act(async () => {
    await popupArgs.callback({ id: "mock-token-id" });
  });

  expect(mockedAxios.post).toHaveBeenCalledWith(
    expect.stringContaining("/checkout"),
    expect.objectContaining({
      username: "testuser",
      token: "mock-token-id",
    })
  );
});

test("renders 'You May Also Like' section with recommendations when available", async () => {
  mockedAxios.get.mockImplementation((url) => {
    // 1. Mock /cart/:username
    if (url.includes("/cart/")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Cart Item",
            price: 100,
            quantity: 1,
            added_at: "2024-01-01",
            image_url: "https://via.placeholder.com/64",
            stock_quantity: 10,
            seller_username: "seller",
          },
        ],
      });
    }

    // 2. Mock /product/:id
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Cart Item",
          category_name: "Paintings",
          tags: ["Abstract", "Colorful"],
        },
      });
    }

    return Promise.resolve({ data: [] });
  });

  // 3. Mock /recommend-by-tags
  mockedAxios.post.mockImplementation((url) => {
    if (url.includes("/recommend-by-tags")) {
      return Promise.resolve({
        data: [
          {
            product_id: 101,
            product_name: "Recommended A",
            price: 200,
            image_url: "https://via.placeholder.com/64",
            username: "artist1",
          },
          {
            product_id: 102,
            product_name: "Recommended B",
            price: 150,
            image_url: "https://via.placeholder.com/64",
            username: "artist2",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  // Check heading and recommended products appear
  expect(await screen.findByText(/You May Also Like/i)).toBeInTheDocument();
  expect(await screen.findByText(/Recommended A/i)).toBeInTheDocument();
  expect(await screen.findByText(/Recommended B/i)).toBeInTheDocument();
});

test("'You May Also Like' is hidden when no recommendations are returned", async () => {
  mockedAxios.get.mockImplementation((url) => {
    // Cart returns 1 item
    if (url.includes("/cart/")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Cart Item",
            price: 100,
            quantity: 1,
            added_at: "2024-01-01",
            image_url: "https://via.placeholder.com/64",
            stock_quantity: 10,
            seller_username: "seller",
          },
        ],
      });
    }

    // Product returns tags and category
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Cart Item",
          category_name: "Paintings",
          tags: ["Abstract", "Colorful"],
        },
      });
    }

    return Promise.resolve({ data: [] });
  });

  // Recommend-by-tags returns empty
  mockedAxios.post.mockImplementation((url) => {
    if (url.includes("/recommend-by-tags")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: [] });
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  // Confirm section heading and any recommendations are NOT in the DOM
  await waitFor(() => {
    expect(screen.queryByText(/You May Also Like/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recommended/i)).not.toBeInTheDocument();
  });
});

test("'You May Also Like' does not render if recommendation fetch fails", async () => {
  mockedAxios.get.mockImplementation((url) => {
    // Cart returns 1 item
    if (url.includes("/cart/")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Cart Item",
            price: 100,
            quantity: 1,
            added_at: "2024-01-01",
            image_url: "https://via.placeholder.com/64",
            stock_quantity: 10,
            seller_username: "seller",
          },
        ],
      });
    }

    // Simulate failure on product details fetch
    if (url.includes("/product/1")) {
      return Promise.reject(new Error("Failed to load product"));
    }

    return Promise.resolve({ data: [] });
  });

  // /recommend-by-tags not reached, but mock just in case
  mockedAxios.post.mockResolvedValue({ data: [] });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Cart"]}>
        <Cart />
      </MemoryRouter>
    </UserProvider>
  );

  // ✅ Ensure 'You May Also Like' does not appear
  await waitFor(() => {
    expect(screen.queryByText(/You May Also Like/i)).not.toBeInTheDocument();
  });

  // ✅ Ensure Cart Item still renders without crashing
  const matches = await screen.findAllByText(/Cart Item/i);
  expect(matches.length).toBeGreaterThan(0);
});

import RecommendationScroller from "../components/CartPageComp/RecommendationScroller";
import ProductCard from "../components/SearchPageComp1/ProductCard"; // ensure this works

test("RecommendationScroller renders all products passed as props", () => {
  const sampleProducts = [
    {
      product_id: 101,
      product_name: "Scroll Product A",
      price: 120,
      image_url: "https://via.placeholder.com/64",
      username: "artistA",
    },
    {
      product_id: 102,
      product_name: "Scroll Product B",
      price: 80,
      image_url: "https://via.placeholder.com/64",
      username: "artistB",
    },
  ];

  render(
    <MemoryRouter>
      <RecommendationScroller products={sampleProducts} />
    </MemoryRouter>
  );

  // Both product names should appear
  expect(screen.getByText("Scroll Product A")).toBeInTheDocument();
  expect(screen.getByText("Scroll Product B")).toBeInTheDocument();
});

test("clicking a recommended product navigates to ProductPage", async () => {
  const sampleProducts = [
    {
      product_id: 200,
      product_name: "ClickTest Product",
      price: 400,
      image_url: "http://example.com/clicked.jpg",
      username: "click_seller",
    },
  ];

  render(
    <MemoryRouter initialEntries={["/Cart"]}>
      <Routes>
        <Route
          path="/Cart"
          element={<RecommendationScroller products={sampleProducts} />}
        />
        <Route
          path="/product/:id"
          element={
            <main>
              <h1>Mock ProductPage for testing</h1>
            </main>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  const product = await screen.findByText(/ClickTest Product/i);
  fireEvent.click(product);

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: /Mock ProductPage/i })
    ).toBeInTheDocument();
  });
});
