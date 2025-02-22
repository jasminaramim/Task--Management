import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { FaEdit, FaEnvelope } from 'react-icons/fa'; // Importing icons from react-icons

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // Track if user is editing
  const [newName, setNewName] = useState(''); // Track the new name

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state changes (handles reloads)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
        setNewName(currentUser.displayName || ''); // Set initial value for name
      } else {
        setUser(null); // No user found
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking authentication state
  }

  if (!user) {
    return <div>No user found. Please log in.</div>; // If no user, prompt to log in
  }

  const handleEditClick = () => {
    setEditing(true); // Enable editing
  };

  const handleSaveClick = () => {
    const auth = getAuth();
    updateProfile(auth.currentUser, { displayName: newName })
      .then(() => {
        // Successfully updated the name in Firebase
        setUser({ ...user, name: newName });
        setEditing(false); // Disable editing
      })
      .catch((error) => {
        console.error('Error updating name:', error);
      });
  };

  const handleCancelClick = () => {
    setEditing(false); // Cancel editing
    setNewName(user.name); // Reset the name to original value
  };

  return (
    <div className="m-14 max-w-4xl mx-auto bg-blue-200 shadow-lg rounded-xl p-8 space-y-8">
      <h2 className="text-4xl font-semibold text-center text-gray-800">Welcome, {user.name}</h2>
      <div className="flex flex-col items-center gap-4 bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <img
            src={user.photoURL || 'https://img.freepik.com/free-vector/time-management-landing-page_52683-475.jpg?uid=R121149122&ga=GA1.1.1810294565.1709915967&semt=ais_hybrid'} // Fallback if no photoURL
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            {editing ? (
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-2 border rounded-md text-center"
                />
              </div>
            ) : (
              <p className="text-2xl font-semibold text-gray-700">{user.name}</p>
            )}
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:text-gray-900"
            >
              <FaEdit />
            </button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FaEnvelope className="text-red-600" />
            <p className="text-lg text-red-500">{user.email}</p>
          </div>
        </div>
        <div className="space-x-4 text-center">
          {editing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
