import { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import mzansiIcon from "../../image/MzansiBuil-logo.png";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={mzansiIcon} alt="BuildMzansi Logo" className="auth-logo" />
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

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

          <button type="submit">Register</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-link">
          Already have an account? <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;