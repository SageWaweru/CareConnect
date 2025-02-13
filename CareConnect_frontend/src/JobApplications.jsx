import { useState, useEffect } from 'react';
import axios from 'axios';

function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState({});
  const [applicationStatus, setApplicationStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsResponse = await axios.get("http://localhost:8000/api/jobs/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setJobs(jobsResponse.data);

        const applicationsResponse = await axios.get("http://localhost:8000/api/applications/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const appliedJobsMap = {};
        const statusMap = {};

        applicationsResponse.data.forEach(application => {
          appliedJobsMap[application.job] = true;
          statusMap[application.job] = application.status;
        });

        setHasApplied(appliedJobsMap);
        setApplicationStatus(statusMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load jobs. Please try again later.");
      }
    };

    fetchJobsAndApplications();
  }, []);

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCoverLetter("");
    setSelectedJob(null);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      await axios.post(
        "http://localhost:8000/api/applications/",
        { job: selectedJob.id, cover_letter: coverLetter },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setHasApplied(prevState => ({ ...prevState, [selectedJob.id]: true }));
      alert("Applied successfully!");
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.detail);
      } else {
        console.error("Error applying for the job:", error);
        alert("Error applying for the job. Please try again.");
      }
    }
  };

  return (
    <div className='bg-beige w-full min-h-screen p-6'>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Jobs</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div>
          {jobs.length === 0 ? (
            <p className="text-center">No jobs available at the moment.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="mb-4 p-4 border border-gray-300 bg-alabaster rounded-md shadow-sm">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="mt-2 font-semibold">Description: {job.description}</p>
                <p className="mt-2 font-semibold">Skills: {job.required_skills}</p>
                <p className="mt-2 font-semibold">Location: {job.location}</p>
                <p className="mt-2 font-semibold">Pay Rate: {job.pay_rate} per {job.rate_type}</p>
                <p className="mt-2 font-semibold">Duration: {job.duration}</p>
                <p className="mt-2 font-semibold">Status: {job.status}</p>
                {job.status === "Open" && !hasApplied[job.id] && (
                  <button
                    onClick={() => openModal(job)}
                    className="mt-4 py-2 px-4 bg-coral text-white font-semibold rounded-md hover:bg-emerald-800"
                  >
                    Apply for this Job
                  </button>
                )}
                {job.status === "Open" && hasApplied[job.id] && (
                  <button
                    disabled
                    className="mt-4 py-2 px-4 bg-emerald-800 text-white font-semibold rounded-md cursor-not-allowed"
                  >
                    {applicationStatus[job.id]}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-alabaster p-6 rounded-lg shadow-lg w-2/5 h-3/5">
            <h3 className="text-xl font-semibold mb-4">Apply for {selectedJob?.title}</h3>
            <textarea
              className="w-full h-3/5 p-2 border rounded-md"
              placeholder="Enter your cover letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-emerald-800 hover:bg-coral text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-coral hover:bg-emerald-800 text-white rounded-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApplications;
