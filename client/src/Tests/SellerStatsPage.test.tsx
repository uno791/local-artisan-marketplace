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

jest.mock("../components/SellerStatsPageComp/ChartSelector", () => () => (
  <div>ChartSelector</div>
));

describe("SellerStatsPage", () => {
  beforeAll(() => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(2);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Monthly Sales and Total Revenue with correct values", async () => {
    const salesArray = Array.from({ length: 12 }, (_, i) => (i + 1) * 10);
    const total = salesArray.reduce((sum, n) => sum + n, 0);

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

    await waitFor(() => {
      expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();

      expect(screen.getByText("R30")).toBeInTheDocument();

      expect(
        screen.getByText(`R${total.toLocaleString()}`)
      ).toBeInTheDocument();

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

      const zeros = screen.getAllByText("R0");
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });
});
