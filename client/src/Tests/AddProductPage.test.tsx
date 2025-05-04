import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { UserProvider } from '../Users/UserContext';
import AddProductPage from '../Pages/AddProductPage';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

// Mock UserContext
jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

// Helper to fill out the form
function fillForm() {
  fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { target: { value: 'Sunset Painting' } });
  fireEvent.change(screen.getByLabelText(/Enter Product Description:/i), { target: { value: 'Beautiful sunset' } });
  fireEvent.change(screen.getByLabelText(/Price \(Rands\)/i), { target: { value: '250' } });
  fireEvent.change(screen.getByLabelText(/Stock Count/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/Width \(cm\)/i), { target: { value: '40' } });
  fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), { target: { value: '60' } });
  fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/Type of Art:/i), { target: { value: 'Painting' } });
}

// Render with full routing and context
const renderWithProviders = () => {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AddProductPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );
};

describe('AddProductPage Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('when the increment (+) button is clicked, the quantity should increase by 1', () => {
    renderWithProviders();
    const plusBtn = screen.getByRole('button', { name: '+' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(plusBtn);
    expect(stockInput.value).toBe('2');
  });

  test('when the decrement (-) button is clicked, the quantity should decrease by 1', () => {
    renderWithProviders();
    const minusBtn = screen.getByRole('button', { name: '-' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(minusBtn);
    expect(stockInput.value).toBe('0');
  });

  test('when the add tags button is clicked, the add tag pop up should open', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  test('when the add button is clicked in the pop up while input is not empty, the tag should be added to the list of tags', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), { target: { value: 'abstract' } });
    fireEvent.click(screen.getByText(/^add$/i));
    expect(screen.getByText('abstract')).toBeInTheDocument();
  });

  test('when a tag is added to the list, the remove button should remove the tag from the list', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), { target: { value: 'surreal' } });
    fireEvent.click(screen.getByText(/^add$/i));
    fireEvent.click(screen.getByLabelText(/remove tag surreal/i));
    expect(screen.queryByText('surreal')).not.toBeInTheDocument();
  });

  test('when the confirm button is clicked, the tag pop up should close', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    fireEvent.click(screen.getByText(/^confirm$/i));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('when the confirm addition of new products button is clicked, the product should be added to the database', async () => {
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new products/i));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  test('when not all fields are filled, a warning pop up should appear', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/confirm addition of new products/i));
    expect(screen.getByText(/Please Fill Out All Required Fields/i)).toBeInTheDocument();
  });

  test('when the close button is clicked on the missing fields pop up, it should close', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/confirm addition of new products/i));
    fireEvent.click(screen.getByText(/close/i));
    await waitFor(() => expect(screen.queryByText(/Please Fill Out All Required Fields/i)).not.toBeInTheDocument());
  });

  test('when product is submitted successfully, product info pop up should show', async () => {
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new products/i));
    expect(await screen.findByText(/Submitted Product Info/i)).toBeInTheDocument();
  });

  test('when the close button is clicked on the success pop up, it should close', async () => {
    renderWithProviders();
    fillForm();
    fireEvent.click(screen.getByText(/confirm addition of new products/i));
    const closeBtn = await screen.findByText(/close/i);
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByText(/Submitted Product Info/i)).not.toBeInTheDocument());
  });
});
