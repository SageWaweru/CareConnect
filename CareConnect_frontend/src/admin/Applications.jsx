import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/admin/job-applications/${id}/`)
      .then((res) => setApplications(res.data) )
      .catch((error) =>
        setError("Error fetching job applications: " + (error.response ? error.response.data : error.message))
      );
  }, [id]);

  const Delete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/admin/job-applications/delete/${id}/`)
      .then(() => {
        setApplications((prevApplications) => prevApplications.filter((application) => application.id !== id));
        alert("Application deleted successfully");
      })
      .catch((error) => {
        console.log(error.response ? error.response.data : error.message);
      });
  };


  return (
    <div className="p-6 bg-beige text-gray-700 min-h-screen">
      <h2 className="text-2xl font-bold">Job Applications</h2>
      {error && <div className="text-red-500">{error}</div>}
      {applications.length === 0 && !error && <p className="text-center mt-4">No job applications found.</p>}

      {applications.length > 0 && (
        <table className="w-full mt-4 bg-white shadow rounded-lg table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Id</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Job Id</th>
              <th className="p-3 text-left">Applicant</th>
              <th className="p-3 text-left">User Id</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b">
                <td className="p-3 text-center">{application.id}</td>
                <td className="p-3">{application.job_title}</td>
                <td className="p-3">{application.job}</td>
                <td className="p-3">{application.caretaker}</td>
                <td className="p-3">{application.caretaker_user_id}</td>
                <td className="p-3">{application.status}</td>
                <td className="p-3 text-center">
                <button
                  className="px-4 py-2 text-white rounded bg-coral hover:bg-emerald-800"
                  onClick={() => Delete(application.id)}
                >
                  Delete
                </button>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Applications;
