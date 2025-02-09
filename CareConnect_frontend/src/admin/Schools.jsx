import { useEffect, useState } from "react";
import axios from "axios";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/schools/")
      .then((response) => {
        setSchools(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch schools");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading schools...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Vocational Schools</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Manager</th>
            <th className="border p-2">ManagerId</th>
            <th className="border p-2">Location</th>

          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="text-center">
              <td className="border p-2">{school.id}</td>
              <td className="border p-2">{school.name}</td>
              <td className="border p-2">{school.description}</td>
              <td className="border p-2">{school.manager_name }</td>
              <td className="border p-2">{school.manager}</td>
              <td className="border p-2">{school.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schools;
