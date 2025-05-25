import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../Pages/Profile";

import axios from "axios";
import { UserProvider } from "../Users/UserContext";

// ── MOCK SETUP ─────────────────────────────────────

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: ({ children }: any) => <div>{children}</div>,
  };
});

jest.mock("../assets/profile.png", () => "mock-profile.png");

jest.mock("../Users/UserContext", () => ({
  useUser: () => ({ user: { username: "testUser" } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../Users/ProfileContext", () => {
  const React = require("react");
  return {
    useProfile: jest.fn(),
    ProfileProvider: ({ children }: any) => <div>{children}</div>,
  };
});
import { useProfile } from "../Users/ProfileContext";

// ── TEST STATE ─────────────────────────────────────

const mockProfile = {
  postalCode: "1234",
  phone: "+15551234",
  image: null,
  sellerStatus: "verified",
};

// ── RENDER WRAPPER ────────────────────────────────

const renderWithProviders = async () => {
  await act(async () => {
    render(
      <UserProvider>
        <Profile />
      </UserProvider>
    );
  });
};

// ── TESTS ──────────────────────────────────────────

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders profile info with default image", async () => {
    (useProfile as jest.Mock).mockReturnValue({
      profile: mockProfile,
      refreshProfile: jest.fn(),
    });

    await renderWithProviders();

    expect(screen.getByText("testUser")).toBeInTheDocument();
    expect(screen.getByText(/Postal Code/)).toBeInTheDocument();
    expect(screen.getByText(/Phone/)).toBeInTheDocument();

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("mock-profile.png");
  });

  test('opens edit modal when "Edit Info" is clicked', async () => {
    (useProfile as jest.Mock).mockReturnValue({
      profile: mockProfile,
      refreshProfile: jest.fn(),
    });

    await renderWithProviders();

    const btn = screen.getByRole("button", { name: /edit info/i });
    fireEvent.click(btn);

    expect(
      screen.getByRole("heading", { name: /edit info/i })
    ).toBeInTheDocument();
  });

  test("navigates to seller signup when button is clicked", async () => {
    (useProfile as jest.Mock).mockReturnValue({
      profile: { ...mockProfile, sellerStatus: "none" },
      refreshProfile: jest.fn(),
    });

    await renderWithProviders();

    const btn = screen.getByRole("button", { name: /become a seller/i });
    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/seller-signup");
  });
});
