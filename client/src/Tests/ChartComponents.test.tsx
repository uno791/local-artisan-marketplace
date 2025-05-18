// ✅ MUST BE FIRST - prevent Chart.register error
jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  registerables: [],
}));

jest.mock("react-chartjs-2", () => ({
  Line: () => <div>SalesTrendsChart</div>,
  Bar: () => <div>InventoryStatusChart</div>,
  Pie: () => <div>TopProductsPieChart</div>,
}));

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import axios from "axios";

import StatsChart from "../components/SellerStatsPageComp/StatsChart";
import ChartSelector from "../components/SellerStatsPageComp/ChartSelector";

// ✅ Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ✅ Mock useUser
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testSeller" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Chart Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        months: [1, 2, 3],
        data: [1000, 1500, 2000],
        products: ["Item A", "Item B"],
        productNames: ["Product X", "Product Y"],
        unitsSold: [10, 20],
      },
    });
  });

  test("SalesTrendsChart renders mock content", async () => {
    await act(async () => {
      render(<ChartSelector />);
    });
    expect(screen.getByText("SalesTrendsChart")).toBeInTheDocument();
  });

  test("InventoryStatusChart renders mock content", async () => {
    await act(async () => {
      render(<ChartSelector />);
    });
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await act(async () => {
      select.value = "inventoryStatus";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(screen.getByText("InventoryStatusChart")).toBeInTheDocument();
  });

  test("TopProductsPieChart renders mock content", async () => {
    await act(async () => {
      render(<ChartSelector />);
    });
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await act(async () => {
      select.value = "topProducts";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(screen.getByText("TopProductsPieChart")).toBeInTheDocument();
  });

  test("StatsChart renders all months and Activity label", () => {
    render(<StatsChart />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
    [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ].forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });
});
