import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "../Users/UserContext";
import axios from "axios";

import WelcomePage from "../Pages/WelcomePage";
import SignUpPage from "../Pages/SignUpPage";
import LoginPage from "../Pages/LoginPage";

beforeAll(() => {
  window.HTMLDialogElement.prototype.showModal = function () {};
  window.HTMLDialogElement.prototype.close = function () {};
});


jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderWithProviders = (initialPath = "/") =>
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/SignUpPage" element={<SignUpPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({
    data: [
      {
        product_id: 1,
        product_name: "Test Product",
        username: "testUser",
        image_url: "/test.jpg",
        price: 199.99,
      },
    ],
  });
});

describe("WelcomePage navigation", () => {
  test("CTA sign-up button navigates to signup screen", async () => {
    renderWithProviders();

    const ctaButton = await screen.findByTestId("cta-signup");
    fireEvent.click(ctaButton);

    expect(
      screen.getByRole("heading", { name: /welcome!/i })
    ).toBeInTheDocument();
  });

  test("navbar sign-up button navigates to signup screen", async () => {
    renderWithProviders();

    const navSignUpButton = await screen.findByTestId("navbar-signup");
    fireEvent.click(navSignUpButton);

    expect(
      screen.getByRole("heading", { name: /welcome!/i })
    ).toBeInTheDocument();
  });

  test("clicking product opens modal and login button navigates to login screen", async () => {
    renderWithProviders();

    const productCard = await screen.findByRole("button", {
      name: /test product/i,
    });
    fireEvent.click(productCard);

    const loginButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(loginButton);

    expect(
      screen.getByRole("heading", { name: /welcome back!/i })
    ).toBeInTheDocument();
  });
});
