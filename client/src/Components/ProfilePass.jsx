import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useCookies } from "react-cookie";

function ProfilePass() {
  const [userPass, setUserPass] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const [cookies] = useCookies(["token"]);
  const token = cookies.Token;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserPass({ ...userPass, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      if (!token) {
        console.error("Token not available.");
        return;
      }

      axios.defaults.headers.common["Authorization"] = token;

      const response = await axios.put(
        "http://localhost:8080/profile/updatepassword",
        userPass
      );

      console.log("User data updated!", response.data);
    } catch (error) {
      console.error("Error updating user data:", error.response);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Change Password
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Old Password
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                id="oldpassword"
                type="password"
                name="oldpassword"
                placeholder="Enter old password"
                value={userPass.oldpassword}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                id="newpassword"
                type="password"
                name="newpassword"
                placeholder="Enter new password"
                value={userPass.newpassword}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleUpdate}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePass;
