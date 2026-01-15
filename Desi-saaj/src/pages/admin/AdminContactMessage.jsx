import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminContactMessages.css";

/* ✅ DEPLOYMENT-SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/contact`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  /* 🗑 DELETE MESSAGE */
  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/contact/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete message");
    }
  };

  return (
    <AdminLayout>
      <h1>Contact Messages</h1>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-card ${
                msg.isRead ? "read" : "unread"
              }`}
            >
              <div className="message-header">
                <h3>{msg.name}</h3>
                <span>
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="message-email">{msg.email}</p>
              <p className="message-text">{msg.message}</p>

              {!msg.isRead && (
                <span className="unread-badge">New</span>
              )}

              <button
                className="delete-btn"
                onClick={() => deleteHandler(msg._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
