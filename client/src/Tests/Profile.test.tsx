// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import Profile from "../Pages/Profile";
// import SellerSignup from "../Pages/SellerSignup"; // use real or dummy route target
// import axios from "axios";
// import { UserProvider } from "../Users/UserContext";

// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.mock("../Users/UserContext", () => ({
//   ...jest.requireActual("../Users/UserContext"),
//   useUser: () => ({
//     user: { username: "testuser" },
//   }),
// }));

// test("renders Profile page and fetches user data", async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       postal_code: 12345,
//       phone_no: "0812345678",
//     },
//   });

//   render(
//     <UserProvider>
//       <MemoryRouter initialEntries={["/profile"]}>
//         <Routes>
//           <Route path="/profile" element={<Profile />} />
//         </Routes>
//       </MemoryRouter>
//     </UserProvider>
//   );

//   // Wait for async content to load
//   await waitFor(() => {
//     expect(screen.getByText("0812345678")).toBeInTheDocument();
//     expect(screen.getByText("12345")).toBeInTheDocument();
//   });
// });

// test("clicking Edit opens modal", async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       postal_code: 12345,
//       phone_no: "0812345678",
//     },
//   });

//   render(
//     <UserProvider>
//       <MemoryRouter initialEntries={["/profile"]}>
//         <Routes>
//           <Route path="/profile" element={<Profile />} />
//         </Routes>
//       </MemoryRouter>
//     </UserProvider>
//   );

//   // Wait for data
//   await screen.findByText("0812345678");

//   const editButton = screen.getByRole("button", { name: /edit/i });
//   fireEvent.click(editButton);

//   expect(
//     screen.getByRole("button", { name: /close/i })
//   ).toBeInTheDocument(); // Close button in EditInfo modal
// });

// test("clicking Become a Seller navigates to SellerSignup", async () => {
//   mockedAxios.get.mockResolvedValueOnce({
//     data: {
//       postal_code: 12345,
//       phone_no: "0812345678",
//     },
//   });

//   render(
//     <UserProvider>
//       <MemoryRouter initialEntries={["/profile"]}>
//         <Routes>
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/seller-signup" element={<div>Seller Signup Page</div>} />
//         </Routes>
//       </MemoryRouter>
//     </UserProvider>
//   );

//   const button = await screen.findByRole("button", { name: /become a seller/i });
//   fireEvent.click(button);

//   expect(
//     await screen.findByText("Seller Signup Page")
//   ).toBeInTheDocument();
// });
