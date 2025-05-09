import React, { useState } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import { Link, useLocation } from "react-router-dom";
import ReportSearchBar from "../components/UserReportsComp/SearchBar";
import UserReportCard from "../components/UserReportsComp/UserReportCard";

// Sample data (replace with real fetch if needed)
const mockReports = [
  {
    status: "pending",
    date: "2025-02-15",
    reporter: "Sarah Chen",
    seller: "Antique Finds",
    product: "Vintage Lamp",
    reason: "Misleading Description",
    details: "Item color significantly different from photos",
    evidenceUrl: "https://via.placeholder.com/800x400.png",
  },
  {
    status: "investigating",
    date: "2025-02-14",
    reporter: "James Wilson",
    seller: "Heritage Collectibles",
    product: "Antique Chair",
    reason: "Item Not As Described",
    details: "Significant damage not mentioned in listing",
    evidenceUrl: "https://via.placeholder.com/800x400.png",
  },
];

const UserReports: React.FC = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const filteredReports = mockReports.filter((r) =>
    r.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>

        <Link
          to="/AdminDashboard"
          className={`${styles.navItem} ${
            isActive("/AdminDashboard") ? styles.navItemActive : ""
          }`}
        >
          Sales Analytics
        </Link>

        <Link
          to="/UserReports"
          className={`${styles.navItem} ${
            isActive("/UserReports") ? styles.navItemActive : ""
          }`}
        >
          User Reports
        </Link>

        <Link
          to="/SellerVerification"
          className={`${styles.navItem} ${
            isActive("/SellerVerification") ? styles.navItemActive : ""
          }`}
        >
          Seller Verification
        </Link>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        <h1>User Reports</h1>
        <ReportSearchBar value={search} onChange={setSearch} />
        <div className={styles.cards}>
          {filteredReports.map((report, i) => (
            <UserReportCard key={i} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserReports;
