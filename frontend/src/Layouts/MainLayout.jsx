import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="logo">MzansiBuilds</h2>

        <nav>
          <NavLink to="/feed">Developer Feed</NavLink>
          <NavLink to="/my-projects">My Projects</NavLink>
          <NavLink to="/create-project">Create Project</NavLink>
          <NavLink to="/celebration">Celebration Wall</NavLink>
        </nav>
      </aside>

      <div className="main-area">
        

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;