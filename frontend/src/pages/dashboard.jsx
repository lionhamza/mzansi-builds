import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create Project",
      text: "Start a new project and share it with the community.",
      route: "/create-project",
      icon: "🚀",
    },
    {
      title: "Developer Feed",
      text: "See what other developers are building.",
      route: "/feed",
      icon: "💬",
    },
    {
      title: "My Projects",
      text: "Manage and update your active projects.",
      route: "/my-projects",
      icon: "📁",
    },
    {
      title: "Celebration Wall",
      text: "See completed projects from the community.",
      route: "/celebration",
      icon: "🎉",
    },
  ];

  return (
    <>
      <Header />

      <div className="dashboard">
        <div className="hero">
          <h2>Welcome back, Hamza 👋</h2>
          <p>Build in public. Collaborate. Celebrate progress.</p>
        </div>

        <div className="grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => navigate(card.route)}
            >
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;