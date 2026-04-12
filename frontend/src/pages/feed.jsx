import { useEffect, useState } from "react";
import DevFeedCard from "../components/DevFeedCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load logged-in user from localStorage
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load feed posts
    fetch("http://localhost:5000/feed")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Feed fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px" }}>Developer Feed</h2>

      {posts.map((post) => (
        <DevFeedCard key={post.id} post={post} user={user} />
      ))}
    </div>
  );
}

export default Feed;