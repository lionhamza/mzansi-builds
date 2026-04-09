import { useState, useEffect } from "react";
import "./CreateProject.css";

function CreateProject() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  // ✅ LOCK SCROLL ONLY ON THE REAL SCROLL CONTAINER (.page-content)
  useEffect(() => {
    const page = document.querySelector(".page-content");
    if (page) page.classList.add("no-scroll");

    return () => {
      if (page) page.classList.remove("no-scroll");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
        }),
      });

      if (res.ok) {
        setShowPopup(true);
        setFormData({
          title: "",
          description: "",
          tech_stack: "",
          github_link: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="badge">✓</div>
            <h3>Project Created!</h3>
            <p>Your project was successfully added.</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateProject;