import "./DevFeedCard.css";

function DevFeedCard({ post }) {
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
        <h4>🚀 Progress Update</h4>
        <p>{post.message}</p>

        {/* ✅ GitHub Link */}
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
        <span>🤝 Collaborate</span>
      </div>
    </div>
  );
}

export default DevFeedCard;