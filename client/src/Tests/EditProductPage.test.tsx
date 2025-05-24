import React, { act } from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { UserProvider } from '../Users/UserContext';
import EditProductPage from '../Pages/EditProductPage';

beforeAll(() => {
  global.fetch = jest.fn((url, options) => {
    if (url === 'http://localhost:3000/product/123') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            product_name: 'Original',
            details: 'Original description',
            price: 100,
            stock_quantity: 1,
            width: 10,
            height: 10,
            weight: 1,
            category_name: 'Art',
            tags: ['bold'],
            product_image: '',
          }),
      });
    }

    if (url === 'http://localhost:3000/editproduct/123' && options?.method === 'PUT') {
      return Promise.resolve({ ok: true });
    }

    if (url === 'http://localhost:3000/main-categories') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['Painting', 'Sculpture', 'Photography']),
      });
    }

    return Promise.reject(new Error(`Unhandled fetch call to ${url}`));
  }) as jest.Mock;
});


jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>,
}));

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

  await screen.findByLabelText(/Edit Product Name:/i);
};
function fillEditForm() {
  fireEvent.change(screen.getByLabelText(/Edit Product Name:/i), { target: { value: 'Updated Painting' } });
  fireEvent.change(screen.getByLabelText(/Edit Product Description:/i), { target: { value: 'Updated description' } });
  fireEvent.change(screen.getByLabelText(/^Price \(Rands\):$/i), { target: { value: '500' } });
  fireEvent.change(screen.getByLabelText(/^Stock Count$/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/^Width \(cm\):$/i), { target: { value: '80' } });
  fireEvent.change(screen.getByLabelText(/^Height \(cm\):$/i), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText(/^Weight \(kg\):$/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/^Type of Art:$/i), { target: { value: 'Photography' } });

  const delivery = screen.getByLabelText(/Delivery/i) as HTMLInputElement;
  if (!delivery.checked) {
    fireEvent.click(delivery);
  }
}


describe('EditProductPage Functional Tests (Fixed)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('stock increment (+) increases quantity', async () => {
    await renderWithProviders();
   const plusBtn = screen.getByRole('button', { name: 'Increase stock' });

    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(plusBtn);
    expect(stockInput.value).toBe('2');
  });

  test('stock decrement (-) decreases quantity', async () => {
    await renderWithProviders();
    const minusBtn = screen.getByRole('button', { name: 'Decrease stock' });

    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(minusBtn);
    expect(stockInput.value).toBe('0');
  });

  test('edit tags pop-up opens', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  test('adding tag shows it in list', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), { target: { value: 'vintage' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByText('vintage')).toBeInTheDocument();
  });

 test('remove button removes tag', async () => {
  await renderWithProviders();
  fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));

  fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), {
    target: { value: 'minimal' },
  });
  fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

  // Confirm it's there
  expect(screen.getByText('minimal')).toBeInTheDocument();

  // Click remove using the new aria-label
  fireEvent.click(screen.getByLabelText('remove-minimal'));

  // Confirm it's gone
  expect(screen.queryByText('minimal')).not.toBeInTheDocument();
});


  test('confirm tag closes pop-up', async () => {
    await renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /edit tags/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('valid form submits update and shows success popup', async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    expect(await screen.findByText(/Updated Product Info/i)).toBeInTheDocument();
  });

  test('close button on success popup works', async () => {
    await renderWithProviders();
    fillEditForm();
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    const closeBtn = await screen.findByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Updated Product Info/i)).not.toBeInTheDocument();
    });
  });

  test('missing fields show warning popup', async () => {
    await renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Edit Product Name:/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm edits/i }));
    expect(screen.getByText(/Please Fill Out All Required Fields/i)).toBeInTheDocument();
  });

  test('price input rejects numbers above 10 billion', async () => {
    await renderWithProviders();
    const input = screen.getByLabelText(/^Price \(Rands\):$/i);
    fireEvent.change(input, { target: { value: '10000000001' } });

    expect(await screen.findByText(/Max R10,000,000,000/i)).toBeInTheDocument();
  });

  test('delivery method toggles update correctly', async () => {
    await renderWithProviders();
    const [deliveryCheckbox, pickupCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.click(deliveryCheckbox);
    expect(deliveryCheckbox).not.toBeChecked();
    fireEvent.click(pickupCheckbox);
    expect(pickupCheckbox).toBeChecked();
  });
});
