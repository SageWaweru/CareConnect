import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const [newJob, setNewJob] = useState({
    title:"",
    description:"",
    location:"",
    required_skills:"",
    rate_type: "",
    duration:"",
    status:"",
    pay_rate: 0

  });
  const [showForm, setShowForm] = useState(false); // State to toggle form visibil
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("User is not authenticated");
        return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/admin/job-posts/",
            newJob,
            { headers: { Authorization: `Token ${token}` } }
        );

        console.log("Job posted successfully:", response.data);
        
        setJobs((prevJobs) => [...prevJobs, response.data]);

        setNewJob({
            title: "",
            description: "",
            location: "",
            required_skills: "",
            rate_type: "",
            duration: "",
            status: "",
            pay_rate: 0,
        });
    } catch (error) {
        console.error("Error posting job:", error.response?.data || error.message);
    }
};

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/job-posts/")
      .then((res) => setJobs(res.data))
      .catch((error) => setError("Error fetching jobs: " + (error.response ? error.response.data : error.message)));
  }, []);

  const updateJobStatus = (id, status) => {
    axios
      .patch(`http://127.0.0.1:8000/api/admin/jobs/${id}/`, { status })
      .then(() => {
        axios.get("http://127.0.0.1:8000/api/admin/job-posts/")
          .then((response) => setJobs(response.data))
          .catch((error) => setError("Error fetching jobs: " + (error.response ? error.response.data : error.message)));
      })
      .catch((error) => {
        setError("Error updating job status: " + (error.response ? error.response.data : error.message));
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };


  const Delete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/admin/job-posts/${id}/`)
      .then(() => {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
        alert("Job deleted successfully");
      })
      .catch((error) => {
        setError("Error deleting job: " + (error.response ? error.response.data : error.message));
      });
  };

  const handleStatusChange = (id, status) => {
    updateJobStatus(id, status);
  };

  return (
    <div className="p-6 bg-beige text-gray-700 min-h-screen">
      <h2 className="text-2xl font-bold">Job Management</h2>
      {error && <div className="text-red-500">{error}</div>} 
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-6 mb-4 px-4 py-2 bg-emerald-800 text-white rounded hover:bg-coral"
      >
        {showForm ? "Cancel" : "Add New Job"}
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mt-6 w-3/5 space-y-6 bg-white p-6 shadow-lg rounded-lg">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-semibold">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newJob.title}
                            onChange={handleInputChange}
                            placeholder="Job Title"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-semibold">Job Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newJob.description}
                            onChange={handleInputChange}
                            placeholder="Job Description"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-semibold">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={newJob.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="requiredSkills" className="block text-gray-700 font-semibold">Required Skills</label>
                        <textarea
                            id="required_skills"
                            name="required_skills"
                            value={newJob.required_skills}
                            onChange={handleInputChange}
                            placeholder="List of Required Skills"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="payRate" className="block text-gray-700 font-semibold">Pay Rate</label>
                            <input
                                type="number"
                                id="pay_rate"
                                name="pay_rate"
                                value={newJob.pay_rate}                                onChange={handleInputChange}
                                placeholder="Pay Rate"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="rateType" className="block text-gray-700 font-semibold">Rate Type</label>
                            <select
                            id="rate_type"
                            name="rate_type"
                            value={newJob.rate_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Select Rate Type</option> 
                            <option value="hour">Hour</option>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                        </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="duration" className="block text-gray-700 font-semibold">Job Duration</label>
                        <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={newJob.duration}
                            onChange={handleInputChange}
                            placeholder="Job Duration (e.g., 3 weeks)"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-gray-700 font-semibold">Job Status</label>
                        <select
                            id="status"
                            name="status"
                            value={newJob.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-coral text-white font-semibold rounded-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        Add Job
                    </button>
        </form>
      )}

      <table className="w-full mt-4 bg-white shadow rounded-lg table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Job Title</th>
            <th className="border p-3 text-left">Description</th>
            <th className="border p-3 text-left">Required Skills</th>
            <th className="border p-3 text-left">Duration</th>
            <th className="border p-3 text-left">Location</th>
            <th className="border p-3 text-left">Pay Rate</th>
            <th className="border p-3 text-left">Rate Type</th>
            <th className="border p-3 text-left">Status</th>
            <th className="border p-3 text-left">Change Status</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="border p-3 text-center">{job.id}</td>
              <td role="button" onClick={() => navigate(`/applications/${job.id}`)} className="border p-3 hover:text-coral">{job.title}</td>
              <td className="border p-3">{job.description}</td>
              <td className="border p-3">{job.required_skills}</td>
              <td className="border p-3">{job.duration}</td>
              <td className="border p-3">{job.location}</td>
              <td className="border p-3">{job.pay_rate}</td>
              <td className="border p-3">{job.rate_type}</td>
              <td className="border p-3">{job.status}</td>
              <td className="border p-3">
                <select
                  value={job.status}
                  className="px-4 py-2 text-white rounded bg-emerald-800 hover:bg-emerald-700"
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
              <td className="p-3 text-center">
                <button
                  className="px-4 py-2 text-white rounded bg-coral hover:bg-emerald-800"
                  onClick={() => Delete(job.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jobs;
