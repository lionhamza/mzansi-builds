import "./DevFeedCard.css";

function DevFeedCard({ post }) {
  const handleCollaborate = async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/request-collaboration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: post.project.id,   // ✅ CORRECT
        requester_id: user.id,         // ✅ CORRECT
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  } catch (err) {
    alert("Error sending request");
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

        <div className="tech-row">
          {post.project.tech_stack?.split(",").map((tech, i) => (
            <span key={i}>{tech.trim()}</span>
          ))}
        </div>

        {post.project.github_link && (
          <a
            href={post.project.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            🔗 View GitHub Repository
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="dev-card-footer">
        <span>👍 Like</span>
        <span>💬 Comment</span>

        {/* ✅ REAL COLLABORATE BUTTON */}
        <span className="collab-btn" onClick={handleCollaborate}>
          ✋ Collaborate
        </span>
      </div>
    </div>
  );
}

export default DevFeedCard;