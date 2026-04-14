import { useEffect, useState } from "react";
import "./celebration.css";
import { FaGithub } from "react-icons/fa";
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
  const ReadMoreText = ({ text, maxChars = 140 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxChars;
  const displayText = expanded || !isLong
    ? text
    : text.substring(0, maxChars) + "...";

  return (
    <p className="project-desc">
      {displayText}
      {isLong && (
        <span
          className="read-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Show less" : " Read more"}
        </span>
      )}
    </p>
  );
};
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
    p.user?.profile_image
      ? `http://127.0.0.1:5000${p.user.profile_image}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt=""
  onError={(e) =>
    (e.target.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png")
  }
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
            <ReadMoreText text={p.description} />

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
    <FaGithub size={18} />
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