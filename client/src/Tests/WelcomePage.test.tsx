import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "../Users/UserContext";

import WelcomePage from "../Pages/WelcomePage";
import SignUpPage from "../Pages/SignUpPage";
import LoginPage from "../Pages/LoginPage";

describe("WelcomePage navigation", () => {
  test("when navbar sign-up button is clicked, go to signup screen", () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <UserProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/SignUpPage" element={<SignUpPage />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </GoogleOAuthProvider>
    );

    const navSignUpButton = screen.getByTestId("navbar-signup");
    fireEvent.click(navSignUpButton);

    expect(
      screen.getByRole("heading", { name: /welcome!/i })
    ).toBeInTheDocument();
  });

  test("when CTA sign-up button is clicked, go to signup screen", () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <UserProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/SignUpPage" element={<SignUpPage />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </GoogleOAuthProvider>
    );

    const ctaButton = screen.getByTestId("cta-signup");
    fireEvent.click(ctaButton);

    expect(
      screen.getByRole("heading", { name: /welcome!/i })
    ).toBeInTheDocument();
  });

  test("when login button is clicked, go to login screen", () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <UserProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/LoginPage" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </GoogleOAuthProvider>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(loginButton);

    expect(
      screen.getByRole("heading", { name: /welcome back!/i })
    ).toBeInTheDocument();
  });
});
