import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


function Coursesdetails() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { headers, isLoggedIn, isSubscriber } = useAuth();
  const [courseDetails, setCourseDetails] = useState([]);
  const [courseLessons, setCourseLessons] = useState([]);
  const { id } = useParams();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [displayedLessons, setDisplayedLessons] = useState(5);


  const handleViewAllVideos = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Please Login",
        text: "You need to log in to access all videos.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Login");
        }
      });
    
    } else {
      setShowAllVideos(true);
      setDisplayedLessons(courseLessons.lessons.length);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          `http://localhost:8080/course/detail/${id}`
        );
        setCourseDetails(response.data);
        console.log("Course Details API response:", response.data);
      } catch (error) {
        console.error("Error fetching course details:", error.response);
      }
    };

    fetchCourseDetails();
  }, [id, token]);

  useEffect(() => {
    const fetchCourseLessons = async () => {
      try {
        if (token) {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.get(
            `http://localhost:8080/course/${id}/allessonsauth`
          );
          setCourseLessons(response.data);

          if (
            response.data.lessons &&
            response.data.lessons.length > 0 &&
            response.data.lessons[0].id
          ) {
            fetchLessonVideos(response.data.lessons[0].id);
          }
        } else {
          const response = await axios.get(
            `http://localhost:8080/course/${id}/allessons`
          );
          setCourseLessons(response.data);
          console.log("Course Lessons API response:", response.data);
          if (
            response.data.lessons &&
            response.data.lessons.length > 0 &&
            response.data.lessons[0].id
          ) {
            fetchLessonVideos(response.data.lessons[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching course lessons:", error.response);
      }
    };

    fetchCourseLessons();
  }, [id, token]);

  const fetchLessonVideos = async (lessonId) => {
    if (!lessonId) return;

    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(
        `http://localhost:8080/course/lesson/${lessonId}`
      );

      setCurrentVideo(response.data.course[0].video);
    } catch (error) {
      console.error("Error fetching video lessons:", error.response);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="container mt-20 mx-auto flex flex-col lg:flex-row">
        <div className="lg:w-2/3 px-4">
          <div className="aspect-w-16 aspect-h-16">
            <iframe
              title="lesson-video"
              className="w-full h-[30rem] rounded-md shadow-lg border-2 border-gray-200"
              src={currentVideo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="lg:w-full lg:px-4 mb-4 lg:mb-0 lg:p-6 w-full relative rounded block">
            <span className="text-indigo-900 text-sm hidden md:block mt-4">
              Technology
            </span>
            <h1 className="text-gray-800 text-4xl font-bold mt-2 mb-2 leading-tight">
              {courseDetails.course && courseDetails.course[0].title
                ? courseDetails.course[0].title
                : "Title Not Available"}
            </h1>
            <p className="text-gray-600 mb-4">
              {courseDetails.course && courseDetails.course[0].description
                ? courseDetails.course[0].description
                : "Details Not Available"}
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 px-4">
          <div className="bg-gray-200 border border-gray-300 p-4 font-bold flex flex-col justify-center items-center">
            <h1 className="text-indigo-900 hover:text-indigo-700 pl-2 border-l-4 border-indigo-900 mb-6 self-start">
              Course Lessons
            </h1>
            <div className="lg:sticky top-20">
              <ul>
                {courseLessons.lessons &&
                  courseLessons.lessons
                    .slice(0, displayedLessons)
                    .map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center mb-4 pb-4 border-b border-dashed border-gray-300 hover:bg-gray-100 transition duration-300"
                        onClick={() => fetchLessonVideos(lesson.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div class="flex items-center justify-start">
                          <div class="sidebar-thumb flex-shrink-0 mr-4">
                            <img
                              class="rounded-full h-10 w-14 object-cover"
                              src={lesson.image}
                              alt={lesson.title}
                            />
                          </div>
                          <div class="sidebar-content">
                            <h5 class="mb-0 text-xs">
                              <button class="text-indigo-950 hover:text-indigo-900 text-left focus:outline-none">
                                {lesson.title}
                              </button>
                            </h5>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>

              {!showAllVideos && (
                <button
                  onClick={handleViewAllVideos}
                  className="justify-center items-center px-4 py-3 text-indigo-950 transition-all rounded-lg transform border border-indigo-950 hover:bg-indigo-950 hover:text-gray-100 mt-4"
                >
                  Show All Videos
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
}

export default Coursesdetails;
