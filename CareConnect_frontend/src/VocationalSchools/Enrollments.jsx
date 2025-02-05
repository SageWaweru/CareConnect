import { useState, useEffect } from "react";
import axios from "axios";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState(null);

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem("accessToken");

  // Fetch school ID
  useEffect(() => {
    const token = getToken();
    axios
      .get("http://127.0.0.1:8000/api/school/", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      .then((res) => setSchoolId(res.data.id))
      .catch((err) => console.error("Error fetching school:", err));
  }, []);


  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://127.0.0.1:8000/api/enrollments/school/${schoolId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        setEnrollments(response.data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [schoolId]);

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      const token = getToken();
      await axios.patch(`http://127.0.0.1:8000/api/approve-enrollment/${enrollmentId}/`, null, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      // Update enrollments state
      setEnrollments(enrollments.map((enrollment) =>
        enrollment.id === enrollmentId ? { ...enrollment, approved: true } : enrollment
      ));
    } catch (error) {
      console.error("Error approving enrollment:", error);
    }
  };

  return (
    <div className="p-6 bg-beige w-full min-h-screen">
      <div className="bg-white w-3/5 mx-auto p-6 rounded-lg shadow-lg text-gray-700">
        <h2 className="text-2xl font-semibold">Enrollments</h2>
        {loading ? (
          <p>Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <p>No enrollments found.</p>
        ) : (
          <ul className="bg-alabaster text-gray-700">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id} className="border p-4 mb-4">
                <p><strong>Name:</strong> {enrollment.name}</p>
                <p><strong>Email:</strong> {enrollment.email}</p>
                <p><strong>Age:</strong> {enrollment.age}</p>
                <p><strong>Course:</strong> {enrollment.course_title}</p>
                <p><strong>Status:</strong> {enrollment.approved ? "Approved" : "Pending"}</p>

                {!enrollment.approved && (
                  <button
                    onClick={() => handleApproveEnrollment(enrollment.id)}
                    className="bg-emerald-800 text-white px-4 py-2 rounded mt-2"
                  >
                    Approve Enrollment
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Enrollments;
