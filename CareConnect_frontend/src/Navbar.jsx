import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <>
    <nav className="bg-white py-4 px-6 shadow-lg  ">
      <div className="flex justify-between items-center container mx-auto">
        <Link to="/home" className="text-2xl hover:text-coral text-emeraldDark font-semibold">CareConnect</Link>

        <div className="space-x-4">
          {/* If the user is logged in, show specific links */}
          {user ? (
            <>

              {/* Role-specific links */}
              {user.role === 'admin' && (
                <Link to="/home" className="hover:text-coral text-emeraldDark">Admin Dashboard</Link>
              )}
              {user.role === 'customer' && (
                <>
                <Link to="/home" className="hover:text-coral text-emeraldDark">Customer Dashboard</Link>
                <Link to="/caretakers" className="hover:text-coral text-emeraldDark">Caretakers</Link>
               </>
              )}
              {user.role === 'caretaker' && (
                <>
                <Link to="/home" className="hover:text-coral text-emeraldDark">Caretaker Dashboard</Link>
                <Link to="/caretaker-profile" className="hover:text-coral text-emeraldDark">Profile</Link>

                </>
              )}
              {user.role === 'vocational_school' && (
                <Link to="/home" className="hover:text-coral text-emeraldDark">Vocational School Dashboard</Link>
              )}

              {/* Logout button */}
              <span role='button' onClick={handleLogout} className="hover:text-coral text-emeraldDark">Logout</span>
            </>
          ) : (
            <>
              <Link to="/home"  className="hover:text-coral text-emeraldDark">Home</Link>
              <Link to="/login" className="hover:text-coral text-emeraldDark">Login</Link>
              <Link to="/register" className="hover:text-coral text-emeraldDark">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav></>
  );
};

export default Navbar;
