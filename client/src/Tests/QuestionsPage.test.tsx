import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import QuestionsPage from "../Pages/QuestionsPage";
import * as UserContext from "../Users/UserContext"; // <-- So we can mock useUser

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockTags = ["Painting", "Sculpture", "Photography"];
const mockUser = {
  id: "123",
  name: "Test User",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  picture: "test.jpg",
};

const renderWithProviders = () =>
  render(
    <MemoryRouter>
      <QuestionsPage />
    </MemoryRouter>
  );

describe("QuestionsPage Component", () => {
 beforeEach(() => {
  mockedAxios.get.mockResolvedValue({ data: mockTags });
  mockedAxios.post.mockResolvedValue({ data: { message: "Success" } });

  jest
    .spyOn(UserContext, "useUser")
    .mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
    } as unknown as ReturnType<typeof UserContext.useUser>);
});

  test("renders username input", async () => {
    renderWithProviders();
    expect(await screen.findByLabelText(/enter username/i)).toBeInTheDocument();
  });

  test("allows typing username", async () => {
    renderWithProviders();
    const input = await screen.findByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "testuser" } });
    expect(input).toHaveValue("testuser");
  });

  test("renders art form buttons after fetch", async () => {
    renderWithProviders();
    for (const tag of mockTags) {
      expect(await screen.findByRole("button", { name: tag })).toBeInTheDocument();
    }
  });

  test("toggles art form button selection", async () => {
    renderWithProviders();
    const button = await screen.findByRole("button", { name: /painting/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("shows error when username is empty", async () => {
    renderWithProviders();
    const button = await screen.findByText(/apply/i);
    fireEvent.click(button);
    expect(await screen.findByText(/please enter a username/i)).toBeInTheDocument();
  });

  test("shows error when no art forms selected", async () => {
    renderWithProviders();
    const input = await screen.findByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "testuser" } });

    const button = await screen.findByText(/apply/i);
    fireEvent.click(button);

    expect(await screen.findByText(/please select at least one art form/i)).toBeInTheDocument();
  });

  test("submits successfully with valid input", async () => {
    renderWithProviders();
    const input = await screen.findByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "testuser" } });

    const tagButton = await screen.findByRole("button", { name: /sculpture/i });
    fireEvent.click(tagButton);

    const apply = await screen.findByText(/apply/i);
    fireEvent.click(apply);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/check-user"),
        expect.objectContaining({ username: "testuser" })
      );
    });
  });
});
