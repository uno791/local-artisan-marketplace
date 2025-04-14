import { useGoogleLogin} from "@react-oauth/google";
import { render, fireEvent, screen ,waitFor,act} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from '../Pages/LoginPage';
import SignUpPage from "../Pages/SignUpPage";
import axios from 'axios';
jest.mock('axios'); // <-- this tells Jest to mock it

const mockedAxios = axios as jest.Mocked<typeof axios>; // <-- this gives you typed mocking methods



const mockLogin = jest.fn();

let loginCallback: any = null;

jest.mock('@react-oauth/google', () => ({
  ...jest.requireActual('@react-oauth/google'),
  useGoogleLogin: (params: any) => {
    loginCallback = params?.onSuccess;
    return () => mockLogin();
  },
}));


test('Click Login button and check if it prompts a log in with Google button',()=>{
    render(
        <GoogleOAuthProvider clientId="test-client-id">
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </GoogleOAuthProvider>
      );
    const loginButton = screen.getByRole('button',{name:/Log-in with Google/i});
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalled();


});
test('Click Sign Up button and check if it prompts a sign up page',()=>{
    render(
        <GoogleOAuthProvider clientId="test-client-id">
          <MemoryRouter>
            <LoginPage />
            <SignUpPage />
          </MemoryRouter>
        </GoogleOAuthProvider>
      );
    const signUpButton = screen.getByRole('button',{name:/Sign Up!/i});
    fireEvent.click(signUpButton);
    expect(screen.getByRole('button', { name: /sign up with google/i }))
    .toBeInTheDocument();
});

test('If successful login screen displays "Successfully logged in!" pop up', async () => {
    // Mock the Google user info API response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/test.jpg',
      }
    });
  
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );
  
    const loginButton = screen.getByRole('button', { name: /Log-in with Google/i });
    fireEvent.click(loginButton);
  
    // Trigger the onSuccess manually
    act(() => {
      loginCallback({ credential: 'mock-token' });
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Successfully logged in!/i)).toBeInTheDocument();
    });
  });
  test('If user clicks on the close button, the pop up should disappear', async () => {
    // Mock Axios to simulate a failed fetch (401 Unauthorized)
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          error: 'invalid_request',
          error_description: 'Invalid Credentials',
        },
      }
    });
  
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );
  
    // Click the login button to trigger the mocked login and failed fetch
    const loginButton = screen.getByRole('button', { name: /Log-in with Google/i });
    fireEvent.click(loginButton);
  
    // Trigger loginCallback manually if needed
    act(() => {
      loginCallback({ credential: 'mock-token' });
    });
  
    // Wait for the error popup to appear
    await waitFor(() => {
      expect(screen.getByText(/something went wrong fetching your info/i)).toBeInTheDocument();
    });
  
    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  
    // Expect the popup to disappear
    await waitFor(() => {
      expect(screen.queryByText(/something went wrong fetching your info/i)).not.toBeInTheDocument();
    });
  });
  
test.todo('If users log in is succesful it should take you to the next page');
