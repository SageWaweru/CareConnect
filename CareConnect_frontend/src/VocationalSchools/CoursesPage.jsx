import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EnrollForm from "./EnrollForm";

const CoursesPage = () => {
  const { schoolId } = useParams();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [schoolName, setSchoolName] = useState("");

  const enrollInCourse = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleEnrollSuccess = (data) => {
    setSelectedCourseId(null);
    console.log("Enrollment successful:", data);
    alert("Your enroll request has been sent successfully.");
};

useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses/school/${schoolId}/`);
        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        const courseData = await courseResponse.json();
        console.log("Fetched Courses:", courseData);
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [schoolId]);

  return (
    <div className="w-full min-h-screen bg-beige text-gray-700 p-6">
      <h2 className="text-3xl font-bold">Courses</h2>
      <div className="grid grid-cols-2 gap-4">
        {courses.length === 0 ? (
          <p>No courses available</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card border p-2 my-2 p-4 bg-gray-100 rounded shadow">
              <h3 className="font-semibold text-xl">{course.title}</h3>
              <p className="m-2"><strong>Description:</strong> {course.description}</p>
              <p className="m-2"><strong>Duration:</strong> {course.duration}</p>
              <p className="m-2"><strong>Price:</strong> Ksh {course.price}</p>
              <p className="m-2"><strong>Status:</strong> {course.status}</p>
              
              {course.status === "open" ? (
                <button
                  className="bg-coral text-white hover:bg-emerald-800 px-4 w-full py-2 rounded"
                  onClick={() => enrollInCourse(course.id)}
                >
                  Enroll
                </button>
              ) : (
                <button
                  disabled
                  className="bg-coral text-white px-4 w-full py-2 rounded"
                >
                  Course is closed for enrollment
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {selectedCourseId && (
        <EnrollForm courseId={selectedCourseId} onEnrollSuccess={handleEnrollSuccess} 
        />
      )}
    </div>
  );
};

export default CoursesPage;
