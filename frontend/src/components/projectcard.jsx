import { useState } from "react";
import "./ProjectCard.css";

function ProjectCard({ project, user }) {
  const [message, setMessage] = useState("");

  const postUpdate = () => {
    fetch("http://localhost:5000/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        user_id: user.id,
        project_id: project.id
      })
    }).then(() => {
      setMessage("");
      alert("Update posted to feed!");
    });
  };

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <textarea
        placeholder="Share your progress update..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button onClick={postUpdate}>Post Update</button>
    </div>
  );
}

export default ProjectCard;