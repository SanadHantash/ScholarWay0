import React, { useState } from "react";
import axios from "axios";
import background from "../Assets/background.jpg";
import FormHeader from "../Components/FormHeader";

import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function RegisterPage() {
  const [cookies, setCookie] = useCookies(["token"]);
  useState(() => {
    window.scrollTo(0, 0);
  }, []);
  const { isLoggedIn, login, logout, register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: 1,
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      alert("Passwords do not match");

      return; // Prevent further execution
    }
    // eslint-disable-next-line no-lone-blocks
    {
      try {
        const response = await axios.post(
          "http://localhost:8080/register",
          formData
        );
        const token = response.data.token;

        Swal.fire({
          icon: "success",
          title: "You've Successfully Registered !",
          text: "Welcome to our website :).",
        });
        setCookie("Token", token, { path: "/" });
        navigate("/");
      } catch (error) {
        console.error("Error registering user:", error);

        if (error.response) {
          console.error("Server responded with status:", error.response.status);
          console.error("Response data:", error.response.data);
          setError(error.response.data.error);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }
    }
  };
  return (
    <>
      <div
        className="min-h-full flex items-center justify-center mt-12 py-12 px-4 sm:px-6 lg:px-8 "
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-md w-full space-y-8">
          <section class="bg-gray-50 dark:bg-gray-900 ">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 py-8">
              <div class="p-6 sm:p-8  lg:py-0">
                <div class="flex flex-col   lg:py-0">
                  <FormHeader
                    heading="Signup to create an account"
                    paragraph="Already have an account? "
                    linkName="Login"
                    linkUrl="/login"
                  />
                  <form
                    class=" space-y-4 md:space-y-6 mb-10"
                    onSubmit={handleSubmit}
                  >
                    <div></div>
                    <div>
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        UserName
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 focus:z-10 sm:text-sm"
                        placeholder="username"
                        required=""
                      />
                      {error !== null && error.includes("user_name") && (
                        <div className="bg-red-100 border mt-3 border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                          <p className="text-red-500">
                            User name must be at least 3 characters long
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 focus:z-10 sm:text-sm"
                        placeholder="name@company.com"
                        required=""
                      />
                      {error !== null && error.includes("email") && (
                        <div className="bg-red-100 border mt-3 border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                          <p className="text-red-500">
                            Email must be a Gmail address
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 focus:z-10 sm:text-sm"
                        required=""
                      />
                      {error !== null && error.includes("password") && (
                        <div className="bg-red-100 border mt-3 border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                          <p className="text-red-500">
                            Password must be at least 8 characters long and
                            include at least one uppercase letter, one lowercase
                            letter, one number, and one of @, #, !, $, %, or &."
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 focus:z-10 sm:text-sm"
                        required=""
                      />
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <label className="font-bold">Signup As</label>
                      <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleInputChange}
                        className="border rounded-md px-2 py-1 mb-2 w-full"
                         required=""
                      >
                        <option value={1}>Student</option>
                        <option value={2}>Teacher</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#799351] hover:bg-[#A1DD70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                    >
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0">
                        Sign Up
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default RegisterPage;
