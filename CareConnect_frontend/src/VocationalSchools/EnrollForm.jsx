import React, { useState } from "react";

const EnrollForm = ({ courseId, onEnrollSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    const userDetails = {
      name,
      email,
      age,
    };
      
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Something went wrong.");
      } else {
        const data = await response.json();
        onEnrollSuccess(data); 
        setName("");
        setEmail("");
        setAge("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white w-3/5 shadow-md rounded-md">
        <span role="button"
          className="float float-right text-coral hover:text-emerald-800 text-xl"
        >
         ✖
        </span>
        <br />
      <h2 className="text-2xl font-semibold mb-4">Enroll in Course</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-coral hover:bg-emerald-800 text-white px-4 py-2 rounded w-full ${loading && "opacity-50 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Enrolling..." : "Enroll"}
        </button>
      </form>
    </div>
  );
};

export default EnrollForm;
