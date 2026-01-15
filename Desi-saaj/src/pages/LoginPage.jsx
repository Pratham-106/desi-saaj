import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUser } from "../context/user/useUser";
import toast from "react-hot-toast";
import "./../css/Auth.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/users/login`, { email, password });

      login(data);
      toast.success("Welcome back!");
      const dest = location.state?.from || "/";
      navigate(dest);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form" aria-live="polite">
      <h2>Welcome back</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 18 }}>
        Sign in to access your account and orders
      </p>

      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/register">Create an account</Link> · <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </form>
    </div>
  );
}
