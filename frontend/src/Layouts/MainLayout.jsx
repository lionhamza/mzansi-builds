import { Outlet, NavLink } from "react-router-dom";
import Header from "../components/Header";   // ✅ import it
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="logo">MzansiBuilds</h2>

        <nav>
          <NavLink to="/feed">Developer Feed</NavLink>
          <NavLink to="/my-projects">My Projects</NavLink>
          <NavLink to="/create-project">Create Project</NavLink>
         <NavLink to="/celebration-wall">Celebration Wall</NavLink>
        </nav>
      </aside>

      <div className="main-area">
        {/* ✅ TOPBAR NOW EXISTS */}
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