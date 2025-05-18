// Mock the image import directly
jest.mock('../../assets/localish-logo.png', () => 'logo-mock-path');

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../components/HomePageComp/NavBar';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('NavBar Component', () => {
  test('renders logo image', () => {
    renderWithRouter(<NavBar />);
    const logoImg = screen.getByAltText(/localish logo/i);
    expect(logoImg).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderWithRouter(<NavBar />);
    const navItems = ['Home', 'Search', 'Cart', 'Profile'];

    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('opens and closes the mobile menu', () => {
    renderWithRouter(<NavBar />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const closeButton = screen.getByLabelText(/close menu/i);
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(screen.queryByLabelText(/close menu/i)).not.toBeInTheDocument();
  });

  test('clicking a nav link closes the menu', () => {
    renderWithRouter(<NavBar />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const link = screen.getByText(/cart/i);
    fireEvent.click(link);

    expect(screen.queryByLabelText(/close menu/i)).not.toBeInTheDocument();
  });
});
