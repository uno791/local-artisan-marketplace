import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import ReportSearchBar from "../components/UserReportsComp/SearchBar";
import UserReportCard from "../components/UserReportsComp/UserReportCard";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";
import { baseURL } from "../config";

interface Report {
  status: number;
  date: string;
  reporter: string;
  seller: string;
  product: string;
  reason: string;
  details: string;
  evidenceUrl: string;
  productId: number;
}

const UserReports: React.FC = () => {
  // State for search input
  const [search, setSearch] = useState("");
  // State to hold all fetched reports
  const [reports, setReports] = useState<Report[]>([]);
  // Loading indicator state
  const [loading, setLoading] = useState(true);
  // Error message state
  const [error, setError] = useState("");

  // React Router location to reload on route change
  const location = useLocation();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch user reports from backend
        const res = await axios.get(`${baseURL}/user-reports`);
        // Format data to match expected shape
        const formattedReports = res.data.map((r: any) => ({
          status: r.status ?? 0,
          date: r.created_at?.split("T")[0] ?? "",
          reporter: r.reporterby_username,
          seller: r.seller_username ?? "Unknown Seller",
          product: r.product_name || r.product || "Unknown Product",
          reason: r.reason ?? "Other",
          details: r.details ?? "",
          evidenceUrl: r.evidence_url ?? "",
          productId: r.product_id || r.productId,
        }));
        setReports(formattedReports);
      } catch (err) {
        console.error("❌ Failed to fetch reports:", err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [location.key]);

  // Filter reports by search term and exclude status 3 (complete)
  const filteredReports = reports.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) && r.status !== 3
  );

  return (
    <section className={styles.wrapper}>
      <AdminSidebar />
      <section className={styles.container}>
        <header>
          <h1>User Reports</h1>
        </header>

        <section style={{ marginBottom: "1rem" }}>
          {/* Search bar to filter reports */}
          <ReportSearchBar value={search} onChange={setSearch} />
        </section>

        <section aria-label="Report Results">
          {loading && <p>Loading reports...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && filteredReports.length === 0 && <p>No reports found.</p>}

          <section className={styles.cards}>
            {/* Render UserReportCard for each filtered report */}
            {filteredReports.map((report, i) => (
              <UserReportCard key={i} {...report} />
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};

export default UserReports;
