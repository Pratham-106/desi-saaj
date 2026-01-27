import { useState } from "react";
import axios from "axios";
import "./../css/ContactPage.css";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/contact`, form);

      alert(
        "Your message has been sent successfully. We’ll get back to you soon 💚"
      );

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact error:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1>Get in Touch</h1>
        <p className="sub-text">
          Have questions or need assistance? We're here to help you.
        </p>

        <form onSubmit={submitHandler} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="contact-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
