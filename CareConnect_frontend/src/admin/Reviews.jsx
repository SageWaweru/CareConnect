import { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caretakerId, setCaretakerId] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = (id = "") => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/admin/reviews/${id ? `?caretaker_id=${id}` : ""}`)
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch reviews");
        setLoading(false);
      });
  };

  const handleFilter = () => {
    fetchReviews(caretakerId);
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Caretaker Reviews</h2>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Filter by Caretaker ID"
          value={caretakerId}
          onChange={(e) => setCaretakerId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Caretaker</th>
            <th className="border p-2">Caretaker Id</th>
            <th className="border p-2">Reviewer</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Comment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.id} className="text-center">
                <td className="border p-2">{review.id}</td>
                <td className="border p-2">{review.caretaker_name}</td>
                <td className="border p-2">{review.caretaker}</td>
                <td className="border p-2">{review.reviewer_name}</td>
                <td className="border p-2">{review.rating} ⭐</td>
                <td className="border p-2">{review.review_text}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-4 text-center text-gray-500">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
