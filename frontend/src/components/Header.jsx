import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="header-profile" ref={menuRef}>
      <img
        src="https://i.pravatar.cc/40"
        alt="profile"
        className="avatar"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="dropdown">
          <div onClick={() => navigate("/profile")}>My Profile</div>
          <div className="logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;