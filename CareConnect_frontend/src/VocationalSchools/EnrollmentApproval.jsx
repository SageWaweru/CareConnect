import { useEffect, useState } from "react";
import axios from "axios";

const EnrollmentApproval = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/enrollments/") 
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApproval = (id, status) => {
    axios
      .patch(`http://127.0.0.1:8000/api/enrollment/${id}/`, { status }) 
      .then(() => {
        setEnrollments(enrollments.map(en => 
          en.id === id ? { ...en, status } : en
        ));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Manage Enrollments</h2>
      {enrollments.length === 0 ? (
        <p>No pending enrollments.</p>
      ) : (
        enrollments.map(enrollment => (
          <div key={enrollment.id} className="border p-4 my-2 rounded-md">
            <p><strong>Course:</strong> {enrollment.course.title}</p>
            <p><strong>Caretaker:</strong> {enrollment.caretaker.username}</p>
            <p><strong>Status:</strong> {enrollment.status}</p>

            {enrollment.status === "Pending" && (
              <div className="mt-2">
                <button 
                  onClick={() => handleApproval(enrollment.id, "Approved")} 
                  className="bg-emerald-800 text-white px-4 py-2 rounded mr-2"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleApproval(enrollment.id, "Rejected")} 
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {enrollment.status === "Approved" && (
              <p className="text-green-700 font-semibold">Enrollment Approved</p>
            )}

            {enrollment.status === "Rejected" && (
              <p className="text-red-700 font-semibold">Enrollment Rejected</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EnrollmentApproval;
