import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige px-4 py-6 overflow-hidden">
        <section className="text-center py-20">
          <h2 className="text-4xl font-extrabold mb-6">
            Welcome to CareConnect, {user ? user.username : "Guest"}!
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Connecting caretaking professionals and customers for trustworthy
            and personalized care services.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/explore"
              className="bg-[#2D6A4F] text-white px-6 py-3 rounded-lg hover:bg-[#1E5136] hover:text-white transition"
            >
              Explore Services
            </a>
            <a
              href="/caretakers"
              className="bg-[#E09891] text-white px-6 py-3 rounded-lg hover:bg-[#C0706A] hover:text-white transition"
            >
              Find Caretakers
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container p-4 mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#B0BC98] p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-semibold mb-4">For Customers</h4>
                <p className="text-gray-700">
                  Access skilled caretakers and manage appointments seamlessly.
                </p>
              </div>
              <div className="bg-[#E09891] p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-semibold mb-4">For Caretakers</h4>
                <p className="text-gray-700">
                  Find flexible job opportunities and track your progress.
                </p>
              </div>
              <div className="bg-[#2D6A4F] p-6 rounded-lg shadow-lg text-white">
                <h4 className="text-2xl font-semibold mb-4">
                  For Vocational Schools
                </h4>
                <p>
                  Manage certifications, connect with students, and enhance
                  professional growth.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-beige px-4 w-full py-6">
      {/* <h1 className="text-3xl font-bold text-emerald-800 mb-6">Hello, {user.username}!</h1> */}

      {/* Display content based on role */}
      {user.role === "admin" || user.is_superuser ? (
        <div className="text-center bg-emerald-100 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-700">
            You have full access to the dashboard.
          </p>
        </div>
      ) : user.role === "customer" ? (
        <div className="bg-beige min-h-screen w-full">
          <div className="max-w-6xl mx-auto p-6">
            <header className="bg-alabaster text-gray-700 p-4 rounded-lg shadow-md">
              <div className="container p-6 mx-auto  flex flex-col text-center justify-between items-center">
                <h2 className="text-4xl font-extrabold mb-6">
                  Welcome to CareConnect's Customer Dashboard,{" "}
                  {user ? user.username : "Guest"}!
                </h2>
                <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                  Connecting caretaking professionals and customers for
                  trustworthy and personalized care services.
                </p>

                <div className="flex items-center"></div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Job Opportunities */}
              <div className=" p-6 bg-emerald-800 text-white rounded-lg shadow-md border border-gray-300 mb-6">
                <h2 className="text-xl font-semibold  mb-4">Post Jobs</h2>
                <p className=" mb-4">
                  Easily post jobs and find skilled caretakers to meet your
                  needs.
                </p>

                <div className="mb-4">
                  <p >
                    Share job details, specify the qualifications you're looking
                    for, and connect with qualified caretakers who are ready to
                    apply.
                  </p>
                </div>

                <div className="mb-4">
                  <p >
                    With just a few steps, you can get your job listing out to
                    potential caretakers and begin reviewing applications.
                  </p>
                </div>

                  <button onClick={() => navigate("/createjob")}className="bg-alabaster text-gray-700 py-2 px-4 rounded-md hover:bg-coral w-full">
                    Post A Job
                  </button>
              </div>

              {/* Job Applications */}
              <div className="bg-sage text-gray-700 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
                <h2 className="text-xl font-semibold text-emerald-dark mb-4">
                  Your Job Applications
                </h2>
                <p className=" mb-4">
                  Track and manage your job applications easily.
                </p>

                <div className="mb-4">
                  <p >
                    Stay updated on the status of the jobs you've posted.
                    Monitor applications, view progress, and interact with
                    caretakers who have shown interest in your job offers.
                  </p>
                </div>

                <div className="mb-4">
                  <p >
                   You can review, shortlist, or message applicants
                    directly from here.
                  </p>
                </div>

                  <button onClick={() => navigate("/customer-jobs")} className="bg-emerald-800 text-white py-2 px-4 rounded-md hover:bg-coral w-full">
                    View Applications
                  </button>
              </div>

              <div className="bg-alabaster text-gray-700 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
                <h2 className="text-xl font-semibold text-emerald-dark mb-4">
                  Caretaker Profiles
                </h2>
                <p className="mb-4">
                  Access skilled professionals for your care needs.
                </p>

                <div className="mb-4">
                  <p >
                    Whether you're looking for a
                    caregiver for elderly care, children, or specialized medical
                    assistance, you'll find skilled professionals ready to help.
                  </p>
                </div>

                <div className="mb-4">
                  <p >
                    Browse through detailed profiles, view their ratings and
                    reviews, and hire the caretaker that fits your needs. 
                  </p>
                </div>

                  <button onClick={() => navigate("/caretakers")} className="bg-sage text-gray-700 py-2 px-4 rounded-md hover:bg-coral w-full">
                    View Caretakers
                  </button>
               
              </div>
            </div>
            </div>
          </div>
      ) : user.role === "caretaker" ? (
        <div className="w-full ">
          <div className="min-h-screen p-6">
            <header className="bg-alabaster text-gray-700 p-4 rounded-lg shadow-md">
              <div className="container p-6 mx-auto flex flex-col text-center justify-between items-center">
                <h2 className="text-4xl font-extrabold mb-6">
                  Welcome to CareConnect's Caretaker Dashboard,{" "}
                  {user ? user.username : "Guest"}!
                </h2>
                <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                  Connecting caretaking professionals and customers for
                  trustworthy and personalized care services.
                </p>

                <div className="flex items-center"></div>
              </div>
            </header>

            <div className="container mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-emerald-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">New Jobs Posted</h2>
                <ul className="space-y-4">
                  <li className="text-sm">
                    <p>
                      <strong>Job Title:</strong> Personal Care Assistant
                    </p>
                    <p>
                      <strong>Location:</strong> Nairobi, Kenya
                    </p>
                    <p>
                      <strong>Job Description:</strong> Assist clients with
                      daily activities such as bathing, dressing, and personal
                      hygiene. Provide companionship and ensure safety.
                    </p>
                    <p>
                      <strong>Posted:</strong> January 30, 2025
                    </p>
                  </li>
                  <li className="text-sm">
                    <p>
                      <strong>Job Title:</strong> Home Health Aide
                    </p>
                    <p>
                      <strong>Location:</strong> Mombasa, Kenya
                    </p>
                    <p>
                      <strong>Job Description:</strong> Provide personal care to
                      elderly clients, including medication reminders, meal
                      preparation, and mobility assistance.
                    </p>
                    <p>
                      <strong>Posted:</strong> January 29, 2025
                    </p>
                  </li>
                </ul>
                  <button onClick={() => navigate("/applyjob")} className="mt-4 bg-alabaster hover:bg-coral w-full text-gray-800 py-2 px-4 rounded-md">
                    View All Jobs
                  </button>
              </div>

              <div className="bg-[#B0BC98] text-gray-700 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Earnings Overview
                </h2>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Weekly Earnings: <span className="font-bold">KSh 5000</span>
                  </p>
                </div>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Total Earnings: <span className="font-bold">KSh 15000</span>
                  </p>
                </div>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Earnings This Month:{" "}
                    <span className="font-bold">KSh 20000</span>
                  </p>
                </div>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Pending Payments:{" "}
                    <span className="font-bold">KSh 7000</span>
                  </p>
                </div>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Completed Jobs: <span className="font-bold">12 Jobs</span>
                  </p>
                </div>
                <div className="border-b border-white pb-5">
                  <p className="text-lg">
                    Average Rating: <span className="font-bold">4.5 Stars</span>
                  </p>
                </div>
                <button className="mt-4 bg-[#2D6A4F] hover:bg-coral w-full text-white py-2 px-4 rounded-md">
                  View Earnings Details
                </button>
              </div>
              <div className="bg-alabaster text-gray-700 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                  <div className="border-b border-white pb-4">
                    <p className="font-medium">John Kamau</p>
                    <p className="text-sm">
                      "Great experience, very professional!"
                    </p>
                  </div>
                  <div className="border-b border-white pb-4">
                    <p className="font-medium">Selina Otieno</p>
                    <p className="text-sm">"Great with kids and very kind!"</p>
                  </div>
                  <div className="border-b border-white pb-4">
                    <p className="font-medium">Carrie Cheruto</p>
                    <p className="text-sm">"Great work ethic!"</p>
                  </div>

                  <div className="border-b border-white pb-4">
                    <p className="font-medium">Jane Robina</p>
                    <p className="text-sm">
                      "Fantastic service, highly recommend!"
                    </p>
                  </div>
                </div>
                <button className="mt-4 bg-sage hover:bg-coral w-full  text-gray-800 py-2 px-4 rounded-md">
                  View All Reviews
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : user.role === "vocational_school" ? (
        <div className="text-center bg-orange-100 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Vocational School Dashboard
          </h2>
          <p className="text-gray-700">
            You can manage caretakers, view assignments, and track student
            progress here.
          </p>
        </div>
      ) : (
        <div className="text-center bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">
            Please log in or register to access CareConnect features.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
