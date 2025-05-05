import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../Pages/Profile';

// Mock BEFORE all other imports
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigate),
    MemoryRouter: ({ children }: any) => <div>{children}</div>,
  };
});

import axios from 'axios';
import { UserProvider } from '../Users/UserContext';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock profile image asset
jest.mock('../assets/profile.png', () => 'mock-profile.png');

// Mock UserContext
jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

const mockNavigate = jest.fn();

// Setup wrapper
const renderWithProviders = async () => {
  await act(async () => {
    render(
      <UserProvider>
        <Profile />
      </UserProvider>
    );
  });
};

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile info with default image', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { postal_code: '1234', phone_no: '555-1234' } });
    mockedAxios.get.mockResolvedValueOnce({ data: { verified: 1 } });

    await renderWithProviders();

    expect(screen.getByText('testUser')).toBeInTheDocument();
    expect(screen.getByText(/Postal Code:\s*1234/)).toBeInTheDocument();
    expect(screen.getByText(/Phone:\s*555-1234/)).toBeInTheDocument();

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('mock-profile.png');
  });

  test('opens edit modal when "Edit Info" is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
  
    await renderWithProviders();
  
    const editInfoBtn = screen.getByRole('button', { name: /edit info/i });
    fireEvent.click(editInfoBtn);
  
    // Check the modal's heading instead of using ambiguous text match
    expect(screen.getByRole('heading', { name: /edit info/i })).toBeInTheDocument();
  });
  

  test('navigates to seller signup when button is clicked', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    await renderWithProviders();

    const becomeSellerBtn = screen.getByRole('button', { name: /become a seller/i });
    fireEvent.click(becomeSellerBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/seller-signup');
  });

  test('changes profile image when file is uploaded', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });

    await renderWithProviders();

    const fileInput = screen.getByLabelText(/upload profile image/i);
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img.src).toContain('data:image/');
    });
  });
});
