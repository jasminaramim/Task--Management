import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineBars, AiOutlineClose } from 'react-icons/ai';
import { FaTachometerAlt, FaList, FaClipboardList, FaCheckCircle, FaUserCircle, FaCog } from 'react-icons/fa'; // Different icons for each route
import { GrInProgress, GrLogout } from 'react-icons/gr';
import logo from '../assets/Images/Screenshot_2025-02-20_230759-removebg-preview.png'; 
import useAuth from '../Hooks/useAuth'; 
import { MdOutlineAirlineStops } from 'react-icons/md';

const Sidebar = () => {
  const [isActive, setActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut } = useAuth();

  const handleToggle = () => {
    setActive(!isActive);
  };

  const handleLogout = () => {
    logOut();
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const isActiveLink = (path) => location.pathname === path ? 'bg-gray-700' : '';

  return (
    <>
      {isActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleToggle}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-[700px] flex flex-col justify-between space-y-6 py-4 px-2 transition-transform duration-300 ease-in-out z-50 ${isActive ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:z-auto`}
      >
        <div>
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-20 h-20" />
          </div>

          <div className="space-y-4">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard')}`}
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </Link>
            <Link 
              to="/dashboard/tasks" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard/tasks')}`}
            >
              <FaClipboardList className="mr-3" />
              Tasks
            </Link>
            <Link 
              to="/dashboard/todo" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard/todo')}`}
            >
              <MdOutlineAirlineStops className="mr-3" /> 
              To-Do
            </Link>
            <Link 
              to="/dashboard/in-progress" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard/in-progress')}`}
            >
              <GrInProgress className="mr-3"  />
              In Progress
            </Link>
            <Link 
              to="/dashboard/done" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard/done')}`}
            >
              <FaCheckCircle className="mr-3" />
              Done
            </Link>
            <Link 
              to="/dashboard/profile" 
              className={`flex items-center px-4 py-2 rounded-md ${isActiveLink('/dashboard/profile')}`}
            >
              <FaUserCircle className="mr-3" />
              Profile
            </Link>

            <div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 mt-6 text-gray-400 hover:bg-gray-700 rounded-md w-full"
              >
                <GrLogout className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className="md:hidden fixed top-4 left-4 p-3 bg-gray-800 text-white rounded-full z-50"
      >
        {isActive ? (
          <AiOutlineClose className="h-6 w-6" />
        ) : (
          <AiOutlineBars className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
