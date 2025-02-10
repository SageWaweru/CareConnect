import { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';

function CustomerJobApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [updatedJobDetails, setUpdatedJobDetails] = useState({
    title: '',
    description: '',
    required_skills: '',
    location: '',
    pay_rate: '',
    rate_type: '',
    duration: '',
    status: '',
  });
  const [chatOpen, setChatOpen] = useState({}); 
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApplicationsAndJobs = async () => {
      try {
        const [applicationsResponse, jobsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/applications/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          axios.get('http://localhost:8000/api/jobs/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);
  
        setApplications(applicationsResponse.data);
  
        console.log(jobsResponse.data)
        const customerJobs = jobsResponse.data.filter(job => job.customer_id === Number(customerId));
        console.log(customerJobs)
        setJobs(customerJobs);
      } catch (error) {
        console.error("Error fetching applications and jobs:", error);
        setError("Failed to load data. Please try again later.");
      }
    };
  
    fetchApplicationsAndJobs();
  }, [customerId]);
  
  const handleEditClick = (jobId) => {
    const job = jobs.find(job => job.id === jobId);
    console.log("Editing Job:", job);
    setEditingJobId(jobId);
    setUpdatedJobDetails({
      title: job.title,
      description: job.description,
      required_skills: job.required_skills,
      location: job.location,
      pay_rate: job.pay_rate,
      rate_type: job.rate_type,
      duration: job.duration,
      status: job.status,
    });

    console.log("Updated Job Details:",{
      title: job.title,
      description: job.description,
      required_skills: job.required_skills,
      location: job.location,
      pay_rate: job.pay_rate,
      rate_type: job.rate_type,
      duration: job.duration,
      status: job.status,
    });
  };

  useEffect(() => {
    console.log("Updated Job Details State:", updatedJobDetails);
  }, [updatedJobDetails]);
  
  const handleJobUpdate = async (jobId, updatedJobDetails) => {
    updatedJobDetails.pay_rate = parseFloat(updatedJobDetails.pay_rate); 
  
    try {
      const response = await axios.put(
        `http://localhost:8000/api/jobs/${jobId}/`,
        updatedJobDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      console.log("API Response:", response.data); 
  
      alert("Job updated successfully");
  
      const updatedJobsResponse = await axios.get('http://localhost:8000/api/jobs/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      console.log("Updated Jobs List:", updatedJobsResponse.data); 
  
      setJobs(updatedJobsResponse.data);
  
      setEditingJobId(null);
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };
      
  const handleJobDelete = async (jobId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/jobs/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Job deleted successfully:", response.data);
      alert("Job deleted successfully");

      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const toggleChat = (applicationId) => {
    setChatOpen((prev) => ({
      ...prev,
      [applicationId]: !prev[applicationId],
    }));
  };
  
  const handleHireCaretaker = async (applicationId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/applications/${applicationId}/update/`,
        { status: "Hired" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Caretaker successfully hired!");
  
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: "Hired" } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to hire caretaker. Please try again.");
    }
  };
  
  const handleRejectCaretaker = async (applicationId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/applications/${applicationId}/update/`,
        { status: "Rejected" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Caretaker successfully rejected!");
  
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: "Rejected" } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to reject caretaker. Please try again.");
    }
  };

  return (
    <div className="bg-beige min-h-screen w-full p-6">
      <div className="max-w-4x p-6 mx-auto shadow-md w-4/5 bg-white text-gray-700 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-dark">Job Applications & Jobs</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div>
          <h3 className="text-xl font-bold mb-4 text-emerald-dark">Job Applications</h3>
          {applications.length === 0 ? (
            <p className="text-center text-sage">No applications for your jobs yet.</p>
          ) : (
            applications.map((application) => {
              console.log("Application ID:", application.id, "Status:", application.status);

              return (
                <div key={application.id} className="mb-4 p-4 border border-gray-300 bg-alabaster rounded-md shadow-sm">
                  <h3 className="text-xl font-semibold text-emerald-dark">Job: {application.job_title}</h3>
                  <p className="mt-2 font-semibold">Applicant: {application.caretaker}</p>
                  <p className="mt-2 font-semibold">Status: {application.status}</p>
                  {application.status === "Pending" && (
                    <>
                    <button
                      onClick={() => handleHireCaretaker(application.id)}
                      className="mt-4 py-2 px-4 bg-emerald-800 text-white mr-2 font-semibold rounded-md hover:bg-coral"
                    >
                      Hire Caretaker
                    </button>
                    <button
                      onClick={() => handleRejectCaretaker(application.id)}
                      className="mt-4 py-2 px-4 bg-sage text-gray-700 mr-2 font-semibold rounded-md hover:bg-coral"
                    >
                      Reject Caretaker
                    </button>

                    </>
                  )}

                  {application.status === "Hired" && (
                    <button disabled className="mt-4 py-2 px-4 bg-emerald-800 text-white mr-2 font-semibold rounded-md ">Caretaker Hired</button>
                  )}
                  {application.status === "Rejected" && (
                    <button disabled className="mt-4 py-2 px-4 bg-emerald-800 text-white mr-2 font-semibold rounded-md ">Caretaker Rejected</button>
                  )}

                  <button
                    onClick={() => toggleChat(application.id)}
                    className="mt-4 py-2 px-4 bg-coral text-white font-semibold rounded-md hover:bg-emerald-700"
                  >
                    {chatOpen[application.id] ? "Close Chat" : "Contact Caretaker"}
                  </button> 

                  {chatOpen[application.id] && (
                    <Chat customerId={customerId} caregiverId={application.caretaker_user_id} />
                  )}
                </div>
              );
            })
          )}
        </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-emerald-dark">Your Jobs</h3>
            {jobs.length === 0 ? (
              <p className="text-center text-sage">No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="mb-4 p-4 border bg-alabaster border-gray-300 rounded-md shadow-sm">
                  {editingJobId === job.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleJobUpdate(job.id, updatedJobDetails); }}>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-title">Job Title</label>
                        <input
                          id="job-title"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.title}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, title: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-description">Description</label>
                        <textarea
                          id="job-description"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.description}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, description: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-required_skills">Required Skills</label>
                        <input
                          id="job-required_skills"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.required_skills}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, required_skills: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-location">Location</label>
                        <input
                          id="job-location"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.location}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, location: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-pay_rate">Pay Rate</label>
                        <input
                          id="job-pay_rate"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.pay_rate}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, pay_rate: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-rate_type">Rate Type</label>
                        <select
                          id="job-rate_type"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.rate_type}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, rate_type: e.target.value })}
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="job-duration">Duration</label>
                        <input
                          id="job-duration"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={updatedJobDetails.duration}
                          onChange={(e) => setUpdatedJobDetails({ ...updatedJobDetails, duration: e.target.value })}
                        />
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 bg-coral text-white font-semibold rounded-md hover:bg-emerald-800"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-dark">Title: {job.title}</h3>
                      <p className="mt-2">Description: {job.description}</p>
                      <p className="mt-2">Skills: {job.required_skills}</p>
                      <p className="mt-2">Location: {job.location}</p>
                      <p className="mt-2">Pay Rate: {job.pay_rate} per {job.rate_type}</p>
                      <p className="mt-2">Duration: {job.duration}</p>
                      <p className="mt-2">Status: {job.status}</p>
                      <button
                        className="mt-4 py-2 px-4 bg-emerald-800 text-white font-semibold rounded-md hover:bg-coral"
                        onClick={() => handleEditClick(job.id)}
                      >
                        Edit Job
                      </button>
                      <button
                        onClick={() => handleJobDelete(job.id)}
                        className="ml-2 mt-4 py-2 px-4 bg-coral text-white font-semibold rounded-md hover:bg-emerald-800"
                      >
                        Delete Job
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
}

export default CustomerJobApplications;
