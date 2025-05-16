import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react";
import axios from "axios";
import SellerStatsPage from "../Pages/SellerStatsPage";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useUser
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testSeller" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// Stub out ChartSelector so it doesn't trigger its own axios calls
jest.mock("../components/SellerStatsPageComp/ChartSelector", () => () => (
  <div>ChartSelector</div>
));

describe("SellerStatsPage", () => {
  beforeAll(() => {
    // Fix current month to March (index 2) for predictable monthlyRevenue
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(2);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Monthly Sales and Total Revenue with correct values", async () => {
    // Prepare a 12-month data array: [10,20,30,...,120]
    const salesArray = Array.from({ length: 12 }, (_, i) => (i + 1) * 10);
    const total = salesArray.reduce((sum, n) => sum + n, 0); // 780
    // Mock the initial GET for /seller-sales-trends
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: salesArray },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerStatsPage />
        </MemoryRouter>
      );
    });

    // Wait for state updates
    await waitFor(() => {
      // Section headings
      expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();

      // Formatted values: March => index 2 ⇒ 30
      expect(screen.getByText("R30")).toBeInTheDocument();
      // Total
      expect(
        screen.getByText(`R${total.toLocaleString()}`)
      ).toBeInTheDocument();

      // ChartSelector stub should render
      expect(screen.getByText("ChartSelector")).toBeInTheDocument();
    });
  });

  test("gracefully handles API failure and shows zeros", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    await act(async () => {
      render(
        <MemoryRouter>
          <SellerStatsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      // On failure, both should default to R0
      const zeros = screen.getAllByText("R0");
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });
});
