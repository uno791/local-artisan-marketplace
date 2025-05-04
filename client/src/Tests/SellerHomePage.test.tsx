import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { act } from 'react';
import SellerHome from '../Pages/SellerHome';
import { UserProvider } from '../Users/UserContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useUser
jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// Dummy data
const mockArtisan = {
  shop_name: 'Handmade by Jess',
  bio: 'Local artisan making beautiful goods.',
  shop_pfp: 'pfp.jpg',
  shop_address: '123 Market St',
  shop_banner: 'banner.jpg',
};

const mockProducts = [
  {
    id: 1,
    name: 'Clay Pot',
    price: '150',
    category: 'Pottery',
    image: 'claypot.jpg',
  },
  {
    id: 2,
    name: 'Wooden Frame',
    price: '200',
    category: 'Woodwork',
    image: 'frame.jpg',
  },
];

// Setup function
const setup = async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      artisan: mockArtisan,
      products: mockProducts,
    },
  });

  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter>
          <SellerHome />
        </MemoryRouter>
      </UserProvider>
    );
  });
};

describe('SellerHome Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders seller header with artisan info', async () => {
    await setup();
    expect(screen.getByText('Handmade by Jess')).toBeInTheDocument();
    expect(screen.getByText('Local artisan making beautiful goods.')).toBeInTheDocument();
    expect(screen.getByText('123 Market St')).toBeInTheDocument();
  });

  test('renders Add New Product button and category filter', async () => {
    await setup();
    expect(screen.getByRole('button', { name: /add new product/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pottery/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /woodwork/i })).toBeInTheDocument();
  });

  test('displays all products initially', async () => {
    await setup();
    expect(screen.getByText('Clay Pot')).toBeInTheDocument();
    expect(screen.getByText('Wooden Frame')).toBeInTheDocument();
  });

  test('filters products by category when category is selected', async () => {
    await setup();
    const potteryBtn = screen.getAllByRole('button', { name: 'Pottery' }).find((btn) => btn.textContent === 'Pottery')!;
    fireEvent.click(potteryBtn);

    await waitFor(() => {
      expect(screen.getByText('Clay Pot')).toBeInTheDocument();
      expect(screen.queryByText('Wooden Frame')).not.toBeInTheDocument();
    });
  });

  test('clicking Add New Product redirects to AddProductPage', async () => {
    await setup();
    const addBtn = screen.getByRole('button', { name: /add new product/i });
    expect(addBtn.closest('a')).toHaveAttribute('href', '/AddProductPage');
  });

  test('displays "Uncategorized" if product category is missing', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        artisan: mockArtisan,
        products: [
          {
            id: 3,
            name: 'Mysterious Art',
            price: '100',
            category: '',
            image: 'mystery.jpg',
          },
        ],
      },
    });

    await act(async () => {
      render(
        <UserProvider>
          <MemoryRouter>
            <SellerHome />
          </MemoryRouter>
        </UserProvider>
      );
    });

    expect(screen.getByText('Mysterious Art')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Uncategorized' })).toBeInTheDocument();
  });

  test('handles API failure gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    await act(async () => {
      render(
        <UserProvider>
          <MemoryRouter>
            <SellerHome />
          </MemoryRouter>
        </UserProvider>
      );
    });

    // Button should still be present if not conditionally rendered
    expect(screen.queryByRole('button', { name: /add new product/i })).toBeInTheDocument();
  });
});
