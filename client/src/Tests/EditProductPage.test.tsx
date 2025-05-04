import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

import { UserProvider } from '../Users/UserContext';
import EditProductPage from '../Pages/EditProductPage';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      product_name: '',
      details: '',
      price: 0,
      stock_quantity: 1,
      width: '',
      height: '',
      weight: '',
      category_name: '',
      tags: [],
    }),
  })
) as jest.Mock;

// Mock UserContext
jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// Helper to simulate editing existing product info
function fillEditForm() {
  fireEvent.change(screen.getByLabelText(/Edit Product Name:/i), { target: { value: 'Updated Painting' } });
  fireEvent.change(screen.getByLabelText(/Edit Product Description:/i), { target: { value: 'Updated description' } });
  fireEvent.change(screen.getByLabelText(/^Price \(Rands\):$/i), { target: { value: '500' } });
  fireEvent.change(screen.getByLabelText(/^Stock Count$/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/^Width \(cm\):$/i), { target: { value: '80' } });
  fireEvent.change(screen.getByLabelText(/^Height \(cm\):$/i), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText(/^Weight \(kg\):$/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/^Type of Art:$/i), { target: { value: 'Photography' } });
}

// Custom render function with act()
const renderWithProviders = async () => {
  await act(async () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={['/edit/123']}>
          <Routes>
            <Route path="/edit/:id" element={<EditProductPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );
  });
};

describe('EditProductPage Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('when the increment (+) button is clicked, the quantity should increase by 1', async () => {
    await renderWithProviders();
    const plusBtn = screen.getByRole('button', { name: '+' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(plusBtn);
    expect(stockInput.value).toBe('2');
  });

  test('when the decrement (-) button is clicked, the quantity should decrease by 1', async () => {
    await renderWithProviders();
    const minusBtn = screen.getByRole('button', { name: '-' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(minusBtn);
    expect(stockInput.value).toBe('0');
  });

  test('when the edit tags button is clicked, the tag pop up should open', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  test('when the add button is clicked in the pop up while input is not empty, the tag should be added to the list of tags', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), { target: { value: 'vintage' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByText('vintage')).toBeInTheDocument();
  });

  test('when a tag is added, the remove button should remove it from the list', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), { target: { value: 'minimal' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

    const tagItem = screen.getByText('minimal').closest('li')!;
    const removeBtn = tagItem.querySelector('button')!;
    fireEvent.click(removeBtn);

    expect(screen.queryByText('minimal')).not.toBeInTheDocument();
  });

  test('when the confirm button is clicked, the tag pop up should close', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('when the confirm edits button is clicked, the product should be updated in the database', async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/editproduct/123'), // Adjusted to match actual endpoint
        expect.any(Object)
      );
    });
  });

  test('when required fields are missing, a warning pop up should appear', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    expect(screen.getByText(/Please Fill Out All Required Fields/i)).toBeInTheDocument();
  });

  test('when the close button is clicked on the missing fields pop up, it should close', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() =>
      expect(screen.queryByText(/Please Fill Out All Required Fields/i)).not.toBeInTheDocument()
    );
  });

  test('when product is edited successfully, success pop up should show', async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    expect(await screen.findByText(/Updated Product Info/i)).toBeInTheDocument();
  });

  test('when the close button is clicked on the success pop up, it should close', async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    const closeBtn = await screen.findByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() =>
      expect(screen.queryByText(/Updated Product Info/i)).not.toBeInTheDocument()
    );
  });
});
