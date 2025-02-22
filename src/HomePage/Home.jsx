import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import welcomeAnimation from "../assets/welcome.json"; // Lottie Animation
import useAuth from "../hooks/useAuth"; // Import authentication hook

const Home = () => {
  const { user } = useAuth(); // Get current user
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]);

  return (
    <div className="relative h-screen flex flex-col justify-center items-center text-white">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?task,workspace')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Lottie Animation */}
        <div className="w-60 mb-6">
          <Lottie animationData={welcomeAnimation} loop={true} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Task Manager</h1>
        <p className="mt-2 text-lg md:text-xl text-gray-300">
          Organize your tasks efficiently and stay productive!
        </p>

        {/* Get Started Button */}
        <Link to="/login" className="mt-6 px-6 py-3 text-lg font-semibold bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 transition">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
