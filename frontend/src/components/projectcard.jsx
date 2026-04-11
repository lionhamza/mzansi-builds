import "./DevFeedCard.css";

function DevFeedCard({ post }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleCollaborate = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/request-collab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.id,
          requester_id: user.id,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="dev-card">
      {/* Header */}
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

      {/* Body */}
      <div className="dev-card-body">
        <h4>
          {post.post_type === "help"
            ? "🆘 Asked for Help"
            : "🚀 Progress Update"}
        </h4>

        <p>{post.message}</p>

        {/* GitHub Link */}
        {post.project.github_link && (
          <a
            href={post.project.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            🔗 View Project Repository
          </a>
        )}

        {/* Tech Stack */}
        <div className="tech-row">
          {post.project.tech_stack
            ?.split(",")
            .map((tech, i) => (
              <span key={i}>{tech.trim()}</span>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="dev-card-footer">
        <span>👍 Like</span>
        <span>💬 Comment</span>

        {/* 🤝 Collaborate */}
        <span className="collab-btn" onClick={handleCollaborate}>
          🤝 Collaborate
        </span>
      </div>
    </div>
  );
}

export default DevFeedCard;