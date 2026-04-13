import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import DevFeedCard from "../components/DevFeedCard";
import "./viewprofile.css";

const API = "http://127.0.0.1:5000";

function ViewProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetch(`${API}/profile/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [id]);

  useEffect(() => {
  fetch("http://127.0.0.1:5000/session-check", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => console.log("SESSION:", data));
}, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API}/update-profile-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    setProfile((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        profile_image: data.profile_image,
      },
    }));
  };

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
  src={
    profile.user.profile_image
      ? `${API}${profile.user.profile_image}`
      : `${API}/static/profile_images/default.png`
  }
  alt=""
  className="profile-avatar"
/>

          {Number(id) === Number(profile.user.id) && (
            <>
              <div
                className="edit-avatar"
                onClick={() => fileInputRef.current.click()}
              >
                ✎
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </>
          )}
        </div>

        <div className="profile-info">
          <h2>{profile.user.full_name}</h2>
          <p className="email">{profile.user.email}</p>

          <div className="quick-stats">
            <div>
              <span className="stat-number">{profile.projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>

            <div>
              <span className="stat-number">{profile.posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="activity-title">Developer Activity</h3>

      <div className="activity-feed">
        {profile.posts.length === 0 ? (
          <p className="no-activity">No activity yet.</p>
        ) : (
          profile.posts.map((post) => (
            <DevFeedCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

export default ViewProfile;