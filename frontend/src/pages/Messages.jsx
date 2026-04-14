import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./messages.css";

function Messages() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/projects-filter/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const all = [...data.mine, ...data.collaborating];
        setProjects(all);
      });
  }, [user.id]);

  return (
    <div className="messages-page">
      <h2 className="messages-title">Project Messages</h2>

      <div className="chat-list">
        {projects.map((p) => (
          <ChatPreview key={p.id} project={p} user={user} />
        ))}
      </div>
    </div>
  );
}

function ChatPreview({ project, user }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch(
      `http://localhost:5000/project-chat-allowed/${project.id}/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => setAllowed(data.allowed));
  }, [project.id, user.id]);

  if (!allowed) return null;

  return (
    <Link to={`/project-chat/${project.id}`} className="chat-preview">
      <div className="chat-preview-content">
        <div>
          <h4>{project.title}</h4>
          <small>Open project group chat</small>
        </div>

        <div className="chat-arrow">→</div>
      </div>
    </Link>
  );
}

export default Messages;