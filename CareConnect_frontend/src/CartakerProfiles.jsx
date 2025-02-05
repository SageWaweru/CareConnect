import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const CaretakerProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [ratings, setRatings] = useState({}); // Store ratings per caretaker
  const navigate = useNavigate();

  const handleReviewClick = (profileId) => {
    navigate(`/review/${profileId}`);
  };

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

  useEffect(() => {
    const fetchReviews = async () => {
      if (profiles.length === 0) return;

      const ratingsData = {};
      await Promise.all(
        profiles.map(async (profile) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/api/caretaker/${profile.id}/reviews/`
            );
            const reviews = response.data;
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            ratingsData[profile.id] = reviews.length > 0 ? totalRating / reviews.length : 0;
          } catch (error) {
            console.error(`Error fetching reviews for profile ${profile.id}:`, error);
            ratingsData[profile.id] = 0;
          }
        })
      );

      setRatings(ratingsData);
    };

    fetchReviews();
  }, [profiles]); // Fetch ratings when profiles are loaded

  return (
    <div className="min-h-screen bg-beige py-10 px-4">
      <h2 className="text-4xl font-bold text-gray-700 text-center mb-8">
        Caretaker Profiles
      </h2>
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-sage"
            >
              <img
                src={profile.profile_picture}
                alt="Profile Picture"
                className="w-40 h-40 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                {profile.name}
              </h3>
              <p className="text-gray-700 mb-2">
                <strong className="text-emerald-700">Availability:</strong>{" "}
                {profile.availability}
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="text-emerald-700">Rate:</strong> Ksh {profile.rate} per{" "}
                {profile.rate_type}
              </p>
              <p className="text-gray-700 flex">
                <strong className="text-emerald-700">Ratings:</strong>{" "}
                <StarRating rating={ratings[profile.id] || 0} />
              </p>
              <button
                className="mt-4 px-4 py-2 text-white bg-coral hover:bg-[#C0706A] hover:text-white transition rounded-lg"
                onClick={() => navigate(`/caretaker/${profile.id}`)}
              >
                View Profile
              </button>
              <button
                onClick={() => handleReviewClick(profile.id)}
                className="mt-4 px-4 py-2 ml-2 text-white bg-coral hover:bg-[#C0706A] hover:text-white transition rounded-lg"
              >
                Rate Caretaker
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
