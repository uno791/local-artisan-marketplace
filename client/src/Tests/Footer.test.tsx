// Mock the logo import before anything else
jest.mock('../../assets/localish-logo.png', () => 'logo-mock-path');

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/HomePageComp/Footer';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Footer Component', () => {
  test('renders logo image', () => {
    renderWithRouter(<Footer />);
    const logoImg = screen.getByAltText(/localish logo/i);
    expect(logoImg).toBeInTheDocument();
  });

  test('renders contact info', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/idk@localish\.co\.za/i)).toBeInTheDocument();
    expect(screen.getByText(/\+27 21 123 4567/)).toBeInTheDocument();
    expect(screen.getByText(/gotham/i)).toBeInTheDocument();
  });

  test('renders quick links', () => {
    renderWithRouter(<Footer />);
    const links = ['Home', 'Profile', 'Cart', 'View Orders'];
    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test('renders current year', () => {
    renderWithRouter(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });
});
