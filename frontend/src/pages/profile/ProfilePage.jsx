import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const ProfilePage = ({ profileData, updateUser }) => {
  const [fullName, setFullName] = useState(profileData.fullName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    setFullName(profileData.fullName);
  }, [profileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName) {
      setError('Full Name cannot be empty.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && !currentPassword) {
      setError('Current password is required to change password.');
      return;
    }

    const updatedFields = {
      fullName: fullName,
    };

    if (newPassword) {
      updatedFields.currentPassword = currentPassword;
      updatedFields.newPassword = newPassword;
    }

    try {
      const res = await axios.post("/api/users/update", {
        ...updatedFields
      });
      updateUser(res.data);
      setSuccessMessage('Profile updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Current Password (leave blank if not changing)
            </label>
            <input
              type="password"
              id="currentPassword"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="********"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              New Password (leave blank if not changing)
            </label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Update Profile
          </button>
          {error && <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-xs italic mt-4 text-center">{successMessage}</p>}
        </form>
        <div className="text-center mt-6">
          <button
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold focus:outline-none"
          >
            <Link to={`/${profileData.role}/dashboard`}>
              ← Back to Dashboard
            </Link>

          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;