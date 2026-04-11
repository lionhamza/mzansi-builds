import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DevFeedCard from "../components/DevFeedCard";
import "./viewprofile.css";

function ViewProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [id]);

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <img src={profile.user.profile_image} alt="" />

        <div className="profile-info">
          <h2>{profile.user.full_name}</h2>
          <p className="email">{profile.user.email}</p>

          {profile.user.bio && (
            <p className="bio">{profile.user.bio}</p>
          )}

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

      {/* ACTIVITY TITLE */}
      <h3 className="activity-title">Developer Activity</h3>

      {/* ACTIVITY FEED */}
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