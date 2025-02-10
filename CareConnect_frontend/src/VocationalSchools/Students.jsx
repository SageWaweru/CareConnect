import { useState, useEffect } from "react";
import axios from "axios";

const Students = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schoolId, setSchoolId] = useState(null);

    const getToken = () => localStorage.getItem("accessToken");

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        axios
            .get("http://127.0.0.1:8000/api/school/", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSchoolId(res.data.id))
            .catch((err) => console.error("Error fetching school:", err));
    }, []);

    useEffect(() => {
        if (!schoolId) return;

        const fetchEnrollments = async () => {
            try {
                const token = getToken();
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/enrollments/school/${schoolId}`,
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                    }
                );
                setEnrollments(response.data);
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [schoolId]);

    return (
        <div className="p-6 bg-beige w-full min-h-screen">
            <div >
                <h2 className="text-2xl text-gray-700 font-semibold">Students</h2>
                {loading ? (
                    <p>Loading students...</p>
                ) : enrollments.length === 0 ? (
                    <p>No students found.</p>
                ) : (
                    <table className="w-full mt-4 bg-white shadow rounded-lg table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Student Name</th>
                                <th className="p-3 text-left">Student Email</th>
                                <th className="p-3 text-left">Student Age</th>
                                <th className="p-3 text-left">Course Title</th>
                                <th className="p-3 text-left">Course Length</th>

                            </tr>
                        </thead>
                        <tbody>
                            {enrollments
                                .filter((enrollment) => enrollment.approved) 
                                .map((enrollment) => (
                                    <tr key={enrollment.id} className="border-b">
                                        <td className="p-3">{enrollment.id}</td>
                                        <td className="p-3">{enrollment.name}</td>
                                        <td className="p-3">{enrollment.email}</td>
                                        <td className="p-3">{enrollment.age}</td>
                                        <td className="p-3">{enrollment.course_title}</td>
                                        <td className="p-3">{enrollment.course_duration}</td>

                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Students;
