import  { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/users/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setUsers(response.data);  // Set the users state with the data
        } catch (error) {
          setError('Error fetching users');
          console.error(error);
        }
      } else {
        setError('No access token found');
      }
    };

    fetchUsers();
  }, []);  // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.username}>{user.username} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
