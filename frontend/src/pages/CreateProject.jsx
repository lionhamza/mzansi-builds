import { useState } from "react";
import Header from "../components/Header";
import "./CreateProject.css";

function CreateProject() {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ get logged in user

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,   // ✅ VERY IMPORTANT
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Project created successfully!");
        setFormData({
          title: "",
          description: "",
          tech_stack: "",
          github_link: "",
        });
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <>
      <Header />

      <div className="create-wrapper">
        <div className="create-card">
          <h2>Create New Project</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Description"
              rows="5"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Tech Stack"
              value={formData.tech_stack}
              onChange={(e) =>
                setFormData({ ...formData, tech_stack: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="GitHub Link"
              value={formData.github_link}
              onChange={(e) =>
                setFormData({ ...formData, github_link: e.target.value })
              }
            />

            <button type="submit">Create Project</button>
          </form>

          {message && <p className="success-msg">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default CreateProject;