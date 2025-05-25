// src/contexts/__tests__/ProfileContext.test.tsx
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { ProfileProvider, useProfile } from "../Users/ProfileContext";
import { useUser } from "../Users/UserContext";
import axios from "axios";

jest.mock("axios");
jest.mock("../Users/UserContext", () => ({
  useUser: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseUser = useUser as jest.Mock;

const mockUser = { username: "harshil" };

function TestComponent() {
  const { profile, refreshProfile } = useProfile();

  return (
    <div>
      <div data-testid="postal">{profile.postalCode}</div>
      <div data-testid="phone">{profile.phone}</div>
      <div data-testid="image">{profile.image}</div>
      <div data-testid="seller">{profile.sellerStatus}</div>
      <button onClick={refreshProfile}>Refresh</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ProfileProvider>
      <TestComponent />
    </ProfileProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  mockedUseUser.mockReturnValue({ user: mockUser });
});

test("shows default profile before fetch", () => {
  renderWithProvider();

  expect(screen.getByTestId("postal").textContent).toBe("-");
  expect(screen.getByTestId("phone").textContent).toBe("");
  expect(screen.getByTestId("seller").textContent).toBe("none");
});

test("fetches and updates profile data", async () => {
  mockedAxios.get
    .mockResolvedValueOnce({
      data: {
        postal_code: 8888,
        phone_no: "999-8888",
        user_pfp: "pic.png",
      },
    })
    .mockResolvedValueOnce({
      data: { verified: 1 },
    });

  renderWithProvider();

  await waitFor(() => {
    expect(screen.getByTestId("postal").textContent).toBe("8888");
    expect(screen.getByTestId("phone").textContent).toBe("999-8888");
    expect(screen.getByTestId("image").textContent).toBe("pic.png");
    expect(screen.getByTestId("seller").textContent).toBe("approved");
  });

  const saved = localStorage.getItem("profileData:harshil");
  expect(saved).toContain("8888");
});

test("handles error during profile fetch", async () => {
  mockedAxios.get.mockRejectedValue(new Error("Network error"));

  renderWithProvider();

  // Should not crash
  await waitFor(() => {
    expect(screen.getByTestId("postal")).toBeInTheDocument();
  });
});
