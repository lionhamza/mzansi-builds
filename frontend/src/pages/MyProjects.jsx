import { useEffect, useState } from "react";
import "./myprojects.css";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const [editData, setEditData] = useState({});
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`http://localhost:5000/my-projects/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const openModal = (project, type) => {
    if (type === "edit") setEditData(project);
    setModal({ projectId: project.id, type });
  };

  const closeModal = () => {
    setModal(null);
    setMessage("");
  };

  const submitPost = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        type: modal.type === "progress" ? "progress" : "help",
        user_id: user.id,
        project_id: modal.projectId,
      }),
    })
      .then((res) => res.json())
      .then(() => closeModal());
  };

  const saveEdit = () => {
    fetch(`http://localhost:5000/update-project/${modal.projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    }).then(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === modal.projectId ? { ...p, ...editData } : p
        )
      );
      closeModal();
    });
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
      setTimeout(() => setCelebrate(false), 3500);
    });
  };

  return (
    <div className="projects-page">
      <h2 className="page-title">My Projects</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">

            {/* TOP BAR */}
            <div className="project-top">
              <div className="status-section">
                <span className={`status ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>

                {project.status !== "Completed" && (
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
            <p>{project.description}</p>

            <div className="tech-stack">
              {project.tech_stack?.split(",").map((tech, i) => (
                <span key={i}>{tech.trim()}</span>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="project-actions">
              {project.status !== "Completed" ? (
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
              ) : (
                project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-pro-btn"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="currentColor"
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58
                        0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77
                        -1.1-.75.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25
                        1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62
                        -2.67-.31-5.47-1.34-5.47-5.93
                        0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.53.12-3.18
                        0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.41c1.02 0 2.05.14 3.01.41
                        2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18
                        .77.84 1.24 1.91 1.24 3.22
                        0 4.6-2.8 5.61-5.48 5.92.43.37.81 1.1.81 2.22
                        0 1.6-.02 2.89-.02 3.28 0 .32.22.69.83.57A12.01 12.01 0 0024 12
                        C24 5.37 18.63 0 12 0z"
                      />
                    </svg>
                    <span>Open Repository</span>
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
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