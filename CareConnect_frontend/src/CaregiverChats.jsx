import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaregiverChats = () => {
  const [chats, setChats] = useState([]);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  const API_BASE_URL = "https://careconnect-2-j2tv.onrender.com";

  

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/messages/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const allMessages = response.data.all_messages || [];

        const groupedConversations = {};
        const uniqueUserIds = new Set();

        allMessages.forEach((message) => {
          const otherUserId =
            message.sender === parseInt(loggedInUserId)
              ? message.receiver
              : message.sender;

          uniqueUserIds.add(otherUserId);

          if (!groupedConversations[otherUserId]) {
            groupedConversations[otherUserId] = [];
          }

          groupedConversations[otherUserId].push(message);
        });

        for (const userId in groupedConversations) {
          groupedConversations[userId].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
        }

        const sortedChats = Object.entries(groupedConversations)
          .map(([userId, conversation]) => ({
            userId,
            latestMessage: conversation[0] || null,  
          }))
          .filter(({ latestMessage }) => latestMessage !== null) 
          .sort((a, b) => {
            const latestMessageA = a.latestMessage?.timestamp;
            const latestMessageB = b.latestMessage?.timestamp;
            return new Date(latestMessageB) - new Date(latestMessageA);
          });

        setChats(sortedChats);

        fetchUsernames([...uniqueUserIds]);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  const fetchUsernames = async (userIds) => {
    try {
      const responses = await Promise.all(
        userIds.map((id) =>
          axios.get(`${API_BASE_URL}/api/users/${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }).catch(error => {
            console.error(`Error fetching user ${id}:`, error.response?.data || error.message);
            return null; 
          })
        )
      );
  
      const userMap = {};
      responses.forEach((res) => {
        if (res && res.data) {
          userMap[res.data.id] = res.data.username; 
        }
      });
  
      setUsernames(userMap);
    } catch (error) {
      console.error("Error in fetchUsernames:", error.response?.data || error.message);
    }
  };

  return (
    <div className='w-full p-6 min-h-screen bg-beige'>
      <div className="p-6 max-w-2xl bg-white rounded-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
        <div>
          {chats.length > 0 ? (
            chats.map(({ userId, latestMessage }) => (
              <div
                key={userId}
                className="cursor-pointer p-4 border rounded-md my-2 hover:bg-gray-200"
                onClick={() => navigate(`/messages/${userId}`)}
              >
                <h2 className="text-xl font-bold">
                  Conversation with {usernames[userId] || `Customer ${userId}`}
                </h2>

                {/* Display the latest message */}
                {latestMessage && (
                  <div className="mb-3">
                    <div
                      className={`message p-3 rounded-lg ${
                        latestMessage.sender === parseInt(loggedInUserId)
                          ? "bg-emerald-800 text-white"
                          : "bg-alabaster text-gray-700"
                      }`}
                    >
                      <p>{latestMessage.content}</p>
                      <div className="text-xs">{new Date(latestMessage.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No chats available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverChats;
