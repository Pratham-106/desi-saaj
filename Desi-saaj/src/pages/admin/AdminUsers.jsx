import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminUsers.css";
import axios from "axios";
import toast from "react-hot-toast";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ✅ ALWAYS READ ADMIN TOKEN SAFELY */
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");

  useEffect(() => {
    if (!adminInfo?.token) {
      toast.error("Admin not authenticated");
      return;
    }
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  /* =========================
     FETCH USERS (ADMIN)
  ========================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE USER (ADMIN)
  ========================= */
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <AdminLayout>
      <h1>Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <p>{users.length} total users registered.</p>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
