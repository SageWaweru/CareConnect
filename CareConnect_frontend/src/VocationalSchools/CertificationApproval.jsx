import { useEffect, useState } from "react";
import axios from "axios";

const CertificationApproval = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/certifications/") // Update API endpoint if needed
      .then(res => setCertifications(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApprove = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/approve-certification/${id}/`)
      .then(() => {
        setCertifications(certifications.map(cert => cert.id === id ? { ...cert, approved: true } : cert));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold">Approve Certifications</h2>
      {certifications.map(cert => (
        <div key={cert.id} className="border p-2 my-2">
          <p><strong>Course:</strong> {cert.enrollment.course.title}</p>
          <button 
            onClick={() => handleApprove(cert.id)} 
            className="bg-emerald-800 text-white px-4 py-2 rounded"
            disabled={cert.approved}
          >
            {cert.approved ? "Approved" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CertificationApproval;
