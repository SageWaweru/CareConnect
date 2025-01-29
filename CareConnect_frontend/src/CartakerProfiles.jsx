import { useEffect, useState } from "react";
import axios from "axios";

const CaretakerProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/api/caretaker-profiles/")
      .then((response) => {
        setProfiles(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the profiles!", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-beige py-10 px-4">
      <h2 className="text-4xl font-bold text-gray-700  text-center mb-8">
        Caretaker Profiles
      </h2>
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-sage"
            >
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                {profile.name}
              </h3>
              <p className="text-gray-700 mb-2">
                <strong className="text-emerald-700">Certifications:</strong>{" "}
                {profile.certifications}
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="text-emerald-700">Skills:</strong>{" "}
                {profile.skills}
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="text-emerald-700">Availability:</strong>{" "}
                {profile.availability}
              </p>
              <p className="text-gray-700">
                <strong className="text-emerald-700">Ratings:</strong>{" "}
                {profile.ratings}
              </p>
              <button className="mt-4 px-4 py-2 text-white bg-coral hover:bg-coral-dark rounded-lg">
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          No profiles available at the moment.
        </p>
      )}
    </div>
  );
};

export default CaretakerProfiles;

