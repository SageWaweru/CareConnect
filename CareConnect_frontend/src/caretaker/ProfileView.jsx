import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import axios from "axios";

const ProfileView = () => {
  const [caretaker, setCaretaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    certifications: "",
    skills: "",
    availability: "",
    profilePicture: "",
    rate: 0,
    rateType: "hour",
    ratings: 0,
  });

  useEffect(() => {
    const fetchCaretaker = async () => {
      try {
        setLoading(true); 
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:8000/api/api/caretaker-profiles/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
    
        if (response.data) {
          setCaretaker(response.data);
          setFormData({
            name: response.data.name,
            certifications: response.data.certifications,
            skills: response.data.skills,
            availability: response.data.availability || "Part-time",
            ratings: response.data.ratings,
            profilePicture: response.data.profile_picture,
            rate: response.data.rate || 0,
            rateType: response.data.rate_type || "hour",
        });
      }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Profile not found"); 
        } else {
          setError("Error fetching profile"); 
        }
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false); 
      }
    };
      
    fetchCaretaker();
  }, []);
  
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      
    });
  };

  const handleImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "dpb7i0th4", // Replace with your Cloudinary cloud name
        upload_preset: "Profile-Pictures", // Replace with your upload preset name
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
          setFormData({
            ...formData,
            profilePicture: result.info.secure_url, 
            // Update the formData with the uploaded image URL
          });            console.log("Profile picture URL:", result.info.secure_url)

        }
      }
    );
  };
  useEffect(() => {
    const loadCloudinaryScript = () => {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.head.appendChild(script);
  
      script.onload = () => {
        console.log("Cloudinary script loaded");
      };
  
      script.onerror = () => {
        console.error("Failed to load Cloudinary script");
      };
    };
  
    if (!window.cloudinary) {
      loadCloudinaryScript();
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    if (!formData.name || !formData.certifications || !formData.skills || !formData.availability) {
      setError("Please fill in all the required fields.");
      return;
    }
    const userId = localStorage.getItem("userId");
    console.log(formData)
    axios
      .put(
        `http://localhost:8000/api/api/caretaker-profiles/${userId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        setCaretaker(response.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
        setError("Failed to update profile. Please try again.");
      });
  };
  console.log(formData.profilePicture);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error === "Profile not found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige">
        <div className="p-8 bg-stone-50 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-emerald-800">No Profile Found</h1>
          <p className="text-gray-700 mb-6">
            It looks like you don't have a profile yet. Click below to create one!
          </p>
          <Link
            to="/caretaker-profile-create"
            className="w-full bg-emerald-800 text-white p-3 rounded-md text-center hover:bg-emerald-700 hover:text-white transition duration-200 ease-in-out"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  if (!caretaker) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error || "Failed to load profile."}
      </div>
    );
  }
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-beige">
      <div className="p-8 bg-stone-50 mt-4 rounded-lg shadow-lg w-1/2">
        <h1 className="text-2xl font-bold mb-6 text-emerald-800">Caretaker Profile</h1>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-lg font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Certifications:</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Skills:</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Availability:</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Profile Picture:</label>
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
              >
                Upload Profile Picture
              </button>
              {formData.profilePicture && (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Rate:</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-medium">Rate Type:</label>
              <select
                name="rateType"
                value={formData.rateType}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-800 text-white p-3 rounded-md hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            {caretaker.profile_picture ? (
                <img
                  src={caretaker.profile_picture}
                  alt="Profile"
                  className="w-40 h-40 object-cover rounded-full mb-4"
                />
              ) : (
                <p>No profile picture available</p>
              )}
            <h2 className="text-xl font-medium mb-4">{caretaker.name}</h2>
            <p className="mb-4">Certifications: {caretaker.certifications}</p>
            <p className="mb-4">Skills: {caretaker.skills}</p>
            <p className="mb-4">Availability: {caretaker.availability}</p>
            <p className="mb-4">Rate: {caretaker.rate} Ksh per {caretaker.rate_type}</p>
            <p className="mb-4">Ratings: {caretaker.ratings} ⭐</p>
            <button
              onClick={handleEdit}
              className="w-full bg-emerald-800 text-white p-3 rounded-md mb-4 hover:bg-emerald-700"
            >
              Edit Profile
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ProfileView;

