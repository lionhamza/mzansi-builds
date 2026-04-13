import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./MainLayout.css";

function MainLayout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/my-collab-notifications/${user?.id}`
        );

        const data = await res.json();
        setNotificationCount(data.length);
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">MzansiBuilds</h2>

        <nav>
          <NavLink to="/feed">Developer Feed</NavLink>
          <NavLink to="/my-projects">My Projects</NavLink>
          <NavLink to="/create-project">Create Project</NavLink>
          <NavLink to="/celebration-wall">Celebration Wall</NavLink>

          <NavLink to={`/profile/${user?.id}`} className="profile-link">
            <span>View Profile</span>
            <img
  src={
    user?.profile_image
      ? `http://127.0.0.1:5000${user.profile_image}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt="profile"
  className="sidebar-avatar"
  onError={(e) =>
    (e.target.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png")
  }
/>
          </NavLink>

          <NavLink to="/notifications" className="notification-link">
            <span>Notifications</span>
            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount}
              </span>
            )}
          </NavLink>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">
        <div className="topbar">
          <Header />
        </div>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;