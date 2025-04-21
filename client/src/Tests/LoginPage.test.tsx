import { useGoogleLogin } from "@react-oauth/google";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "../Pages/LoginPage";
import SignUpPage from "../Pages/SignUpPage";
import axios from "axios";
jest.mock("axios"); // <-- this tells Jest to mock it
import { UserProvider } from "../Users/UserContext"; // adjust path if necessary
import AdminDashboard from "../Pages/AdminDashboard";
import Home from "../Pages/Home";

const mockedAxios = axios as jest.Mocked<typeof axios>; // <-- this gives you typed mocking methods
const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

const mockLogin = jest.fn();

let loginCallback: any = null;

jest.mock("@react-oauth/google", () => ({
  ...jest.requireActual("@react-oauth/google"),
  useGoogleLogin: (params: any) => {
    loginCallback = params?.onSuccess;
    return () => mockLogin();
  },
}));

test("Click Login button and check if it prompts a log in with Google button", () => {
  renderWithProviders(<LoginPage />);
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);
  expect(mockLogin).toHaveBeenCalled();
});

test("Click Sign Up button and check if it prompts a sign up page", () => {
  renderWithProviders(
    <>
      <LoginPage />
      <SignUpPage />
    </>
  );
  const signUpButton = screen.getByRole("button", { name: /Sign Up!/i });
  fireEvent.click(signUpButton);
  expect(
    screen.getByRole("button", { name: /sign up with google/i })
  ).toBeInTheDocument();
});

test('If successful login screen displays "Successfully logged in!" pop up', async () => {
  // ✅ MOCK 1: Google OAuth userinfo API
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "1234567890",
      name: "Test User",
      given_name: "Test",
      family_name: "User",
      email: "test@example.com",
      picture: "https://example.com/avatar.jpg",
    },
  });

  // ✅ MOCK 2: Backend response for role 0 (normal user)
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 0,
      username: "testuser123",
    },
  });

  renderWithProviders(<LoginPage />);
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  // ✅ Trigger simulated login success callback
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "test-token" });
  });

  // ✅ Match the exact message that your LoginPage checks for
  await waitFor(() => {
    expect(screen.getByText("Successfully logged in!")).toBeInTheDocument();
  });
});

test("If user clicks on the close button, the pop up should disappear", async () => {
  mockedAxios.get.mockRejectedValueOnce({
    response: {
      status: 401,
      data: {
        error: "invalid_request",
        error_description: "Invalid Credentials",
      },
    },
  });

  renderWithProviders(<LoginPage />);
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  act(() => {
    loginCallback({ credential: "mock-token" });
  });

  await waitFor(() => {
    expect(
      screen.getByText(/something went wrong fetching your info/i)
    ).toBeInTheDocument();
  });

  const closeButton = screen.getByRole("button", { name: /close/i });
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(
      screen.queryByText(/something went wrong fetching your info/i)
    ).not.toBeInTheDocument();
  });
});

test("If admin login is successful and close is clicked, user is taken to the admin dashboard", async () => {
  // Mock Google user info response
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "admin-id",
      name: "Admin User",
      email: "admin@example.com",
      picture: "https://example.com/admin.jpg",
    },
  });

  // Mock backend check — admin user
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 1,
    },
  });

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/AdminDashboard" element={<h1>Admin Dashboard</h1>} /> */}
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  // Simulate clicking the login button
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  // Simulate Google callback
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "admin-token" });
  });

  // Wait for the success popup to appear
  await waitFor(() => {
    expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
  });

  // Click the "Close" button in the popup (wrapped in <Link to="/AdminDashboard">)
  const closeButton = screen.getByRole("button", { name: /close/i });
  fireEvent.click(closeButton);

  // Now we should be redirected to the Admin Dashboard
  await waitFor(() => {
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});

test('If successful login screen displays "Welcome back, Admin!" pop up', async () => {
  // ✅ MOCK 1: Google OAuth userinfo API
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "1234567890",
      name: "Admin User",
      given_name: "Admin",
      family_name: "User",
      email: "admin@example.com",
      picture: "https://example.com/avatar.jpg",
    },
  });

  // ✅ MOCK 2: Backend response for role 1 (admin)
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 1, // ✅ ADMIN
    },
  });

  renderWithProviders(<LoginPage />);
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  // ✅ Trigger simulated login success callback
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "test-token" });
  });

  // ✅ Match the exact message for admins
  await waitFor(() => {
    expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
  });
});

test('If user login is unsuccessful, it should show a pop-up saying "You are not registered in our system."', async () => {
  // ✅ Mock Google OAuth userinfo
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "ghost-user",
      name: "Ghost User",
      email: "ghost@example.com",
      picture: "https://example.com/ghost.jpg",
    },
  });

  // ✅ Mock backend check — user does NOT exist
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: false, // 🚨 triggers error message
    },
  });

  renderWithProviders(<LoginPage />);
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  // Trigger fake Google login callback
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "ghost-token" });
  });

  // Assert the expected error message is shown
  await waitFor(() => {
    expect(
      screen.getByText("You are not registered in our system.")
    ).toBeInTheDocument();
  });
});

test("If users log in is succesful it should take you to the home page", async () => {
  // Mock Google user info response
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "user-id",
      name: "test User",
      email: "test@example.com",
      picture: "https://example.com/test.jpg",
    },
  });

  // Mock backend check — admin user
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 0,
    },
  });

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  // Simulate clicking the login button
  const loginButton = screen.getByRole("button", {
    name: /Log-in with Google/i,
  });
  fireEvent.click(loginButton);

  // Simulate Google callback
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "admin-token" });
  });

  // Wait for the success popup to appear
  await waitFor(() => {
    expect(screen.getByText("Successfully logged in!")).toBeInTheDocument();
  });

  // Click the "Close" button in the popup (wrapped in <Link to="/AdminDashboard">)
  const closeButton = screen.getByRole("button", { name: /close/i });
  fireEvent.click(closeButton);

  // Now we should be redirected to the Admin Dashboard
  await waitFor(() => {
    expect(screen.getByText("Top 10 Products")).toBeInTheDocument();
  });
});
