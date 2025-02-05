import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [certifications, setCertifications] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [ratings] = useState(0); 
  const [profilePicture, setProfilePicture] = useState(null);
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState("hour");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken);
    console.log(refreshToken);

    if (refreshToken) {
      axios
        .post("http://localhost:8000/api/token/refresh/", { refresh: refreshToken })
        .then((response) => {
          localStorage.setItem("accessToken", response.data.access);
        })
        .catch((error) => {
          console.error("Refresh token error:", error);
        });
    }

    if (accessToken) {
      axios
        .get("http://localhost:8000/api/users/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setRole(response.data.role);
          setUserId(response.data.id); 
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
          setError("Failed to fetch user details. Please try again.");
        });
    } else {
      console.log("No access token found");
      setError("No access token found.");
    }
  }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    script.onload = () => {
      console.log("Cloudinary widget loaded successfully.");
    };

    script.onerror = () => {
      console.error("Failed to load the Cloudinary widget.");
    };

    document.body.appendChild(script);
  }, []);

  const handleImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "dpb7i0th4",
        upload_preset: "Profile-Pictures",
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        max_file_size: 10000000, // 10MB
        client_allowed_formats: ["jpg", "png", "jpeg", "gif"],
      },
      function (error, result) {
        if (error) {
          console.error("Error uploading image", error);
          return;
        }
        if (result.event === "success") {
          console.log("Image uploaded successfully", result.info);
          
          // Use the Cloudinary URL directly
          const imageUrl = result.info.secure_url; // This is the URL of the uploaded image
          setProfilePicture(imageUrl); // Store the URL, not the file
        }
      }
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!name || !certifications || !skills || !availability) {
      setError("Please fill in all the fields.");
      return;
    }
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("certifications", certifications);
    formData.append("skills", skills);
    formData.append("availability", availability);
    formData.append("rate", parseFloat(rate) || 0.0);
    formData.append("rate_type", rateType);
    formData.append("ratings", parseFloat(ratings) || 0.0);
    formData.append("number_of_ratings", 0);
    formData.append("user", userId);
  
    // Use the image URL, not the file
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
  
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      setError("No access token found. Please log in again.");
      return;
    }
  
    axios
      .post("http://localhost:8000/api/api/caretaker-profiles/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSuccess("Caretaker profile created successfully!");
        setTimeout(() => {
          navigate("/caretaker-profile");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error submitting the profile:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
        setError(error.response?.data?.detail || "Failed to create caretaker profile.");
      });
  };
        
  if (role !== "caretaker") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">
          You must be a caretaker to create a profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige">
      <form onSubmit={handleSubmit} className="p-8 bg-stone-50 mt-6 rounded-lg shadow-lg w-3/5">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Caretaker Profile</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>
        )}
        <div>
        <label className="text-lg font-medium">Profile Picture:</label>
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
              >
                Upload Profile Picture
              </button>
                    </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Certifications:</label>
          <textarea
            type="text"
            value={certifications}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setCertifications(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Skills:</label>
          <textarea
            type="text"
            value={skills}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Availability:</label>
          <select
            value={availability}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="" disabled>
              Select availability
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Weekends Only">Weekends Only</option>
            <option value="Flexible Hours">Flexible Hours</option>
          </select>
        </div>
        <div>
          <label>Rate:</label>
          <input
            type="number"
            value={rate}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setRate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Rate Type:</label>
          <select
            value={rateType}
            className="w-full p-3 mb-5 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldDark text-lg"
            onChange={(e) => setRateType(e.target.value)}
            required
          >
            <option value="hour">Per Hour</option>
            <option value="day">Per Day</option>
            <option value="week">Per Week</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-coral text-white p-3 rounded-md hover:bg-emeraldDark transition duration-200 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Profile;
