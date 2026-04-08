import { useEffect, useState } from "react";
import "./celebration.css";

function CelebrationWall() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/celebration-wall")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <div className="celebration-page">
      <h2 className="celebration-title">🎉 Celebration Wall</h2>

      <div className="celebration-grid">
        {projects.map((p) => (
          <div key={p.id} className="celebration-card">
            <div className="celebration-header">
              <img src={p.user.profile_image} alt="" />
              <div>
                <h4>{p.user.full_name}</h4>
                <small>
                  Completed on {new Date(p.created_at).toDateString()}
                </small>
              </div>
            </div>

            <h3>{p.title}</h3>
            <p>{p.description}</p>

            <div className="celebration-tech">
              {p.tech_stack?.split(",").map((t, i) => (
                <span key={i}>{t.trim()}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CelebrationWall;