import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import mzansiIcon from "../../image/MzansiBuil-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",   // ⭐ REQUIRED FOR SESSION COOKIE
  body: JSON.stringify(formData),
});
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/create-project");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={mzansiIcon} alt="BuildMzansi Logo" className="auth-logo" />
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-link">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;