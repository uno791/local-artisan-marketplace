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
jest.mock("axios"); // <-- this tells Jest to mock it

const mockedAxios = axios as jest.Mocked<typeof axios>; // <-- this gives you typed mocking methods

const mockLogin = jest.fn();

let loginCallback: any = null;

jest.mock("@react-oauth/google", () => ({
  ...jest.requireActual("@react-oauth/google"),
  useGoogleLogin: (params: any) => {
    loginCallback = params?.onSuccess;
    return () => mockLogin();
  },
}));

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

test.todo("if sucessful sign up user gets taken to QuestionsPage");

test("log in link clicked takes you to log in page", () => {
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
