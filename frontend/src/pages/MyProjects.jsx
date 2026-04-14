import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import "./myprojects.css";

function ReadMore({ text, maxChars = 140 }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const isLong = text.length > maxChars;
  const displayText =
    expanded || !isLong ? text : text.slice(0, maxChars) + "...";

  return (
    <p className="readmore-text">
      {displayText}
      {isLong && (
        <span
          className="readmore-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Show less" : " Read more"}
        </span>
      )}
    </p>
  );
}

function MyProjects() {
  const [allData, setAllData] = useState({ mine: [], collaborating: [] });
  const [filter, setFilter] = useState("mine");

  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const [editData, setEditData] = useState({});
  const [celebrate, setCelebrate] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/projects-filter/${user.id}`)
      .then((res) => res.json())
      .then((data) => setAllData(data));
  }, []);

  const projects = allData[filter];

  const openModal = (project, type) => {
    if (type === "edit") setEditData(project);
    setModal({ projectId: project.id, type });
  };

  const closeModal = () => {
    setModal(null);
    setMessage("");
  };

  const submitPost = () => {
    fetch("http://localhost:5000/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        type: modal.type === "progress" ? "progress" : "help",
        user_id: user.id,
        project_id: modal.projectId,
      }),
    }).then(() => closeModal());
  };

  const saveEdit = () => {
    fetch(`http://localhost:5000/update-project/${modal.projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    }).then(() => {
      setAllData((prev) => ({
        ...prev,
        [filter]: prev[filter].map((p) =>
          p.id === modal.projectId ? { ...p, ...editData } : p
        ),
      }));
      closeModal();
    });
  };

  const markComplete = (id) => {
    fetch(`http://localhost:5000/complete-project/${id}`, {
      method: "PUT",
    }).then(() => {
      setCelebrate(true);
      setAllData((prev) => ({
        ...prev,
        [filter]: prev[filter].map((p) =>
          p.id === id ? { ...p, status: "Completed" } : p
        ),
      }));
      setTimeout(() => setCelebrate(false), 3500);
    });
  };

  return (
    <div className="projects-page">
      <h2 className="page-title">Projects</h2>

      <div className="top-filter">
        <button
          className={filter === "mine" ? "active" : ""}
          onClick={() => setFilter("mine")}
        >
          My Projects
        </button>
        <button
          className={filter === "collaborating" ? "active" : ""}
          onClick={() => setFilter("collaborating")}
        >
          Collaborating On
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-top">
              <div className="status-section">
                <span className={`status ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>

                {project.status !== "Completed" && filter === "mine" && (
                  <div
                    className="edit-pen"
                    onClick={() => openModal(project, "edit")}
                    title="Edit project"
                  >
                    ✎
                  </div>
                )}
              </div>

              <span className="date">
                {new Date(project.created_at).toDateString()}
              </span>
            </div>

            <h3>{project.title}</h3>
            <ReadMore text={project.description} />

            <div className="tech-stack">
              {project.tech_stack?.split(",").map((tech, i) => (
                <span key={i}>{tech.trim()}</span>
              ))}
            </div>

            {/* ✅ ACTIONS FOR BOTH VIEWS */}
            <div className="project-actions">
              {filter === "mine" && project.status !== "Completed" && (
                <>
                  <button
                    className="action-btn progress"
                    onClick={() => openModal(project, "progress")}
                  >
                    📌 Update Progress
                  </button>

                  <button
                    className="action-btn help"
                    onClick={() => openModal(project, "help")}
                  >
                    🤝 Ask for Help
                  </button>

                  <button
                    className="complete-btn"
                    onClick={() => markComplete(project.id)}
                  >
                    ✅ Mark Completed
                  </button>
                </>
              )}

              {/* ✅ Visible to owner AND collaborators */}
              {project.github_link && (
                <div className="completed-actions">
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-pro-btn"
                  >
                    <FaGithub className="github-icon" />
                    View Repository
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            {modal.type === "edit" && (
              <>
                <h3>Edit Project</h3>
                <input
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
                <input
                  value={editData.tech_stack || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, tech_stack: e.target.value })
                  }
                />
                <input
                  placeholder="GitHub Link"
                  value={editData.github_link || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, github_link: e.target.value })
                  }
                />
                <div className="modal-buttons">
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </>
            )}

            {(modal.type === "progress" || modal.type === "help") && (
              <>
                <h3>
                  {modal.type === "help"
                    ? "Ask for Help"
                    : "Post Progress Update"}
                </h3>
                <textarea
                  placeholder="Write here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="modal-buttons">
                  <button onClick={submitPost}>Post</button>
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {celebrate && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <h1>🎉 Project Completed! 🎉</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProjects;