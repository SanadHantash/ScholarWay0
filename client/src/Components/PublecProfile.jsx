import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useCookies } from "react-cookie";

function PublecProfile() {
  const [userInfo, setUserInfo] = useState({

    username: "",
    email: ""
  

  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.error("Token not available.");
          return;
        }

        axios.defaults.headers.common["Authorization"] = token;

        const response = await axios.get("http://localhost:8080/profile");

        setUserInfo(response.data.info[0]);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response);
      }
    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };



  const handleUpdate = async () => {
    try {
      if (!token) {
        console.error("Token not available.");
        return;
      }

      axios.defaults.headers.common["Authorization"] = token;

      const response = await axios.put(
        "http://localhost:8080/profile/updateinfo",
        userInfo
      );

      console.log("User data updated!", response.data);
    } catch (error) {
      console.error("Error updating user data:", error.response);
    }
  };





  return (
    <>
    <main className="w-full min-h-screen md:w-2/3 lg:w-3/4">
      <div className="p-2 md:p-4">
        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
          <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="w-full">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
              >
                Your Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userInfo.username}
                onChange={handleInputChange}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                placeholder="Your username"
              />
            </div>
            <div className="mb-2 sm:mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                placeholder="your.email@mail.com"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleUpdate}
                className="text-white bg-indigo-950 hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
  
  );
}

export default PublecProfile;
