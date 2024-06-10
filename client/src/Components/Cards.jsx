import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Cards() {
  const [courseData, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/home/allcourses"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="absolute top-60 -left-10 rounded-full border border-[#799351] p-3  transform -translate-y-1/2 transition bg-[#799351] text-white z-10"
      onClick={() => {
        console.log("Prev button clicked");
        onClick();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5 rtl:rotate-180"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
  const CustomNextArrow = ({ onClick }) => (
    <button
      className="absolute ml-4 top-60 -right-10 rounded-full border border-[#799351] p-3 bg-[#799351] text-white transform -translate-y-1/2 transition  z-10"
      onClick={onClick}
    >
      <svg
        className="h-5 w-5 rtl:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 5l7 7-7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="mt-20 my-8 lg:my-10 lg:mt-20 container px-6 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <h3 className=" font_heading text-4xl leading-tight text-[#799351] dark:text-gray-100">
            Check our Latest Courses
          </h3>
        </div>
        <div className="mt-6 md:mt-0 px-6">
          <Link to="/courses">
          <button className="linear rounded-[20px] bg-[#799351] px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-[#A1DD70] active:bg-brand-700">
              View All
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white flex justify-center items-center py-6 md:w-full   ">
        <div className="container mx-auto px-4 ">
          <Slider {...settings}>
            {courseData && courseData.courses ? (
              courseData.courses.map((course) => (
                <div
                  key={course.id}
                  className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4 border border-solid p-10"
                  // style={{ width: "300px", minHeight: "400px" }}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      className="w-full h-48 rounded-xl object-cover mb-4"
                      src={course.image}
                      alt={course.title}
                    />
                  </div>
                  <h1 className="text-gray-800 text-xl font-bold cursor-pointer h-16">
                    {course.title}
                  </h1>
                  <div className="my-4">
                    <div className="flex space-x-1 items-center">
                      <div className="flex flex-col">
                    
                        <div className="flex flex-row">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-indigo-950 mb-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          <p className="px-2 font-bold ">By {course.username}</p>
                        </div>
                      </div>
                    </div>
                    <Link to={`/courseDetails/${course.id}`}>
                      <button className="w-1/2 block mx-auto rounded-full bg-[#799351] hover:shadow-lg font-semibold text-white px-6 py-2">
                        View Course
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Slider>
        </div>
      </div>
    </>
  );
}

export default Cards;
