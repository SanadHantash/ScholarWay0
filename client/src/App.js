import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Home from "./Pages/Home";


import Courses from "./Pages/Courses";
import Coursesdetails from "./Pages/Coursesdetails";
import Details from "./Pages/Details"

import NotFound from "./Pages/NotFound";


import Profile from "./Pages/Profile"


import Header from "./Components/Header";
import Footer from "./Components/Footer";

import { useAuth } from "./Context/AuthContext";
function App() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
         

            {isLoggedIn ? (
              <>
             
              </>
            ) : (
              <Route path="/profile" element={<LoginPage />} />
            )}
            <>
             
            </>
           
            
         
            <Route path="/courses" element={<Courses />} />
            <Route path="/courseDetails/:id" element={<Coursesdetails />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/details/:id" element={<Details />} />
            
          
      
  
          </Routes>
          <Footer />
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
