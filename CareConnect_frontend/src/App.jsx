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
import CaretakerProfileDetails from './CaretakerProfileDetails';
import ReviewForm from './ReviewForm';
import CaretakerReviews from './CaretakerReviews';
import CaregiverChats from './CaregiverChats';
import MessagesPage from './MessagesPage';
import JobApplications from './JobApplications';
import CreateJobPost from './CreateJobPost';
import CustomerJobApplications from './CustomerJobApplications';
import SchoolProfile from './VocationalSchools/SchoolProfile';
import CourseManagement from './VocationalSchools/CourseManagement';
import SchoolList from './VocationalSchools/SchoolsList';
import CoursesPage from './VocationalSchools/CoursesPage';
import Enrollments from './VocationalSchools/Enrollments';

function App() {

  return (    
<AuthProvider>
  <Router>
  <Navbar/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/createjob" element={<CreateJobPost />} />
      <Route path="/applyjob" element={<JobApplications />} />
      <Route path='/customer-jobs' element={<CustomerJobApplications/>} />
      <Route path='/caretakers' element={<CaretakerProfiles/>} />
      <Route path="/caretaker/:id" element={<CaretakerProfileDetails />} />
      <Route path="/caretaker-profile-create" element={<Profile />} />
      <Route path="/caretaker-profile" element={<ProfileView />} />
      <Route path="/caregiver-chats" element={<CaregiverChats />} />
      <Route path="/messages/:sender" element={<MessagesPage />} />
      <Route path='/caretaker/:caretakerId/reviews' element={<CaretakerReviews/>} />
      <Route path="/review/:id" element={<ReviewForm />} />
      <Route path="/courses" element={<CourseManagement />} />
      <Route path="/School" element={<SchoolProfile />} />
      <Route path="/VocationalSchool" element={<SchoolList />} />
      <Route path="/schools/:schoolId/courses" element={<CoursesPage />}/>
      <Route path="/enrollments" element={<Enrollments />}/>




      {/* <Route path="/schools" element={<VocationalSchoolsPage />} />
      <Route path="/schools/:id" element={<SchoolDetail />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/schools/manage/:id?" element={<ManageSchoolPage />} />
      <Route path="/courses/add" element={<AddCoursePage />} /> */}
    </Routes>
  </Router>
</AuthProvider>  )
}

export default App
