import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import ReportSearchBar from "../components/UserReportsComp/SearchBar";
import UserReportCard from "../components/UserReportsComp/UserReportCard";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";
import { baseURL } from "../config";

// define structure for a report
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

// user reports component for admin
const UserReports: React.FC = () => {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  // fetch reports when the page is loaded or location changes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${baseURL}/user-reports`);

        // format reports into consistent structure
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

  // filter reports based on search input and status
  const filteredReports = reports.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) && r.status !== 3 // exclude reports marked complete
  );

  return (
    <section className={styles.wrapper}>
      {/* sidebar navigation for admin */}
      <AdminSidebar />

      <section className={styles.container}>
        {/* page heading */}
        <header>
          <h1>User Reports</h1>
        </header>

        {/* search bar */}
        <section style={{ marginBottom: "1rem" }}>
          <ReportSearchBar value={search} onChange={setSearch} />
        </section>

        {/* report results section */}
        <section aria-label="Report Results">
          {loading && <p>Loading reports...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && filteredReports.length === 0 && <p>No reports found.</p>}

          {/* render report cards */}
          <section className={styles.cards}>
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
