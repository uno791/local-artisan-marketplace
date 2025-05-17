import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react";
import SellerOrdersPage from "../Pages/SellerOrdersPage";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useUser
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testSeller" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// Sample orders
const mockOrders = [
  {
    order_id: 1,
    product_id: 10,
    product_name: "Wooden Bowl",
    price: "200.00",
    quantity: 2,
    status: "Payment Received",
    created_at: "2024-12-10T12:34:56Z",
  },
  {
    order_id: 2,
    product_id: 11,
    product_name: "Handmade Vase",
    price: "350.00",
    quantity: 1,
    status: "Delivered",
    created_at: "2024-12-01T08:22:00Z",
  },
];

describe("SellerOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders current and previous orders correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrders });

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerOrdersPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Current Orders")).toBeInTheDocument();
    expect(screen.getByText("Previous Orders")).toBeInTheDocument();

    expect(screen.getByText("Wooden Bowl - R200.00")).toBeInTheDocument();
    expect(screen.getByText("Handmade Vase - R350.00")).toBeInTheDocument();
  });

  test("status dropdown works and triggers confirmation modal", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrders });
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerOrdersPage />
        </MemoryRouter>
      );
    });

    // Find the first dropdown with "Payment Received"
    const dropdown = screen.getByDisplayValue("Payment Received");
    fireEvent.change(dropdown, { target: { value: "Shipped" } });

    // Wait for modal to appear
    const modal = await screen.findByRole("dialog");

    // Now assert safely within the modal only
    const modalUtils = within(modal);
    expect(
      modalUtils.getByText(/are you sure you want to change status to/i)
    ).toBeInTheDocument();
    expect(modalUtils.getByText("Shipped")).toBeInTheDocument();
    expect(
      modalUtils.getByRole("button", { name: "Confirm" })
    ).toBeInTheDocument();
    expect(
      modalUtils.getByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });

  test("confirms status update and updates UI", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrders });
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerOrdersPage />
        </MemoryRouter>
      );
    });

    const dropdown = screen.getByDisplayValue("Payment Received");
    fireEvent.change(dropdown, { target: { value: "Shipped" } });

    await waitFor(() =>
      expect(
        screen.getByText(/are you sure you want to change status to/i)
      ).toBeInTheDocument()
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByDisplayValue("Shipped")).toBeInTheDocument()
    );
  });

  test("handles API failure gracefully on fetch", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerOrdersPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Current Orders")).toBeInTheDocument();
    expect(screen.getByText("Previous Orders")).toBeInTheDocument();
  });

  test('shows "No current orders" or "No previous orders" when lists are empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          ...mockOrders[0],
          status: "Delivered",
        },
      ],
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerOrdersPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("No current orders.")).toBeInTheDocument();
    expect(screen.getByText("Previous Orders")).toBeInTheDocument();
  });
});
