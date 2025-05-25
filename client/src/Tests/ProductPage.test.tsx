import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductPage from "../Pages/ProductPage";
import Home from "../Pages/Home";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";
import { act } from "react";
import ReportProduct from "../components/ProductPageComp/ReportProduct";

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});

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
      return Promise.resolve({ data: [] });
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

  expect(await screen.findByText("Mock Product")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /home/i }));
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

  expect(await screen.findByText("Mock Product")).toBeInTheDocument();
  expect(screen.getByText("R100")).toBeInTheDocument();
  expect(screen.getByText("A great product")).toBeInTheDocument();
  expect(screen.getByText("Width:")).toBeInTheDocument();
  expect(screen.getByText(/30 cm/)).toBeInTheDocument();
  expect(screen.getByText(/40 cm/)).toBeInTheDocument();
  expect(screen.getByText(/500 kg|500 g/)).toBeInTheDocument();
});

// ------------------- ReportProduct Tests ----------------------

describe("ReportProduct Modal", () => {
  const defaultProps = {
    productId: 1,
    sellerUsername: "seller123",
    reporterUsername: "testuser",
    onClose: jest.fn(),
  };

  test("loads reasons and renders form", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { reason_id: 1, reason: "Inappropriate content" },
        { reason_id: 2, reason: "Spam" },
      ],
    });

    await act(async () => {
      render(<ReportProduct {...defaultProps} />);
    });

    expect(screen.getByText("Report Product")).toBeInTheDocument();
    expect(screen.getByText("Inappropriate content")).toBeInTheDocument();
    expect(screen.getByText("Spam")).toBeInTheDocument();
  });

  test("displays error message if reasons fail to load", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      render(<ReportProduct {...defaultProps} />);
    });

    expect(screen.getByText(/Failed to load reasons/i)).toBeInTheDocument();
  });

  test("prevents form submission if no reason is selected", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ reason_id: 1, reason: "Inappropriate content" }],
    });

    await act(async () => {
      render(<ReportProduct {...defaultProps} />);
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test("submits report successfully and shows success message", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ reason_id: 1, reason: "Inappropriate content" }],
    });

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    jest.useFakeTimers();

    await act(async () => {
      render(<ReportProduct {...defaultProps} />);
    });

    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText("Your Report"), {
      target: { value: "This product is fake." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/Report sent successfully/i)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test("handles failed submission gracefully", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ reason_id: 1, reason: "Inappropriate content" }],
    });

    mockedAxios.post.mockRejectedValueOnce(new Error("Server error"));

    await act(async () => {
      render(<ReportProduct {...defaultProps} />);
    });

    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText("Your Report"), {
      target: { value: "This product is fake." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/Report sent successfully/i)
      ).not.toBeInTheDocument();
    });
  });
});
