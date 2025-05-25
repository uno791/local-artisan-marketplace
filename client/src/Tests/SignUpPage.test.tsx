import { useGoogleLogin } from "@react-oauth/google";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "../Pages/LoginPage";
import SignUpPage from "../Pages/SignUpPage";
import axios from "axios";
import { UserProvider } from "../Users/UserContext";
import QuestionsPage from "../Pages/QuestionsPage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockLogin = jest.fn();
let loginCallback: any = null;
let errorCallback: any = null;

jest.mock("@react-oauth/google", () => ({
  ...jest.requireActual("@react-oauth/google"),
  useGoogleLogin: (params: any) => {
    loginCallback = params?.onSuccess;
    errorCallback = params?.onError;
    return () => mockLogin();
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

test("once google button is clicked google log in is started", () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );
  const signUpButton = screen.getByRole("button", {
    name: /Sign Up with Google/i,
  });
  fireEvent.click(signUpButton);
  expect(mockLogin).toHaveBeenCalled();
});

test("log in link clicked takes you to log in page", () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
          <LoginPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );
  const loginButton = screen.getByRole("button", { name: /Log In!/i });
  fireEvent.click(loginButton);
  expect(
    screen.getByRole("button", { name: /log-in with google/i })
  ).toBeInTheDocument();
});

test("if sucessful sign up user gets taken to QuestionsPage", () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
          <LoginPage />
          <QuestionsPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );
  const signUpButton = screen.getByRole("button", {
    name: /Sign Up with Google/i,
  });
  fireEvent.click(signUpButton);
  expect(screen.getByRole("button", { name: /Apply/i })).toBeInTheDocument();
});

test("successful Google login creates new user and navigates to QuestionsPage", async () => {
  const mockToken = { access_token: "test-token" };

  mockedAxios.get.mockImplementation((url) => {
    if (url === "https://www.googleapis.com/oauth2/v3/userinfo") {
      return Promise.resolve({
        data: {
          sub: "12345",
          name: "John Doe",
          given_name: "John",
          family_name: "Doe",
          email: "john@example.com",
          picture: "pic.jpg",
        },
      });
    }
    if (url.includes("/get-tags")) {
      return Promise.resolve({
        data: ["Painting", "Sculpture"],
      });
    }
    return Promise.reject(new Error("Unknown GET URL"));
  });

  mockedAxios.post.mockResolvedValueOnce({ data: { exists: false } });

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter initialEntries={["/"]}>
          <SignUpPage />
          <QuestionsPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  const signUpButton = screen.getByRole("button", {
    name: /Sign Up with Google/i,
  });

  fireEvent.click(signUpButton);

  await act(async () => {
    await loginCallback(mockToken);
  });

  await waitFor(() => {
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });
});

test("shows error if user already exists", async () => {
  const mockToken = { access_token: "test-token" };

  mockedAxios.get.mockResolvedValueOnce({
    data: {
      sub: "12345",
      name: "Jane Doe",
      given_name: "Jane",
      family_name: "Doe",
      email: "jane@example.com",
      picture: "pic.jpg",
    },
  });

  mockedAxios.post.mockResolvedValueOnce({ data: { exists: true } });

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: /Sign Up with Google/i }));

  await act(async () => {
    await loginCallback(mockToken);
  });

  await waitFor(() => {
    expect(
      screen.getByText((text) => text.includes("User already exists"))
    ).toBeInTheDocument();
  });
});

test("shows error message when user info fetch fails", async () => {
  const mockToken = { access_token: "invalid-token" };

  mockedAxios.get.mockRejectedValueOnce(new Error("Fetch failed"));

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: /Sign Up with Google/i }));

  await act(async () => {
    await loginCallback(mockToken);
  });

  expect(
    await screen.findByText(/Google login failed. Please try again./i)
  ).toBeInTheDocument();
});

test("shows error message when Google login fails via onError", async () => {
  const mockError = new Error("Google error");

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <UserProvider>
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: /Sign Up with Google/i }));

  await act(async () => {
    errorCallback(mockError);
  });

  expect(
    await screen.findByText(/Google login failed. Please try again./i)
  ).toBeInTheDocument();
});
