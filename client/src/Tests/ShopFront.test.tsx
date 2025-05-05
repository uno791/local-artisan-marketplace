import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { act } from 'react';
import axios from 'axios';

import ShopFront from '../Pages/ShopFront';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useParams
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ username: 'artisan123' }),
  };
});

// Dummy data
const mockArtisan = {
  shop_name: 'Crafty Corner',
  shop_pfp: 'logo.jpg',
  bio: 'Handcrafted items made with love.',
  shop_address: '456 Artisan Lane',
};

const allProducts = [
  {
    product_id: 1,
    product_name: 'Handmade Vase',
    price: 120,
    image_url: 'vase.jpg',
    username: 'artisan123',
  },
  {
    product_id: 2,
    product_name: 'Wooden Sculpture',
    price: 300,
    image_url: 'sculpture.jpg',
    username: 'anotherUser',
  },
];

// Setup render function
const setup = async () => {
  mockedAxios.get
    .mockResolvedValueOnce({ data: mockArtisan }) // artisan fetch
    .mockResolvedValueOnce({ data: allProducts }); // products fetch

  await act(async () => {
    render(
      <MemoryRouter>
        <ShopFront />
      </MemoryRouter>
    );
  });
};

describe('ShopFront Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders artisan info and product list correctly', async () => {
    await setup();

    // Check header shop name
    expect(screen.getByRole('heading', { name: 'Crafty Corner' })).toBeInTheDocument();

    // Check artisan bio
    expect(screen.getByText('Handcrafted items made with love.')).toBeInTheDocument();

    // Check that only relevant product appears
    expect(screen.getByText('Handmade Vase')).toBeInTheDocument();
    expect(screen.queryByText('Wooden Sculpture')).not.toBeInTheDocument();
  });

  test('opens report modal when "Report Shop" is clicked', async () => {
    await setup();

    const reportBtn = screen.getByRole('button', { name: /report shop/i });
    fireEvent.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /report shop/i })).toBeInTheDocument();
    });
  });

  test('displays default values when artisan data is missing', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: {} }) // missing artisan
      .mockResolvedValueOnce({ data: [] }); // no products

    await act(async () => {
      render(
        <MemoryRouter>
          <ShopFront />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /artisan shop/i })).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <ShopFront />
        </MemoryRouter>
      );
    });

    // Page should still show button or fallback
    expect(screen.getByRole('button', { name: /report shop/i })).toBeInTheDocument();
  });
});
