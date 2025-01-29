import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Navbar from './Navbar';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Profile from './caretaker/Profile';
import ProfileView from './caretaker/ProfileView';
import CaretakerProfiles from './CartakerProfiles';

function App() {

  return (    
<AuthProvider>
  <Router>
  <Navbar/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path='/caretakers' element={<CaretakerProfiles/>} />
      <Route path="/caretaker-profile-create" element={<Profile />} />
      <Route path="/caretaker-profile" element={<ProfileView />} />
    </Routes>
  </Router>
</AuthProvider>  )
}

export default App
