import { Outlet, NavLink } from "react-router-dom";
import Header from "../components/Header";
import "./MainLayout.css";

function MainLayout() {
  const user = JSON.parse(localStorage.getItem("user"));

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
    src="https://i.pravatar.cc/30"
    alt="profile"
    className="sidebar-avatar"
  />
</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">
        {/* ✅ TOP HEADER BAR */}
        <div className="topbar">
          <Header />
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;