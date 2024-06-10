import React, { useEffect, useState } from "react";
import axios from "axios";
import deletee from "../Assets/delete.png";
import edit from "../Assets/edit.png";
import { useAuth } from "../Context/AuthContext";
import { useCookies } from "react-cookie";
import { useParams, Link } from "react-router-dom";
import CreateCourse from "../Modals/CreateCourse";
import CourseModal from "../Modals/CourseModal";
import Swal from "sweetalert2";
function ProfileCourses() {
  const [userCourses, setUserCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
  const { id } = useParams();
  const [createCourse, setCreatedCourse] = useState({
    title: "",
    detail: "",
    description: "",
    trainer: "",
    category_id: 0,
    is_paid: false,
    image: null,
    site: "",
    start_time: "",
    end_time: "",
  });
  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        if (!token) {
          console.error("Token not available.");
          return;
        }

        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          `http://localhost:8080/profile/mycourses`
        );
        if (Array.isArray(response.data.courses)) {
          setUserCourses(response.data.courses);
        } else {
          console.error(
            "Data received is not an array:",
            response.data.courses
          );
        }
      } catch (error) {
        console.error("Error fetching user courses:", error);
      }
    };

    fetchUserCourses();
  }, []);

  const addedCourse = (newCourse) => {
    setUserCourses([...userCourses, newCourse]); // Add the new course to the existing list
  };

  const showConfirmationDialog = (faqId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCourse(faqId);
      }
    });
  };

  const deleteCourse = async (courseId) => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      await axios.put(
        `http://localhost:8080/course/deletecourse/${courseId}`
      );
      // Update the courses state after deletion
      setUserCourses(userCourses.filter((course) => course.id !== courseId));
      console.log(`Course ${courseId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
    }
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    console.log("Modal is opened");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const updateCourse = (updatedCourse) => {
    const updatedCourses = userCourses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );

    setUserCourses(updatedCourses);
  };

  return (
    <>
 
      <div className="container mx-auto px-4 py-8 mt-5">
    <div className="flex flex-row justify-between">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">All Courses</h2>
        <button
        onClick={() => setShowCreateModal(true)}
        className="bg-[#799351] h-10 w-40 text-white rounded-md ml-2 hover:bg-[#A1DD70]"
      >
        Create Course
      </button>
    </div>
     
        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-1">
          {userCourses.length > 0 ? (
            <>
              {userCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    className="w-full h-40 object-cover object-center"
                    src={course.image}
                    alt={course.title}
                  />
                  <div className="p-4">
                    <Link
                       to={`/details/${course.id}`}
                      className="text-xl font-semibold text-gray-800 hover:text-indigo-700 transition duration-300"
                    >
                      {course.title}
                    </Link>
                    <div className="flex justify-between mt-4">
                      <p className="text-sm text-gray-700">
                        Start Time: {course.startdate}
                      </p>
                      <p className="text-sm text-gray-700">
                        End Time: {course.enddate}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => openModal(course)}>
                    <img className="  h-6 w-6  " src={edit} alt="" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showConfirmationDialog(course.id)}
                    className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    <img className="h-6 w-6" src={deletee} alt="" />
                  </button>
                </div>
              ))}
            {showModal && (
                  <CourseModal
                    course={selectedCourse}
                    closeModal={closeModal}
                    updateCourse={updateCourse}
                  />
                )}
                {showCreateModal && (
                  <CreateCourse
                    addcourse={createCourse}
                    closeModal={() => setShowCreateModal(false)}
                    addedCourse={addedCourse} 
                  />
                )}
            </>
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileCourses;
