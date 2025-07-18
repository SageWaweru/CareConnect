import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [senderUsername, setSenderUsername] = useState(""); 
  const { sender } = useParams(); 
  const navigate = useNavigate();
  const loggedInUserId = parseInt(localStorage.getItem("userId"), 10);
  const API_BASE_URL = "https://careconnect-2-j2tv.onrender.com";
  const [replyToMessageId, setReplyToMessageId] = useState(null); 

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/messages/${sender}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setMessages(response.data.all_messages || []);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [sender, navigate]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/users/${sender}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setSenderUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Error fetching sender's username:", error);
      });
  }, [sender]);

  const handleReply = () => {
    if (!reply.trim() || !messageId) {
      return; 
    }
  
    const data = {
      content: reply,
      reply_to: { message: messageId }, 
    };
  
    console.log("Sending reply:", data);
  
    axios
      .post(`${API_BASE_URL}/api/messages/${messageId}/replies/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        setReply(""); 
        setReplyToMessageId(null);
      })
      .catch((error) => {
        console.error("Error sending reply:", error.response || error);
      })
      .finally(() => {
        axios
          .get(`${API_BASE_URL}/api/messages/${sender}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((resp) => {
            setMessages(resp.data.all_messages || []);
          })
          .catch((err) => console.error("Error fetching updated messages:", err));
      });
  };
  const handleReplyToMessage = (messageId) => {
    setReplyToMessageId(messageId);
    setMessageId(messageId); 
    setReply(""); 
  };

  return (
    <div className="w-full bg-beige p-6 min-h-screen">
      <div className="p-6 max-w-2xl shadow-lg bg-white rounded-lg mx-auto">
      <div
          role="button"
          className="float-right text-4xl text-coral hover:text-emerald-800 transition"
          onClick={() => navigate(`/caregiver-chats`)}
        >
          &times;
        </div>

        <h2 className="text-2xl font-bold mb-4">Conversation with {senderUsername || "User"}</h2>
        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((item) => {
              const isFromLoggedInUser = item.sender === loggedInUserId;
              return (
                <div
                  key={item.id}
                  className={`flex ${isFromLoggedInUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md max-w-[75%] ${
                      isFromLoggedInUser ? "bg-emerald-800 text-white" : "bg-alabaster text-gray-700"
                    }`}
                  >
                    <p>{item.content}</p>
                    <span className="text-xs block mt-1 opacity-70">{new Date(item.timestamp).toLocaleString()}</span>

                    {/* Show reply button for messages not from the logged-in user */}
                    {!isFromLoggedInUser && (
                      <button
                        className="text-xs text-white bg-coral mt-2"
                        onClick={() => handleReplyToMessage(item.id)} // Set the messageId for replying
                      >
                        Reply
                      </button>
                    )}

                    {/* Display nested replies */}
                    {item.replies && item.replies.length > 0 && (
                      <div className="mt-2 pl-4 space-y-2">
                        {item.replies.map((rep) => {
                          const isRepFromLoggedInUser = rep.sender === loggedInUserId;
                          return (
                            <div
                              key={rep.id}
                              className={`p-2 rounded-lg shadow-md max-w-[75%] ${
                                isRepFromLoggedInUser ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                              }`}
                            >
                              <p>{rep.content}</p>
                              <span className="text-xs block mt-1 opacity-70">{new Date(rep.timestamp).toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-700">No messages found.</p>
          )}
        </div>

        {/* Show reply textarea if replying to a message */}
        {replyToMessageId && (
          <div className="mt-6">
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            ></textarea>
            <button
              className="mt-2 px-4 py-2 bg-emerald-800 text-white hover:bg-coral rounded-md"
              onClick={handleReply}
            >
              Send Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
