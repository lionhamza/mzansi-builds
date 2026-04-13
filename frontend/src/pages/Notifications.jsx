import { useEffect, useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/my-collab-notifications/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, [user.id]);

  const handleAction = async (id, action) => {
    try {
      await fetch(`http://127.0.0.1:5000/collab-action/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      // remove from UI after action
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-page">
      <h2>🔔 Collaboration Requests</h2>

      {requests.length === 0 && (
        <div className="empty-state">
          No collaboration requests yet.
        </div>
      )}

      {requests.map((r) => (
        <div key={r.id} className="notif-card">
          <img
  src={
    r.requester_image
      ? `http://127.0.0.1:5000${r.requester_image}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt="avatar"
  onError={(e) =>
    (e.target.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png")
  }
/>

          <div className="notif-info">
            <strong>{r.requester_name}</strong>
            <p>wants to collaborate on</p>
            <b>{r.project_title}</b>
          </div>

          <div className="notif-actions">
            <button
              className="accept-btn"
              onClick={() => handleAction(r.id, "accept")}
            >
              Accept
            </button>
            <button
              className="decline-btn"
              onClick={() => handleAction(r.id, "decline")}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;