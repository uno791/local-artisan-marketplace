import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UserReports from "../Pages/UserReports";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const reportsMock = [
  {
    status: 0,
    date: "2025-05-15",
    reporter: "user1",
    seller: "sellerA",
    product: "Fake Vase",
    reason: "Fraud",
    details: "Fake product",
    evidenceUrl: "",
    productId: 1,
  },
  {
    status: 1,
    date: "2025-05-14",
    reporter: "user2",
    seller: "sellerB",
    product: "Abstract Painting",
    reason: "Misleading",
    details: "Misleading title",
    evidenceUrl: "http://example.com/image.jpg",
    productId: 2,
  },
];

describe("UserReports Page", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: reportsMock });
    mockedAxios.put.mockResolvedValue({});
    mockedAxios.post.mockResolvedValue({});
    mockedAxios.delete.mockResolvedValue({});
  });

  test("renders fetched reports by product name", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: /fake vase/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /abstract painting/i })).toBeInTheDocument();
  });

  test("search filters the reports by product name", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    await screen.findByRole("heading", { name: /fake vase/i });

    const input = screen.getByPlaceholderText(/search reports/i);
    fireEvent.change(input, { target: { value: "Fake" } });

    expect(screen.getByRole("heading", { name: /fake vase/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /abstract painting/i })).not.toBeInTheDocument();
  });

  test("clicking investigate updates status", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    const btn = await screen.findByRole("button", { name: /investigate/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining("/update-report-status"),
        expect.objectContaining({ status: 1 })
      );
    });
  });

  test("clicking finish investigating goes to decision", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    const btn = await screen.findByRole("button", { name: /finish investigating/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining("/update-report-status"),
        expect.objectContaining({ status: 2 })
      );
    });
  });



  test("delete product sets status to complete", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    await screen.findByRole("heading", { name: /abstract painting/i });

    const finishBtn = screen.getByRole("button", { name: /finish investigating/i });
    fireEvent.click(finishBtn);

    const deleteBtn = await screen.findByRole("button", { name: /delete product/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/delete-product/2")
      );
    });
  });

  test("keep product triggers mark-product-kept and completes", async () => {
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    await screen.findByRole("heading", { name: /abstract painting/i });

    const finishBtn = screen.getByRole("button", { name: /finish investigating/i });
    fireEvent.click(finishBtn);

    const keepBtn = await screen.findByRole("button", { name: /keep product/i });
    fireEvent.click(keepBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/mark-product-kept"),
        { product_id: 2 }
      );
    });
  });

  test("error popup displays on status update fail", async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error("Update failed"));
    render(<MemoryRouter><UserReports /></MemoryRouter>);
    const btn = await screen.findByRole("button", { name: /investigate/i });
    fireEvent.click(btn);
    expect(await screen.findByRole("alert")).toHaveTextContent("Failed to update status.");
  });
});
