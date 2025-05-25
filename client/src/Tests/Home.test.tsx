import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";
import Home from "../Pages/Home";
import ProductPage from "../Pages/ProductPage";
import { UserProvider } from "../Users/UserContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

beforeEach(() => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/getuser/testuser")) {
      return Promise.resolve({
        data: {
          username: "testuser",
          seller_status: "none",
        },
      });
    }

    if (url.includes("/homepage-recommendations")) {
      return Promise.resolve({
        data: [
          {
            product_id: 1,
            product_name: "Mock Product",
            price: 100,
            image_url: "http://example.com/product.jpg",
            username: "seller1",
          },
          {
            product_id: 2,
            product_name: "Second Product",
            price: 200,
            image_url: "http://example.com/product2.jpg",
            username: "seller2",
          },
        ],
      });
    }

    if (url.includes("/artisan/seller1")) {
      return Promise.resolve({ data: { shop_name: "Seller One Shop" } });
    }

    if (url.includes("/artisan/seller2")) {
      return Promise.resolve({ data: { shop_name: "Seller Two Shop" } });
    }

    return Promise.reject(new Error("Unhandled GET request: " + url));
  });

  mockedAxios.post.mockResolvedValue({});
});

test("renders Home page with products from API", async () => {
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
  expect(screen.getByText("Seller One Shop")).toBeInTheDocument();
  expect(screen.getByText("Seller Two Shop")).toBeInTheDocument();
  expect(screen.getByText("R100")).toBeInTheDocument();
});

test("fetches and renders homepage AI recommended products", async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes("/getuser/testuser")) {
      return Promise.resolve({
        data: {
          username: "testuser",
          seller_status: "none",
        },
      });
    }

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

    if (url.includes("/artisan/ceramic_smith")) {
      return Promise.resolve({
        data: {
          shop_name: "Ceramic Wonders",
        },
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
  expect(screen.getByText("Ceramic Wonders")).toBeInTheDocument();
});

test("handles product click tracking for main and minor tags", async () => {
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

  await act(async () => {
    fireEvent.click(productLink);
  });

  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/track-click-main"),
      expect.objectContaining({
        username: "testuser",
        productId: 1,
      })
    );

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
  });
});

test('renders "For you" heading on Home page', async () => {
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
