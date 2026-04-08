import { useEffect, useState } from "react";
import DevFeedCard from "../components/DevFeedCard";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/feed")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px" }}>Developer Feed</h2>

      {posts.map((post) => (
        <DevFeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;