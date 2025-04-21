
import { render, fireEvent, screen ,waitFor,act} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';


jest.mock('axios'); // <-- this tells Jest to mock it
import { UserProvider } from '../Users/UserContext'; // adjust path if necessary
import AdminDashboard from "../Pages/AdminDashboard";
import Home from "../Pages/Home";
import SellerVerification from "../Pages/SellerVerification";
const mockedAxios = axios as jest.Mocked<typeof axios>; // <-- this gives you typed mocking methods


const mockLogin = jest.fn();

let loginCallback: any = null;

test('when you press the Seller Verification tab button it takes you to the Seller Verification page', () => {
  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/SellerVerification" element={<SellerVerification />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  const button = screen.getByRole('link', { name: /Seller Verification/i });
  fireEvent.click(button);

  // Now that you added a test ID to the heading
  expect(screen.getByTestId("seller-verification-title")).toBeInTheDocument();
});

test('when you press the Start Review button, it shows Approve and Reject buttons', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        username: 'seller123',
        verified: 0,
        shop_name: 'Test Shop',
        bio: 'Crafted with care.',
        shop_address: '123 Market St.',
        shop_pfp: 'https://example.com/shop.jpg',
        create_date: '2024-04-21',
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SellerVerification />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  // Wait for seller card to appear and click the button
  const startReviewBtn = await screen.findByRole('button', { name: /start review/i });
  fireEvent.click(startReviewBtn);

  // Check for approve/reject buttons after state change
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });
});



test('when you press approve button the seller status changes to "Approved"', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        username: 'seller123',
        verified: 0,
        shop_name: 'Test Shop',
        bio: 'Crafted with care.',
        shop_address: '123 Market St.',
        shop_pfp: 'https://example.com/shop.jpg',
        create_date: '2024-04-21',
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SellerVerification />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  const startReviewBtn = await screen.findByRole('button', { name: /start review/i });
  fireEvent.click(startReviewBtn);

  const approveBtn = await screen.findByRole('button', { name: /approve/i });
  fireEvent.click(approveBtn);

  await waitFor(() => {
    expect(screen.getByTestId('seller-status')).toHaveTextContent(/Approved/i);
  });
});

test('when you press reject button the seller status changes to "Rejected"', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        username: 'seller456',
        verified: 0,
        shop_name: 'Reject Shop',
        bio: 'Unverified artisan.',
        shop_address: '456 Back Alley',
        shop_pfp: 'https://example.com/reject.jpg',
        create_date: '2024-04-21',
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SellerVerification />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  const startReviewBtn = await screen.findByRole('button', { name: /start review/i });
  fireEvent.click(startReviewBtn);

  const rejectBtn = await screen.findByRole('button', { name: /reject/i });
  fireEvent.click(rejectBtn);

  await waitFor(() => {
    expect(screen.getByTestId('seller-status')).toHaveTextContent(/Rejected/i);
  });
});
