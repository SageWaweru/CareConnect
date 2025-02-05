import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Update if needed

// Get school profile
export const getSchoolProfile = async (token) => {
  const response = await axios.get(`${API_URL}/school/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create school profile
export const createSchoolProfile = async (data, token) => {
  const response = await axios.post(`${API_URL}/school/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update school profile
export const updateSchoolProfile = async (data, token) => {
  const response = await axios.patch(`${API_URL}/school/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get all courses
export const getCourses = async () => {
  const response = await axios.get(`${API_URL}/courses/`);
  return response.data;
};

// Add a course
export const addCourse = async (data, token) => {
  const response = await axios.post(`${API_URL}/courses/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Approve enrollment
export const approveEnrollment = async (enrollmentId, token) => {
  const response = await axios.patch(`${API_URL}/approve-enrollment/${enrollmentId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Approve certification
export const approveCertification = async (certificationId, token) => {
  const response = await axios.patch(`${API_URL}/approve-certification/${certificationId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
