import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SellerSignup from "../Pages/SellerSignup";
import axios from "axios";
import "@testing-library/jest-dom";

// ✅ Mock useUser from context
jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testuser" } }),
  UserProvider: ({ children }: any) => <section>{children}</section>,
}));

// ✅ Mock useProfile from context
jest.mock("../Users/ProfileContext", () => ({
  useProfile: () => ({
    profile: {
      shop_name: "Mock Shop",
      bio: "Test bio",
      shop_address: "123 Fake Street",
      shop_pfp: "",
      seller_status: "none",
    },
    updateProfile: jest.fn(),
    refreshProfile: jest.fn(), // ✅ Required by component
  }),
  ProfileProvider: ({ children }: any) => <div>{children}</div>,
}));

// ✅ Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ✅ Mock window.alert
beforeAll(() => {
  window.alert = jest.fn();
});

describe("SellerSignup page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form inputs", () => {
    render(
      <MemoryRouter>
        <SellerSignup />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText("Enter your shop name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Describe your shop")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your shop location")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create seller account/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    render(
      <MemoryRouter>
        <SellerSignup />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /create seller account/i })
    );

    expect(
      await screen.findByText("Shop name is required.")
    ).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
    expect(screen.getByText("Shop address is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("submits form successfully and navigates", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    jest.useFakeTimers(); // ✅ Handle setTimeout

    render(
      <MemoryRouter>
        <SellerSignup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your shop name"), {
      target: { value: "Test Shop" },
    });
    fireEvent.change(screen.getByPlaceholderText("Describe your shop"), {
      target: { value: "Nice handmade items" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your shop location"), {
      target: { value: "Cape Town" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create seller account/i })
    );

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    jest.runAllTimers(); // ✅ Advance timers for navigation

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });

    jest.useRealTimers(); // ✅ Cleanup
  });

  test("handles API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Request failed"));

    render(
      <MemoryRouter>
        <SellerSignup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your shop name"), {
      target: { value: "Test Shop" },
    });
    fireEvent.change(screen.getByPlaceholderText("Describe your shop"), {
      target: { value: "Nice handmade items" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your shop location"), {
      target: { value: "Cape Town" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create seller account/i })
    );

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
