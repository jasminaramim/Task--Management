import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdTaskAlt } from "react-icons/md"; // Task management icon
import useAuth from "../Hooks/useAuth";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login.json"; // Import Lottie animation
import LoadingSpinner from "../Spinner/LoadingSpinner";

const Login = () => {
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace />;
  if (loading) return <LoadingSpinner />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    try {
      await signIn(email.value, password.value);
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      console.error(err.code, err.message);
      toast.error(
        err.code === "auth/user-not-found"
          ? "User not found. Please sign up."
          : err.code === "auth/wrong-password"
          ? "Incorrect password. Try again."
          : "Login failed. Try again later."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[url('/winter-bg.jpg')] bg-cover bg-no-repeat bg-center px-4">
      
      <div className="relative max-w-2xl mt-10 mb-20 w-full bg-gray-300 bg-opacity-90 shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start">
        
        {/* Left Side: Lottie Animation */}
        <div className="w-full mt-16  md:w-1/2 flex justify-center">
          <Lottie animationData={loginAnimation} loop className="w-[200px] lg:block hidden sm:w-32 md:w-80 lg:w-96" />
        </div>
  
        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6">
          <div className="text-center">
            <MdTaskAlt size={40} className="text-blue-800 mx-auto mb-2" />
            <h2 className="text-2xl font-semibold text-blue-900">Login</h2>
            <p className="text-sm text-gray-500">Access your task dashboard</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-medium"
            >
              {loading ? <TbFidgetSpinner className="animate-spin m-auto" /> : "Login"}
            </button>
          </form>
  
          <button className="mt-3 text-sm text-blue-700 hover:underline block text-center">
            Forgot password?
          </button>
  
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-blue-700"></div>
            <p className="text-xs text-gray-500 px-2">or</p>
            <div className="flex-1 h-px bg-blue-700"></div>
          </div>
  
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 w-full border py-2 rounded-md border-blue-700 text-blue-700 hover:bg-blue-100 transition text-sm"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
  
          <p className="mt-4 text-xs text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/registration" className="text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
