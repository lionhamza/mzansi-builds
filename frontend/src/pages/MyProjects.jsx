import { useEffect, useState } from "react";
import "./myprojects.css";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:5000/my-projects/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const openModal = (projectId, type) => {
    setModal({ projectId, type });
  };

  const closeModal = () => {
    setModal(null);
    setMessage("");
  };

  const submitPost = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/add-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        type: modal.type,
        user_id: user.id,
        project_id: modal.projectId,
      }),
    }).then(() => closeModal());
  };

  const markComplete = (id) => {
    fetch(`http://localhost:5000/complete-project/${id}`, {
      method: "PUT",
    }).then(() => {
      setCelebrate(true);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "Completed" } : p
        )
      );

      setTimeout(() => {
        setCelebrate(false);
      }, 4000);
    });
  };

  return (
    <div className="projects-page">
      <h2 className="page-title">My Projects</h2>

      {projects.length === 0 && (
        <p className="no-projects">No projects yet...</p>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-top">
              <span className="status">{project.status}</span>
              <span className="date">
                {new Date(project.created_at).toDateString()}
              </span>
            </div>

            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="tech-stack">
              {project.tech_stack?.split(",").map((tech, i) => (
                <span key={i}>{tech.trim()}</span>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="project-actions">
              <button onClick={() => openModal(project.id, "progress")}>
                Update Progress
              </button>

              <button onClick={() => openModal(project.id, "help")}>
                Ask for Help
              </button>

              {project.status !== "Completed" && (
                <button
                  className="complete-btn"
                  onClick={() => markComplete(project.id)}
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {modal.type === "help"
                ? "Ask for Help"
                : "Post Progress Update"}
            </h3>

            <textarea
              placeholder="Write your update here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={submitPost}>Post</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 CELEBRATION OVERLAY */}
      {celebrate && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <h1>🎉 Project Completed! 🎉</h1>
            <p>You did it. Time to ship the next one 🚀</p>
            <div className="confetti"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProjects;