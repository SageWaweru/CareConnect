import { useContext } from 'react';
import AuthContext from './context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige px-4 py-6 overflow-hidden">

                <section className="text-center py-20">
        <h2 className="text-4xl font-extrabold mb-6">
          Welcome to CareConnect, {user ? user.username : "Guest"}!
        </h2>
        <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
          Connecting caretaking professionals and customers for trustworthy and personalized care services.
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
              <h4 className="text-2xl font-semibold mb-4">For Vocational Schools</h4>
              <p>
                Manage certifications, connect with students, and enhance professional growth.
              </p>
            </div>
          </div>
        </div>
      </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-beige px-4 w-screen py-6" >
            <h1 className="text-3xl font-bold text-emerald-800 mb-6">Hello, {user.username}!</h1>

            {/* Display content based on role */}
            {user.role === 'admin' || user.is_superuser ? (
                <div className="text-center bg-emerald-100 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold text-emerald-800 mb-2">Admin Dashboard</h2>
                    <p className="text-gray-700">You have full access to the dashboard.</p>
                </div>
            ) : user.role === 'customer' ? (
                <div className="text-center bg-blue-100 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">Customer Dashboard</h2>
                    <p className="text-gray-700">You can manage your appointments and view your history.</p>
                </div>
            ) : user.role === 'caretaker' ? (
                <div className="text-center bg-yellow-100 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">Caretaker Dashboard</h2>
                    <p className="text-gray-700">You can view and manage your tasks here.</p>
                </div>
            ) : user.role === 'vocational_school' ? (
                <div className="text-center bg-orange-100 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">Vocational School Dashboard</h2>
                    <p className="text-gray-700">You can manage caretakers, view assignments, and track student progress here.</p>
                </div>
            ) : (
                <div className="text-center bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
                    <p className="text-gray-600">Please log in or register to access CareConnect features.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
