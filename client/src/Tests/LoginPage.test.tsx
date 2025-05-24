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
jest.mock("axios");
import { UserProvider } from "../Users/UserContext";
import AdminDashboard from "../Pages/AdminDashboard";
import Home from "../Pages/Home";

const mockedAxios = axios as jest.Mocked<typeof axios>;

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
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "1234567890",
      name: "Test User",
      email: "test@example.com",
      picture: "https://example.com/avatar.jpg",
    },
  });

  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 0,
      username: "testuser123",
    },
  });

  renderWithProviders(<LoginPage />);
  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  act(() => {
    loginCallback({ credential: "mock-token", access_token: "test-token" });
  });

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
  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  act(() => {
    loginCallback({ credential: "mock-token" });
  });

  await waitFor(() => {
    expect(
      screen.getByText(/something went wrong fetching your info/i)
    ).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /close/i }));

  await waitFor(() => {
    expect(
      screen.queryByText(/something went wrong fetching your info/i)
    ).not.toBeInTheDocument();
  });
});

// test("If admin login is successful and close is clicked, user is taken to the admin dashboard", async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       sub: "admin-id",
//       name: "Admin User",
//       email: "admin@example.com",
//       picture: "https://example.com/admin.jpg",
//     },
//   });

//   mockedAxios.post.mockResolvedValueOnce({
//     data: {
//       exists: true,
//       role: 1,
//     },
//   });

//   render(
//     <GoogleOAuthProvider clientId="test-client-id">
//       <UserProvider>
//         <MemoryRouter initialEntries={["/"]}>
//           <Routes>
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/AdminDashboard" element={<AdminDashboard />} />
//           </Routes>
//         </MemoryRouter>
//       </UserProvider>
//     </GoogleOAuthProvider>
//   );

//   const loginButton = screen.getByRole("button", {
//     name: /Log-in with Google/i,
//   });
//   fireEvent.click(loginButton);

//   act(() => {
//     loginCallback({ credential: "mock-token", access_token: "admin-token" });
//   });

//   await waitFor(() => {
//     expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
//   });

//   const closeButton = screen.getByRole("button", { name: /close/i });
//   fireEvent.click(closeButton);

//   await waitFor(() => {
//     expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
//   });
// });

test('If successful login screen displays "Welcome back, Admin!" pop up', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "1234567890",
      name: "Admin User",
      email: "admin@example.com",
      picture: "https://example.com/avatar.jpg",
    },
  });

  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 1,
    },
  });

  renderWithProviders(<LoginPage />);
  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  act(() => {
    loginCallback({ credential: "mock-token", access_token: "test-token" });
  });

  await waitFor(() => {
    expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
  });
});

// test("If users log in is succesful it should take you to the home page", async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       sub: "user-id",
//       name: "test User",
//       email: "test@example.com",
//       picture: "https://example.com/test.jpg",
//     },
//   });

//   mockedAxios.post.mockResolvedValueOnce({
//     data: {
//       exists: true,
//       role: 0,
//     },
//   });

//   render(
//     <GoogleOAuthProvider clientId="test-client-id">
//       <UserProvider>
//         <MemoryRouter initialEntries={["/"]}>
//           <Routes>
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/Home" element={<Home />} />
//           </Routes>
//         </MemoryRouter>
//       </UserProvider>
//     </GoogleOAuthProvider>
//   );

//   fireEvent.click(screen.getByRole("button", {
//     name: /Log-in with Google/i,
//   }));

//   act(() => {
//     loginCallback({ credential: "mock-token", access_token: "admin-token" });
//   });

//   await waitFor(() => {
//     expect(screen.getByText("Successfully logged in!")).toBeInTheDocument();
//   });

//   const closeButton = screen.getByRole("button", { name: /close/i });
//   fireEvent.click(closeButton);

//   await waitFor(() => {
//     expect(screen.getByText("Top 10 Products")).toBeInTheDocument();
//   });
// });

test('Admin login shows "Are you a robot?" prompt', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "admin-id",
      name: "Admin User",
      email: "admin@example.com",
      picture: "https://example.com/admin.jpg",
    },
  });

  mockedAxios.post.mockResolvedValueOnce({
    data: {
      exists: true,
      role: 1,
    },
  });

  renderWithProviders(<LoginPage />);
  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  act(() => {
    loginCallback({ credential: "mock-token", access_token: "admin-token" });
  });

  // Wait for success popup
  await waitFor(() => {
    expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
  });

  // Click the close button to reveal prank modal
  fireEvent.click(screen.getByRole("button", { name: /close/i }));

  // Now prank modal should be visible
  await waitFor(() => {
    expect(screen.getByTestId("robot-check")).toBeInTheDocument();
  });
});




test('Clicking "No" on robot check takes you to Admin Dashboard', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "admin-id",
      name: "Admin User",
      email: "admin@example.com",
      picture: "https://example.com/admin.jpg",
    },
  });

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
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  // Click login button
  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  // Simulate login success
  act(() => {
    loginCallback({ credential: "mock-token", access_token: "admin-token" });
  });

  // Wait for admin success message
  await waitFor(() => {
    expect(screen.getByText("Welcome back, Admin!")).toBeInTheDocument();
  });

  // Close popup → show prank modal
  fireEvent.click(screen.getByRole("button", { name: /close/i }));

  await waitFor(() => {
    expect(screen.getByTestId("robot-check")).toBeInTheDocument();
  });

  // Click "No" → navigate to Admin Dashboard
  fireEvent.click(screen.getByRole("button", { name: /no/i }));

  await waitFor(() => {
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
});

test('Clicking "No" on robot check as user takes you to Home page', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "user-id",
      name: "Test User",
      email: "user@example.com",
      picture: "https://example.com/user.jpg",
    },
  });

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

  fireEvent.click(screen.getByRole("button", { name: /Log-in with Google/i }));

  act(() => {
    loginCallback({ credential: "mock-token", access_token: "user-token" });
  });

  await waitFor(() => {
    expect(screen.getByText("Successfully logged in!")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /close/i }));

  await waitFor(() => {
    expect(screen.getByTestId("robot-check")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /no/i }));

  await waitFor(() => {
    expect(screen.getByText(/for you/i)).toBeInTheDocument(); // Adjust text as needed
  });
});

