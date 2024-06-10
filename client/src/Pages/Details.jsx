import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import CreateLessonModal from "../Modals/CreateLessonModal";

function Details() {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:8080/course/detail/${id}`
        );
        const lessonsResponse = await axios.get(
          `http://localhost:8080/course/${id}/allessonsauth`
        );

        if (courseResponse && courseResponse.data) {
          setCourseDetails(courseResponse.data);
          console.log("Course Response:", courseResponse.data);
        }

        if (lessonsResponse && lessonsResponse.data.lessons) {
          setLessons(lessonsResponse.data.lessons);
          console.log("Lessons Response:", lessonsResponse.data.lessons);
        }
      } catch (error) {
        console.error("Error fetching course details:", error.response?.data);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className="container mx-auto flex flex-col lg:flex-row">
        <div className="lg:w-2/3 px-4">
          <div className="lg:w-full lg:px-4 mb-4 lg:mb-0 lg:p-6 w-full relative rounded block">
            <h1 className="text-gray-800 text-4xl font-bold mt-2 mb-2 leading-tight">
              {courseDetails.course && courseDetails.course.length > 0
                ? courseDetails.course[0].title
                : "Course Title Unavailable"}
            </h1>
            <img alt="" className="text-gray-600 mb-4" />
            <div className="flex flex-col gap-4">
              {/* Displaying each lesson in a separate card */}
              {Array.isArray(lessons) && lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 border border-gray-200 rounded shadow-md dark:border-[#ffffff33]"
                  >
                    <div className="flex items-center">
                      <div>
                        <img
                          className="h-[83px] w-[83px] rounded-lg"
                          src={lesson.image}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <Link to={`/lesson/${lesson.id}`}>
                          <p className="text-base font-medium text-navy-700 dark:text-white">
                            {lesson.title}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No lessons available</p>
              )}
            </div>
            <button
              onClick={openModal}
              className="px-4 py-3 text-indigo-950 transition-all transform border border-indigo-950 hover:bg-indigo-950 hover:text-gray-100"
            >
              Add Lessons
            </button>
          </div>
        </div>
      </div>
      <CreateLessonModal
        courseId={id}
        showModal={showModal}
        closeModal={closeModal}
      />
    </>
  );
}

export default Details;
