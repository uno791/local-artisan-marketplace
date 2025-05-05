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

    return Promise.reject(new Error("Unhandled axios request: " + url));
  });

  /*mockedAxios.get.mockResolvedValueOnce({
    data: {
      product_id: 1,
      product_name: "Mock Product",
      description: "A great product",
      price: 100,
      stock_quantity: 100,
      image_url: "http://example.com/product.jpg",
      username: "seller123",
      details: "Handmade from local materials",
    },
  });*/

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

  console.log("ProductPage mock GET called with:", mockedAxios.get.mock.calls);
  expect(mockedAxios.get).toHaveBeenCalledWith(
    "http://localhost:3000/product/1"
  );

  // Wait for the product to load
  expect(await screen.findByText("Mock Product")).toBeInTheDocument();

  const homeButton = screen.getByRole("button", { name: /home/i });
  fireEvent.click(homeButton);

  expect(await screen.findByText("All Products")).toBeInTheDocument();
});

/*import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductPage from "../Pages/ProductPage";
import Home from "../Pages/Home";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValueOnce({
    data: {
      product_id: 1,
      product_name: "Mock Product",
      description: "A great product",
      price: 100,
      stock_quantity: 10,
      image_url: "http://example.com/product.jpg",
      username: "seller123",
      details: "Handmade from local materials",
    },
  });

test("Home button navigates to the Home page", () => {
  render(
    <MemoryRouter initialEntries={["/Product/1"]}>
      <Routes>
        <Route path="/Product/:id" element={<ProductPage />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );

  const homeButton = screen.getByRole("button", { name: /home/i });
  fireEvent.click(homeButton);

  expect(screen.getByText("All Products")).toBeInTheDocument();
});*/

/*import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import ProductPage from "../Pages/ProductPage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductPage", () => {
    const mockProduct = {
        product_id: 1,
        product_name: "Test Product",
        description: "This is a test product.",
        price: 100,
        stock_quantity: 10,
        image_url: "test-image-url",
        username: "testuser",
        details: "Test details",
    };

    it("renders loading state initially", () => {
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );
        expect(screen.getByText(/loading product.../i)).toBeInTheDocument();
    });

    it("renders product details after fetching data", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(mockProduct.product_name)).toBeInTheDocument();
            expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
            expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
            expect(screen.getByText(mockProduct.details)).toBeInTheDocument();
            expect(screen.getByText(mockProduct.username)).toBeInTheDocument();
        });
    });

    it("handles API errors gracefully", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/loading product.../i)).toBeInTheDocument();
        });
    });
});*/
