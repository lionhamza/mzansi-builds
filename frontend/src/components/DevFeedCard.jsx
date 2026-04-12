import "./DevFeedCard.css";
import { useState, useEffect } from "react";

import collaborateIcon from "../assets/icons/collaborate.png";
import requestedIcon from "../assets/icons/requested.png";
import starIcon from "../assets/icons/star.png";
import starredIcon from "../assets/icons/icons8-star-50.png";

function DevFeedCard({ post }) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  const savedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!savedUser) return;

    fetch(
      `http://127.0.0.1:5000/star-status/${post.project.id}/${savedUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setIsStarred(data.starred);
        setStarCount(data.star_count);
      });
  }, [post.project.id]);

  const handleStarToggle = async () => {
    if (!savedUser) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/toggle-star", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: post.project.id,
          user_id: savedUser.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsStarred(data.starred);
        setStarCount(data.star_count);
      }
    } catch (err) {
      alert("Star failed");
    }
  };

  const handleCollaborateToggle = async () => {
    if (!savedUser) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      const url = isCollaborating
        ? "http://127.0.0.1:5000/remove-collaboration"
        : "http://127.0.0.1:5000/request-collaboration";

      const res = await fetch(url, {
        method: isCollaborating ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: post.project.id,
          requester_id: savedUser.id,
        }),
      });

      if (res.ok) {
        setIsCollaborating(!isCollaborating);
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="dev-card">
      <div className="dev-card-header">
        <div className="dev-user">
          <img src={post.user.profile_image} alt="avatar" />

          <div className="dev-user-info">
            <strong>{post.user.full_name}</strong>
            <span className="time">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="project-badge">{post.project.title}</div>
      </div>

      <div className="dev-card-body">
        <h4>
          {post.post_type === "help"
            ? "🆘 Asked for Help"
            : "🚀 Progress Update"}
        </h4>

        <p>{post.message}</p>

        <div className="tech-row">
          {post.project.tech_stack?.split(",").map((tech, i) => (
            <span key={i}>{tech.trim()}</span>
          ))}
        </div>
      </div>

      <div className="dev-card-footer">
        <span className="star-btn" onClick={handleStarToggle}>
          <img
            src={isStarred ? starredIcon : starIcon}
            alt="star"
            className="star-icon"
          />
          {starCount}
        </span>

        <span>💬 Comment</span>

        <span
          className={`collab-btn ${isCollaborating ? "requested" : ""}`}
          onClick={handleCollaborateToggle}
        >
          <img
            src={isCollaborating ? requestedIcon : collaborateIcon}
            alt="collab"
            className="collab-icon"
          />

          {loading
            ? "Loading..."
            : isCollaborating
            ? "Collaborating"
            : "Collaborate"}
        </span>
      </div>
    </div>
  );
}

export default DevFeedCard;