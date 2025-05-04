import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "../Pages/Home";
import { UserProvider } from "../Users/UserContext"; // adjust if needed

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Users/UserContext", () => ({
  ...jest.requireActual("../Users/UserContext"),
  useUser: () => ({
    user: { username: "testuser" },
  }),
}));

test("renders Home page with products from API", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: [
      {
        product_id: 1,
        product_name: "Mock Product",
        description: "Mock Description",
        price: 100,
        image_url: "http://example.com/product.jpg",
        username: "seller1",
      },
      {
        product_id: 2,
        product_name: "Second Product",
        description: "Another Description",
        price: 200,
        image_url: "http://example.com/product2.jpg",
        username: "seller2",
      },
    ],
  });

  render(
    <UserProvider>
      <MemoryRouter initialEntries={["/Home"]}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );

  expect(await screen.findByText("Mock Product")).toBeInTheDocument();
  expect(screen.getByText("Second Product")).toBeInTheDocument();
  expect(screen.getByText("seller1")).toBeInTheDocument();
  expect(screen.getByText("R100")).toBeInTheDocument();
});
