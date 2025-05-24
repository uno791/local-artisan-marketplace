import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";
import Home from "../Pages/Home";
import { UserProvider } from "../Users/UserContext"; // adjust if needed
import { fireEvent } from "@testing-library/react";
import ProductPage from "../Pages/ProductPage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

test("renders Home page with products from API", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Mock Product",
        description: "Mock Description",
        price: 100,
        image_url: "http://example.com/product.jpg",
        username: "seller1",
      },
      {
        product_id: 2,
        product_name: "Second Product",
        description: "Another Description",
        price: 200,
        image_url: "http://example.com/product2.jpg",
        username: "seller2",
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText("Mock Product")).toBeInTheDocument();
  expect(screen.getByText("Second Product")).toBeInTheDocument();
  expect(screen.getByText("seller1")).toBeInTheDocument();
  expect(screen.getByText("R100")).toBeInTheDocument();
});

test("fetches and renders homepage AI recommended products", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/homepage-recommendations")) {
      return Promise.resolve({
        data: [
          {
            product_id: 101,
            product_name: "Recommended Bowl",
            price: 300,
            image_url: "https://example.com/bowl.jpg",
            username: "ceramic_smith",
          },
        ],
      });
    }

    return Promise.reject(new Error("Unhandled GET request: " + url));
  });

  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Home />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText("Recommended Bowl")).toBeInTheDocument();
});

test("handles product click tracking for main and minor tags", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Mock Product",
        description: "Mock Description",
        price: 100,
        image_url: "http://example.com/product.jpg",
        username: "seller1",
      },
    ],
  });

  // Mock both POST requests
  mockedAxios.post.mockResolvedValue({});

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  const productLink = await screen.findByText("Mock Product");
  productLink.click();

  await waitFor(() => {
    // Assert call to track-click-main
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/track-click-main"),
      expect.objectContaining({
        username: "testuser",
        productId: 1,
      })
    );

    // Assert call to track-click-minor
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/track-click-minor"),
      expect.objectContaining({
        username: "testuser",
        productId: 1,
      })
    );
  });
});

test("handles error when fetching products", async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText("Mock Product")).not.toBeInTheDocument();
    expect(screen.queryByText("Second Product")).not.toBeInTheDocument();
  });
});

test('renders "For you" heading on Home page', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 5,
        product_name: "Item A",
        description: "Nice thing",
        price: 150,
        image_url: "http://example.com/item.jpg",
        username: "artistA",
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText("For you")).toBeInTheDocument();
});

test("clicking a product navigates to ProductPage and displays details", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/homepage-recommendations")) {
      return Promise.resolve({
        data: [
          {
            product_id: 99,
            product_name: "ClickTest Product",
            description: "From Home page",
            price: 400,
            image_url: "http://example.com/clicked.jpg",
            username: "click_seller",
          },
        ],
      });
    }

    if (url.includes("/product/99")) {
      return Promise.resolve({
        data: {
          product_id: 99,
          product_name: "ClickTest Product",
          description: "From Home page",
          price: 400,
          stock_quantity: 3,
          image_url: "http://example.com/clicked.jpg",
          username: "click_seller",
          details: "Details here",
          category_name: "Art", // ✅ Correct field name for mainCategory
        },
      });
    }

    if (url.includes("/artisan/click_seller")) {
      return Promise.resolve({
        data: {
          username: "click_seller",
          shop_name: "Click Shop",
          shop_address: "123 Main",
          shop_pfp: "",
        },
      });
    }

    return Promise.reject(new Error("Unhandled GET request: " + url));
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  const product = await screen.findByText("ClickTest Product");

  await act(async () => {
    fireEvent.click(product);
  });

  expect(await screen.findByText("ClickTest Product")).toBeInTheDocument();
  expect(screen.getByText("From Home page")).toBeInTheDocument();
  expect(screen.getByText("click_seller")).toBeInTheDocument();
  expect(screen.getByText("R400")).toBeInTheDocument();
});
