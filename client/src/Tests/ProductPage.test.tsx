import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductPage from "../Pages/ProductPage";
import Home from "../Pages/Home";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";
import { act } from "react";

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

//Mock axios and the API call
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Home button navigates to the Home page", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 100,
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    if (url.includes("/allproducts")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Mock Product",
            description: "A great product",
            price: 100,
            image_url: "http://example.com/product.jpg",
            username: "seller123",
          },
        ],
      });
    }

    if (url.includes("/homepage-recommendations")) {
      return Promise.resolve({
        data: [],
      });
    }

    return Promise.reject(new Error("Unhandled axios request: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Product/1"]}>
          <Routes>
            <Route path="/Product/:id" element={<ProductPage />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  // Verify product detail is shown
  expect(await screen.findByText("Mock Product")).toBeInTheDocument();

  // Click the home button (BackButton)
  const homeButton = screen.getByRole("button", { name: "" }); // No name attribute, just grab the only button
  fireEvent.click(homeButton);

  // Verify that we navigated to Home and see the product list
  expect(await screen.findByText("For you")).toBeInTheDocument();
});

test("displays product details correctly", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 100,
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
          width: 30,
          height: 40,
          weight: 500,
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    if (url.includes("/allproducts")) {
      return Promise.resolve({ data: [] });
    }

    return Promise.reject(new Error("Unhandled axios request: " + url));
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Product/1"]}>
        <Routes>
          <Route path="/Product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  // Wait for product data to be shown
  expect(await screen.findByText("Mock Product")).toBeInTheDocument();
  expect(screen.getByText("R100")).toBeInTheDocument();
  expect(screen.getByText("A great product")).toBeInTheDocument();
  expect(screen.getByText("Width:")).toBeInTheDocument();
  expect(screen.getByText(/30 cm/)).toBeInTheDocument();
  expect(screen.getByText(/40 cm/)).toBeInTheDocument();
  expect(screen.getByText(/500 kg|500 g/)).toBeInTheDocument(); // depends on units
});

test("successfully adds product to cart", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 5,
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    return Promise.reject(new Error("Unhandled GET: " + url));
  });

  mockedAxios.post.mockImplementation((url, body) => {
    if (url.includes("/add-to-cart")) {
      return Promise.resolve({
        data: {
          message: "Item added to cart",
        },
      });
    }
    return Promise.reject(new Error("Unhandled POST: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Product/1"]}>
          <Routes>
            <Route path="/Product/:id" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  const button = await screen.findByRole("button", { name: /add to cart/i });
  fireEvent.click(button);

  const successMessage = await screen.findByText(/item added to cart/i);
  expect(successMessage).toBeInTheDocument();
});

test("shows error if product is out of stock", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 0, // Out of stock
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    return Promise.reject(new Error("Unhandled GET: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Product/1"]}>
          <Routes>
            <Route path="/Product/:id" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  const button = await screen.findByRole("button", { name: /add to cart/i });
  fireEvent.click(button);

  const errorMessage = await screen.findByText(/out of stock/i);
  expect(errorMessage).toBeInTheDocument();
});

test("shows success message when cart quantity is incremented", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 10,
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    return Promise.reject(new Error("Unhandled GET: " + url));
  });

  mockedAxios.post.mockImplementation((url) => {
    if (url.includes("/add-to-cart")) {
      return Promise.resolve({
        data: {
          message: "Cart updated: quantity increased by 1",
        },
      });
    }

    return Promise.reject(new Error("Unhandled POST: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Product/1"]}>
          <Routes>
            <Route path="/Product/:id" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  const button = await screen.findByRole("button", { name: /add to cart/i });
  fireEvent.click(button);

  const message = await screen.findByText(/quantity increased by 1/i);
  expect(message).toBeInTheDocument();
});
test("shows error message when cart quantity cannot be incremented", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/product/1")) {
      return Promise.resolve({
        data: {
          product_id: 1,
          product_name: "Mock Product",
          description: "A great product",
          price: 100,
          stock_quantity: 0, // Out of stock
          image_url: "http://example.com/product.jpg",
          username: "seller123",
          details: "Handmade from local materials",
          category_name: "Paintings",
          tags: ["Abstract", "Canvas"],
        },
      });
    }

    if (url.includes("/artisan/seller123")) {
      return Promise.resolve({
        data: {
          shop_name: "Art by Seller",
          bio: "We love handmade items",
          shop_address: "123 Main St",
          shop_pfp: "http://example.com/profile.jpg",
        },
      });
    }

    return Promise.reject(new Error("Unhandled GET: " + url));
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={["/Product/1"]}>
          <Routes>
            <Route path="/Product/:id" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });

  const button = await screen.findByRole("button", { name: /add to cart/i });
  fireEvent.click(button);

  const errorMessage = await screen.findByText(/out of stock/i);
  expect(errorMessage).toBeInTheDocument();
});
