import { render, screen } from "@testing-library/react";
import { AdminDashboard } from "../Pages/AdminDashboard";

describe("AdminDashboard", () => {
  it("renders the dashboard with all components", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sales Analytics")).toBeInTheDocument();
    expect(screen.getByText("User Reports")).toBeInTheDocument();
    expect(screen.getByText("Seller Verification")).toBeInTheDocument();
    expect(screen.getByText("R245,000")).toBeInTheDocument();
    expect(screen.getByText("R28,400")).toBeInTheDocument();
    expect(screen.getByText("R6,800")).toBeInTheDocument();
    expect(screen.getByText("Sales Graph")).toBeInTheDocument();
  });
});
