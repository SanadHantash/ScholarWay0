import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import background from "../Assets/background.jpg";
import FormHeader from "../Components/FormHeader";

import { useAuth } from "../Context/AuthContext";


const LoginPage = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        formData
      );
      const { token } = response.data || {};
      if (token) {
        Cookies.set("Token", token);
        login(token);
        console.log("Login successful", response.data);
        navigate("/");
      } else {
        console.error("Token not found in response");
      }
    } catch (error) {
      console.error("Error logging in", error);

      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <div
        className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-md mt-20  w-full space-y-8">
          <section className="bg-gray-50 dark:bg-gray-900">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div class="flex flex-col  px-6 py-8 mx-auto  lg:py-0">
                  <FormHeader
                    heading="Login to your account"
                    paragraph="Don't have an account yet? "
                    linkName="Signup"
                    linkUrl="/signup"
                  />
                  <form class="space-y-4 md:space-y-6" onSubmit={handleLogin}>
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
                        placeholder="name@gmail.com"
                        required=""
                      />
                      {error !== null && error.includes("email") && (
                        <div className="bg-red-100 border mt-3 border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                          <p className="text-sm">
                            Invalid Email, Please try again.
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
                          <p className="text-sm">
                            Invalid Password, Please try again.
                          </p>
                        </div>
                      )}
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-start">
                        <div class="ml-3 text-sm">
                          <Link to="/emailForgot">
                            <button class="text-gray-500 dark:text-gray-300">
                              Forgot your password?
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#799351] hover:bg-[#A1DD70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                    >
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0">
                        Sign In
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
};

export default LoginPage;
