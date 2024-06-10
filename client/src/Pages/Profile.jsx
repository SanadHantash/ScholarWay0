import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCookies } from "react-cookie";
import ProfilePass from "../Components/ProfilePass";

import PublecProfile from "../Components/PublecProfile";
import Courses from "../Components/ProfileCourses";


function Profile() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("userProfile");
  const [userInfo, setUserInfo] = useState([]);

  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />

      <div class="bg-white w-full flex flex-col gap-5 mt-16 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <button
          className="md:hidden fixed bottom-5 right-5 z-50 p-3 bg-indigo-950 text-white rounded"
          onClick={toggleSidebar}
        >
          {showSidebar ? "Close" : "Menu"}
        </button>
        <aside
          className={`${
            showSidebar ? "block" : "hidden"
          } md:block py-4 md:w-1/3 lg:w-1/4 `}
        >
          <div class="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 class="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <button
              className={`flex items-center px-3 py-2.5 font-bold  border rounded-full ${
                activeTab === "userProfile"
                  ? "bg-white  text-indigo-900"
                  : "bg-white"
              }`}
              onClick={() => setActiveTab("userProfile")}
            >
              Public Profile
            </button>
            <button
              className={`flex items-center px-3 py-2.5 font-bold  border rounded-full ${
                activeTab === "pass" ? "bg-white  text-indigo-900" : "bg-white"
              }`}
              onClick={() => setActiveTab("pass")}
            >
              Change Password
            </button>
            {userInfo.role === "teacher" ? (
              <button
                className={`flex items-center px-3 py-2.5 font-bold  border rounded-full ${
                  activeTab === "mycourses"
                    ? "bg-white  text-indigo-900"
                    : "bg-white"
                }`}
                onClick={() => setActiveTab("mycourses")}
              >
                mycourses
              </button>
            ) : (
           <>
           </>
            )}

       
          </div>
        </aside>
        <div className="w-4/5 p-4 h-full  bg-white  rounded-lg border-b-2 border-r-2 flex-grow ">
          {activeTab === "userProfile" && <PublecProfile />}
          {activeTab === "pass" && <ProfilePass />}
          {activeTab === "mycourses" && <Courses />}
        </div>
      </div>
    </>
  );
}

export default Profile;
