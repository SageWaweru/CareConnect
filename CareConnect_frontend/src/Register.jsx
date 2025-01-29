import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' , role: 'customer',});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/register/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.message);
      navigate('/login');

    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        setMessage(error.response.data.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige">
      <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-stone-50 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-emeraldDark">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark"
        />
        <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="w-full p-2 mb-4 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emeraldDark"
        >
        <option value="" disabled>
            Select your role
        </option>    
        <option value="customer">Customer</option>
        <option value="caretaker">Caretaker</option>
        <option value="vocational_school">Vocational School</option>
        </select>
        <button 
          type="submit" 
          className="w-full bg-coral text-white p-2 rounded-md hover:bg-emeraldDark transition"
        >
          Register
        </button>
        {message && <p className="mt-4 text-center text-emerald-600">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
