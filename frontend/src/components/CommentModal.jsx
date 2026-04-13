import { useEffect, useState } from "react";
import "./CommentModal.css";

function CommentModal({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  const loadComments = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/comments/${postId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/add-comment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          message,
        }),
      });

      if (res.ok) {
        setMessage("");
        await loadComments();
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <div className="comment-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER WITH CANCEL */}
        <div className="comment-header">
          <h3>Comments</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <img
                src={
                  c.user?.profile_image
                    ? `http://127.0.0.1:5000${c.user.profile_image}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                onError={(e) =>
                  (e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                }
              />
              <div>
                <strong>{c.user.full_name}</strong>
                <p>{c.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="comment-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;