import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import  useAuth  from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Task<span className="text-yellow-300">Manager</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/tasks" className="hover:text-yellow-300">Tasks</Link>
            {user && <Link to="/profile" className="hover:text-yellow-300">Profile</Link>}
            {user ? (
              <button onClick={logout} className="hover:text-yellow-300">Logout</button>
            ) : (
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center py-4 space-y-4 bg-blue-700">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/tasks" onClick={() => setMenuOpen(false)}>Tasks</Link>
            {user && <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>}
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
