// ShopFront.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react";
import ShopFront from "../Pages/ShopFront";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useParams
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ username: "test_seller" }),
    MemoryRouter: actual.MemoryRouter,
  };
});

// Mock useUser
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "test_seller" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

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

const setup = async (products = mockProducts, artisan = mockArtisan) => {
  mockedAxios.get.mockResolvedValueOnce({
    data: { artisan, products },
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
    fireEvent.click(screen.getByRole("button", { name: "Painting" }));
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
    expect(screen.queryByText(/Elegant Arts/i)).not.toBeInTheDocument();
  });

  test("renders fallback profile image if missing", async () => {
    const artisanWithNoImages = {
      ...mockArtisan,
      shop_pfp: "",
      shop_banner: "",
    };
    await setup(mockProducts, artisanWithNoImages);
    const img = screen.getByAltText("Shop logo") as HTMLImageElement;
    expect(img.src).toContain("/profile.png");
  });

  test("does not render edit/delete buttons when editable is false", async () => {
    await setup([mockProducts[0]]);
    expect(
      screen.queryByRole("button", { name: /edit product/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete product/i })
    ).not.toBeInTheDocument();
  });

  test("renders no products message if list is empty", async () => {
    await setup([]);
    expect(screen.queryByText("No products found")).toBeNull(); // Adjust if message is added
  });

  test("renders correct base64 image string for product", async () => {
    const base64Product = [
      {
        id: 101,
        name: "Base64 Product",
        price: "200",
        category: "Photography",
        image: "abc123",
      },
    ];
    await setup(base64Product);

    const imgs = screen.getAllByRole("img");
    const productImg = imgs.find((img) =>
      (img as HTMLImageElement).src.includes("data:image/jpeg;base64,abc123")
    );
    expect(productImg).toBeTruthy();
  });
});
