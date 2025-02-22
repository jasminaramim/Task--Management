import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { TbChecklist, TbList } from 'react-icons/tb';  // Corrected icon import
import { FaUsers } from 'react-icons/fa';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { imageUpload } from '../Api/util';

const Registration = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;
    const image = form.image.files[0];
    const team = form.team.value;
  
    // Password match validation
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
  
    let photoURL;
    try {
      // Image upload
      photoURL = await imageUpload(image);
    } catch (error) {
      toast.error("Image upload failed");
      return;
    }
  
    try {
      // 1. User Registration
      const result = await createUser(email, password);
  
      // 2. Save username, profile photo, and additional information
      await updateUserProfile(name, photoURL);
  
      // 3. Save user info (including team and image URL)
      const user = { name, email, team, photoURL, role: 'member' };
  
      // Send user info to backend (store in database)
      const response = await fetch(`http://localhost:9000/users/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (data.success) {
        navigate('/');
        toast.success('Signup Successful');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.message || "Signup failed");
    }
  };
  

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
  
      // Get the team value from the form
      const form = document.querySelector('form');
      const team = form ? form.team.value : ''; // Ensure we get a string, not an object
  
      // Check if the user object is valid
      if (user) {
        // Prepare user data for backend
        const response = await fetch(`http://localhost:9000/users/${user.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            team, // Ensure this is a string value
            role: 'member',
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          navigate('/');
          toast.success('Signup Successful');
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error('User not authenticated');
      }
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error("Google Sign-In Error:", error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row max-w-4xl w-full p-6 rounded-md sm:p-10 bg-white text-gray-900">
        
        {/* Left Side: About Task Manager */}
        <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="my-3 text-4xl font-bold text-blue-600">Task Manager</h1>
          <p className="text-sm text-gray-400">Manage your tasks efficiently</p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <TbChecklist size={24} className="text-blue-600" />
              <p className="text-sm text-gray-600">Organize your tasks</p>
            </div>
            <div className="flex items-center gap-2">
              <TbList size={24} className="text-blue-600" />
              <p className="text-sm text-gray-600">Track progress</p>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers size={24} className="text-blue-600" />
              <p className="text-sm text-gray-600">Collaborate with your team</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate="" className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm text-gray-700">
                Select Avatar Image:
              </label>
              <input required type="file" id="image" name="image" accept="image/*" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="team" className="block mb-2 text-sm text-gray-700">
                Team (Optional)
              </label>
              <input
                type="text"
                name="team"
                id="team"
                placeholder="Enter Your Team Name"
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block mb-2 text-sm text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
                required
              />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
              >
                Login here
              </Link>
            </p>

            <div className="flex items-center justify-between">
              <div className="flex-1 h-px sm:w-16 dark:bg-gray-500"></div>
              <p className="px-4 text-sm text-gray-400">or</p>
              <div className="flex-1 h-px sm:w-16 dark:bg-gray-500"></div>
            </div>

            <div className="flex justify-center items-center mt-4">
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center gap-2 bg-white rounded-lg border py-2 px-4 w-full hover:bg-gray-100"
              >
                <FcGoogle />
                Sign Up with Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
