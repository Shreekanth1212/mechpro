import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomeLayout from "./pages/layout/HomeLayout";
import AuthLayout from "./pages/layout/AuthLayout";

axios.defaults.withCredentials = true;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    axios.get("/api/auth/me")
      .then(res => {
        setUserData(res.data);
      })
      .catch(() => {
        setUserData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if (loading) return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-grow justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-300"></div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          userData ? (
            <Navigate to={`/${userData.role}/dashboard`} />
          ) : (
            <AuthLayout>
              <Login onLogin={setUserData} />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/signup"
        element={
          userData ? (
            <Navigate to={`/${userData.role}/dashboard`} />
          ) : (
            <AuthLayout>
              <Signup onLogin={setUserData} />
            </AuthLayout>
          )
        }
      />
      <Route path="/:role/*" element={
        userData ? (
          <HomeLayout userData={userData} isDarkMode={isDarkMode} toggleTheme={toggleTheme} handleLogout={handleLogout} updateUser={setUserData} />
        ) : (
          <Navigate to="/login" />
        )
      }
      />

      <Route path="*" element={<Navigate to={userData ? `/${userData.role}/dashboard` : "/login"} />} />
    </Routes>
  );
}

export default App;
