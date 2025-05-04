import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../Users/UserContext";
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
});

test("updates quantity when dropdown value changes", async () => {
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
});

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

test("displays error message if PUT request fails when updating quantity", async () => {
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
});

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

test("navigates to PaymentPage when Proceed to Payment button is clicked", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [], // Simulate empty cart
  });

  // This mock PaymentPage must return the exact heading you're checking for
  const PaymentPage = () => <h1>From Your Cart</h1>;

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Cart"]}>
          <Routes>
            <Route path="/Cart" element={<Cart />} />
            <Route path="/PaymentPage" element={<PaymentPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  const proceedButton = await screen.findByRole("button", {
    name: /proceed to payment/i,
  });

  await act(async () => {
    fireEvent.click(proceedButton);
  });

  //Use the heading that your mock PaymentPage actually renders
  expect(await screen.findByText("From Your Cart")).toBeInTheDocument();
});
