import { useEffect, useState } from "react";
import axios from "axios";

const EnrollmentApproval = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/enrollments/") // Update API endpoint if needed
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApprove = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/approve-enrollment/${id}/`)
      .then(() => {
        setEnrollments(enrollments.map(en => en.id === id ? { ...en, approved: true } : en));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold">Approve Enrollments</h2>
      {enrollments.map(enrollment => (
        <div key={enrollment.id} className="border p-2 my-2">
          <p><strong>Course:</strong> {enrollment.course.title}</p>
          <p><strong>Caretaker:</strong> {enrollment.caretaker.username}</p>
          <button 
            onClick={() => handleApprove(enrollment.id)} 
            className="bg-emerald-800 text-white px-4 py-2 rounded"
            disabled={enrollment.approved}
          >
            {enrollment.approved ? "Approved" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EnrollmentApproval;
