import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const API_BASE_URL = "https://careconnect-1-aayd.onrender.com";

  const login = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login response:', response.data); 

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      const userDetailsResponse = await axios.get(`${API_BASE_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      console.log('User details response:', userDetailsResponse.data); 

      const currentUser = userDetailsResponse.data.find(user => user.username === formData.username);
      if (!currentUser) {
        throw new Error('User not found');
      }

      console.log('Current user:', currentUser); 

      const userData = {
        username: currentUser.username,
        role: currentUser.role,
        userId: currentUser.id, 
      };

      setUser(userData); 
      localStorage.setItem('userId', currentUser.id); 
      alert('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    setUser(null);
    alert('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
