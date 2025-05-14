import { render, screen, waitFor } from "@testing-library/react";
import BuyerOrders from "../Pages/BuyerOrders";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

describe("BuyerOrders component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders current and previous orders correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          image_url: "https://via.placeholder.com/64",
          product_name: "Test Product 1",
          price: 100,
          quantity: 2,
          status: "Pending",
          created_at: "2024-04-01T10:00:00",
        },
        {
          image_url: "https://via.placeholder.com/64",
          product_name: "Test Product 2",
          price: 150,
          quantity: 1,
          status: "Delivered",
          created_at: "2024-03-15T14:30:00",
        },
      ],
    });

    render(
      <UserProvider>
        <MemoryRouter>
          <BuyerOrders />
        </MemoryRouter>
      </UserProvider>
    );

    expect(await screen.findByText("Current Orders")).toBeInTheDocument();
    expect(await screen.findByText("Previous Orders")).toBeInTheDocument();

    expect(await screen.findByText("Test Product 1")).toBeInTheDocument(); // Current
    expect(await screen.findByText("Test Product 2")).toBeInTheDocument(); // Previous
  });

  test("shows error message if API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    render(
      <UserProvider>
        <MemoryRouter>
          <BuyerOrders />
        </MemoryRouter>
      </UserProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Failed to load orders.")).toBeInTheDocument()
    );
  });

  test("displays fallback when there are no orders", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(
      <UserProvider>
        <MemoryRouter>
          <BuyerOrders />
        </MemoryRouter>
      </UserProvider>
    );

    expect(await screen.findByText("No current orders.")).toBeInTheDocument();
    expect(await screen.findByText("No previous orders.")).toBeInTheDocument();
  });
});
