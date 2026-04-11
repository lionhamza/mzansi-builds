import { useEffect, useState } from "react";
import "./celebration.css";

function CelebrationWall() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/celebration-wall")
      .then((res) => res.json())
      .then((data) => {
        console.log("Celebration data:", data); // debug
        setProjects(data);
      });
  }, []);

  return (
    <div className="celebration-page">
      <h2 className="celebration-title">🎉 Celebration Wall</h2>

      <div className="celebration-grid">
        {projects.map((p) => (
          <div key={p.id} className="celebration-card">

            {/* Header */}
            <div className="celebration-header">
              <img
                src={
                  p.user?.profile_image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
              />
              <div>
                <h4>{p.user?.full_name || "Developer"}</h4>
                <small>
                  Completed on{" "}
                  {p.created_at
                    ? new Date(p.created_at).toDateString()
                    : "Recently"}
                </small>
              </div>
            </div>

            {/* Project Info */}
            <h3 className="project-title">{p.title}</h3>
            <p className="project-desc">{p.description}</p>

            {/* Tech Stack */}
            {p.tech_stack && (
              <div className="celebration-tech">
                {p.tech_stack.split(",").map((t, i) => (
                  <span key={i}>{t.trim()}</span>
                ))}
              </div>
            )}

            {/* GitHub Button */}
            {p.github_link && (
              <a
                href={p.github_link}
                target="_blank"
                rel="noreferrer"
                className="github-pro-btn"
              >
                <svg height="18" viewBox="0 0 16 16" width="18">
                  <path
                    fill="currentColor"
                    d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
                    0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                    -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                    .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                    0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
                    0 0 .67-.21 2.2.82a7.7 7.7 0 012.01-.27c.68 0 1.36.09 2.01.27
                    1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                    .51.56.82 1.27.82 2.15
                    0 3.07-1.87 3.75-3.65 3.95
                    .29.25.54.73.54 1.48
                    0 1.07-.01 1.93-.01 2.2
                    0 .21.15.46.55.38A8.01 8.01 0 0016 8
                    c0-4.42-3.58-8-8-8z"
                  />
                </svg>
                <span>View GitHub Repository</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CelebrationWall;