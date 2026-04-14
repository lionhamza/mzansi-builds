import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./messages.css";

function ProjectChat() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const loadMessages = () => {
    fetch(`http://localhost:5000/project-chat/${id}/${user.id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  // Auto refresh messages
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    fetch("http://localhost:5000/send-project-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: id,
        user_id: user.id,
        message: text,
      }),
    }).then(() => {
      setText("");
      loadMessages();
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="project-chat">
      <h3>Project Chat</h3>

      <div className="chat-messages">
        {messages.map((m) => {
          const isMe = m.user.id === user.id;

          const time = new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={m.id}
              className={`chat-row ${isMe ? "me" : "other"}`}
            >
              <div className="chat-bubble">
                {!isMe && (
                  <div className="sender-name">{m.user.name}</div>
                )}

                <div className="chat-text">{m.message}</div>

                <div className="time">{time}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ProjectChat;