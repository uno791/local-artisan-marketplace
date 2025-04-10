import { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  postal_code: number;
  phone_no: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://artisan-api-server-ascfbqfkgccrf0ap.southafricanorth-01.azurewebsites.net/users"
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Local Artisan Marketplace</h1>
      <h2>User List</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Postal Code</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.role}</td>
                <td>{user.postal_code}</td>
                <td>{user.phone_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
