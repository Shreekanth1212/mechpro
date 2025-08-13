import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomeLayout from "./pages/layout/HomeLayout";
import AuthLayout from "./pages/layout/AuthLayout";
import Loader from "./components/Loader";
import RoleProtectedRoute from "./pages/layout/RoleProtectedRoute";

axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
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

   useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          setUserData(null);
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if (loading) return <Loader />;


  return (
    <Routes>
      <Route
        path="/login"
        element={
          userData ? (
            <Navigate to={`/${userData.role}/dashboard`} replace />
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
            <Navigate to={`/${userData.role}/dashboard`} replace />
          ) : (
            <AuthLayout>
              <Signup onLogin={setUserData} />
            </AuthLayout>
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <RoleProtectedRoute userData={userData} allowedRoles={["admin"]}>
            <HomeLayout
              userData={userData}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
              updateUser={setUserData}
            />
          </RoleProtectedRoute>
        }
      />

      {/* Member Routes */}
      <Route
        path="/member/*"
        element={
          <RoleProtectedRoute userData={userData} allowedRoles={["member"]}>
            <HomeLayout
              userData={userData}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
              updateUser={setUserData}
            />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate to={userData ? `/${userData.role}/dashboard` : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default App;
