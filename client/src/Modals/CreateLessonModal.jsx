import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../Context/AuthContext";

import { useCookies } from "react-cookie";
const CreateLessonModal = ({ courseId, showModal, closeModal }) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [video, setVideo] = useState([]);
  const [image, setImage] = useState([]);
  const { headers } = useAuth();
  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
  const addVideo = (e) => {
    const selectedFile = e.target.files[0];
    setVideo([...video, selectedFile]);
  };
  const addImage = (e) => {
    const selectedFile = e.target.files[0];
    setImage([...image, selectedFile]);
  };

  

  const createLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("title", lessonTitle);
  
    
      video.forEach((file) => {
        formData.append(`video`, file);
      });
  
      
      image.forEach((file) => {
        formData.append(`image`, file);
      });
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(
        `http://localhost:8080/course/createlesson/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Lesson created:", response.data);
     
      Swal.fire({
        icon: "success",
        title: "Lesson Created Successfully!",
        showConfirmButton: false,
        timer: 1500, 
      });
  
      closeModal(); 
    } catch (error) {
   
      console.error("Error submitting FAQ:", error);
  
      
      Swal.fire({
        icon: "error",
        title: "Oops... Something went wrong!",
        text: "Please try again.",
      });
    }
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={closeModal}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-100 px-4 py-3 sm:px-6">
            <h2 className="text-lg font-bold text-gray-800">Create Lesson</h2>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <label
                htmlFor="lessonTitle"
                className="block text-gray-700 font-bold mb-2"
              >
                Lesson Title
              </label>
              <input
                type="text"
                id="lessonTitle"
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Enter lesson title"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="videoUpload"
                className="block text-gray-700 font-bold mb-2"
              >
                Upload Video
              </label>
              <input
                type="file"
                id="videoUpload"
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                onChange={addVideo}
                accept="video/*"
                multiple
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="imageUpload"
                className="block text-gray-700 font-bold mb-2"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="videoUpload"
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                onChange={addImage}
                accept="image/*"
                multiple
              />
            </div>
          </div>

          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={createLesson}
              className="w-full  rounded-md border border-transparent shadow-sm py-2 px-4 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create Lesson
            </button>
            <button
              onClick={closeModal}
              className="mt-3 w-full sm:w-auto rounded-md border border-gray-300 shadow-sm py-2 px-4 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonModal;
