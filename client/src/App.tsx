import UserTable from "./UserTable";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";

function App() {
  return (
    // <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    //   <h1>Local Artisan Marketplace</h1>
    //   <h2>User List</h2>
    //   <UserTable />
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/LogInPage" element={<LoginPage />} />
        <Route path="/QuestionsPage" element={<QuestionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
