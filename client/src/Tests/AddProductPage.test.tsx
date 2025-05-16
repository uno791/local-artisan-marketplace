// ✅ src/Tests/AddProductPage.test.tsx

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { UserProvider } from '../Users/UserContext';
import AddProductPage from '../Pages/AddProductPage';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
) as jest.Mock;

jest.mock('../Users/UserContext', () => ({
  useUser: () => ({ user: { username: 'testUser' } }),
  UserProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('../components/AddProductPageComp/ImageAdder', () => ({
  __esModule: true,
  default: ({ setImage }: any) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
      setImage('https://example.com/image.jpg');
    }, [setImage]);

    return (
      <div data-testid="mock-image-adder">
        <input
          type="file"
          data-testid="image-upload"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={() => setImage('https://example.com/image.jpg')}
        />
        <button onClick={() => inputRef.current?.click()}>Add Image</button>
      </div>
    );
  }
}));

const renderWithProviders = () => {
  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AddProductPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );
};

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText(/enter product name/i), {
    target: { value: 'Sunset Painting' },
  });
  fireEvent.change(screen.getByLabelText(/Enter Product Description:/i), {
    target: { value: 'Beautiful sunset' },
  });
  fireEvent.change(screen.getByLabelText(/Price \(Rands\)/i), {
    target: { value: '250' },
  });
  fireEvent.change(screen.getByLabelText(/Stock Count/i), {
    target: { value: '3' },
  });
  fireEvent.change(screen.getByLabelText(/Width \(cm\)/i), {
    target: { value: '40' },
  });
  fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
    target: { value: '60' },
  });
  fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
    target: { value: '5' },
  });
  fireEvent.change(screen.getByLabelText(/Type of Art:/i), {
    target: { value: 'Painting' },
  });
  fireEvent.click(screen.getByLabelText(/delivery/i));
  fireEvent.click(screen.getByLabelText(/pickup/i));
}

describe('AddProductPage Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('increment button increases stock count', () => {
    renderWithProviders();
    const plusBtn = screen.getByRole('button', { name: '+' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(plusBtn);
    expect(stockInput.value).toBe('2');
  });

  test('decrement button decreases stock count', () => {
    renderWithProviders();
    const minusBtn = screen.getByRole('button', { name: '-' });
    const stockInput = screen.getByLabelText(/Stock Count/i) as HTMLInputElement;
    fireEvent.click(minusBtn);
    expect(stockInput.value).toBe('0');
  });

  test('adding and removing a tag works', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), {
      target: { value: 'abstract' },
    });
    fireEvent.click(screen.getByText(/^add$/i));
    expect(screen.getByText('abstract')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/remove-abstract/i));
    expect(screen.queryByText('abstract')).not.toBeInTheDocument();
  });

  test('tags persist after reopen', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/add tags/i));
    fireEvent.change(screen.getByPlaceholderText(/enter a tag/i), {
      target: { value: 'boho' },
    });
    fireEvent.click(screen.getByText(/^add$/i));
    fireEvent.click(screen.getByText(/^confirm$/i));
    fireEvent.click(screen.getByText(/add tags/i));
    expect(screen.getByText('boho')).toBeInTheDocument();
  });

// test('successful form submission shows success popup', async () => {
//   renderWithProviders();
//   fillForm();
//   fireEvent.click(screen.getByText(/confirm addition of new product/i));
  
//   expect(
//     await screen.findByText((content) => content.includes('Submitted Product Info'))
//   ).toBeInTheDocument();
// });


//  test('close button on success popup removes it', async () => {
//   renderWithProviders();
//   fillForm();
//   fireEvent.click(screen.getByText(/confirm addition of new product/i));

//   // ✅ Wait for the success heading instead of full-text match
//   await screen.findByRole('heading', { name: /Submitted Product Info/i });

//   const closeBtn = screen.getByLabelText(/close/i);
//   fireEvent.click(closeBtn);

//   await waitFor(() => {
//     expect(screen.queryByText(/Submitted Product Info/i)).not.toBeInTheDocument();
//   });
// });


  test('warning appears on missing fields', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/confirm addition of new product/i));
    expect(screen.getByText(/Please Fill Out All Required Fields/i)).toBeInTheDocument();
  });

  

});