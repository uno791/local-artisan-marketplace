// import { render, screen, fireEvent } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import NavBar from "../components/HomePageComp/NavBar";

// jest.mock("../../assets/localish-logo.png", () => "logo-mock.png");

// test("renders all navigation links", () => {
//   render(
//     <MemoryRouter>
//       <NavBar />
//     </MemoryRouter>
//   );

//   expect(screen.getByText("Home")).toBeInTheDocument();
//   expect(screen.getByText("Search")).toBeInTheDocument();
//   expect(screen.getByText("Cart")).toBeInTheDocument();
//   expect(screen.getByText("Profile")).toBeInTheDocument();
// });

// test("menu toggle opens and closes mobile menu", () => {
//   render(
//     <MemoryRouter>
//       <NavBar />
//     </MemoryRouter>
//   );

//   const toggleButton = screen.getByRole("button");

//   // Menu should not be visible initially
//   expect(screen.queryByText("Home")).toBeVisible(); // Always visible for desktop

//   // Click to open menu
//   fireEvent.click(toggleButton);
//   expect(screen.getByText("Cart")).toBeInTheDocument();

//   // Click backdrop to close
//   const backdrop = screen.getByRole("presentation", { hidden: true }) || screen.getByTestId("backdrop");
//   fireEvent.click(backdrop);
// });

// test("clicking a link closes the menu", () => {
//   render(
//     <MemoryRouter>
//       <NavBar />
//     </MemoryRouter>
//   );

//   const toggleButton = screen.getByRole("button");
//   fireEvent.click(toggleButton);

//   const profileLink = screen.getByText("Profile");
//   fireEvent.click(profileLink);

//   // Optionally: test that `menuOpen` state is false by checking classNames if exposed/testable
// });

// test("renders logo image", () => {
//   render(
//     <MemoryRouter>
//       <NavBar />
//     </MemoryRouter>
//   );

//   const logoImg = screen.getByAltText("Localish logo");
//   expect(logoImg).toHaveAttribute("src", "logo-mock.png");
// });
