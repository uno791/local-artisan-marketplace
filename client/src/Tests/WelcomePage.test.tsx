import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "../Users/UserContext"; // adjust the path as needed


import WelcomePage from "../Pages/WelcomePage";
import SignUpPage from "../Pages/SignUpPage";
import LoginPage from "../Pages/LoginPage";

test("when sign-up button is clicked, go to signup screen", () => {
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
  

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  // Flexible match to handle mixed accessible text like "Google logo Sign Up with Google"
  expect(
    screen.getByRole("button", { name: /sign up with google/i })
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
  
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  // Flexible match to handle possible "Google icon Log-in with Google"
  expect(
    screen.getByRole("button", { name: /log-?in with google/i })
  ).toBeInTheDocument();
});
