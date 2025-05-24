// ShopFront.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react";
import ShopFront from "../Pages/ShopFront";
import axios from "axios";

// ✅ Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ✅ Mock useParams
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ username: "test_seller" }),
    MemoryRouter: actual.MemoryRouter,
  };
});

// ✅ Mock useUser + provider
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "test_seller" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// ✅ Dummy data
const mockArtisan = {
  shop_name: "Elegant Arts",
  bio: "Curated artisan goods.",
  shop_pfp: "pfp-base64",
  shop_address: "42 Artisan Blvd",
  shop_banner: "banner-base64",
};

const mockProducts = [
  {
    id: 1,
    name: "Woven Basket",
    price: "100",
    category: "Textiles",
    image: "base64image1",
  },
  {
    id: 2,
    name: "Painted Vase",
    price: "150",
    category: "Painting",
    image: "base64image2",
  },
];

const setup = async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      artisan: mockArtisan,
      products: mockProducts,
    },
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <ShopFront />
      </MemoryRouter>
    );
  });
};

describe("ShopFront Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders artisan header with public view info", async () => {
    await setup();
    expect(screen.getByText("Elegant Arts")).toBeInTheDocument();
    expect(screen.getByText("Curated artisan goods.")).toBeInTheDocument();
    expect(screen.getByText("42 Artisan Blvd")).toBeInTheDocument();
  });

  test("renders filter bar buttons based on categories", async () => {
    await setup();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Textiles" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Painting" })
    ).toBeInTheDocument();
  });

  test("displays all products initially", async () => {
    await setup();
    expect(screen.getByText("Woven Basket")).toBeInTheDocument();
    expect(screen.getByText("Painted Vase")).toBeInTheDocument();
  });

  test("filters products when category is selected", async () => {
    await setup();
    const paintingBtn = screen.getByRole("button", { name: "Painting" });
    fireEvent.click(paintingBtn);
    await waitFor(() => {
      expect(screen.getByText("Painted Vase")).toBeInTheDocument();
      expect(screen.queryByText("Woven Basket")).not.toBeInTheDocument();
    });
  });

  test("handles API failure gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    await act(async () => {
      render(
        <MemoryRouter>
          <ShopFront />
        </MemoryRouter>
      );
    });

    // Just ensure nothing crashes
    expect(screen.queryByText(/Elegant Arts/i)).not.toBeInTheDocument();
  });
});
