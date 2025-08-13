import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminDashboard from "../admin/AdminDashboard";
import MemberDashboard from "../member/MemberDashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "../profile/ProfilePage";

const HomeLayout = ({ userData, isDarkMode, toggleTheme, handleLogout, updateUser }) => {
    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header userData={userData} isDarkMode={isDarkMode} toggleTheme={toggleTheme} handleLogout={handleLogout} updateUser={updateUser} />
            <Routes>
                <Route path="dashboard" element={userData.role === "admin" ? <AdminDashboard /> : <MemberDashboard />} />
                <Route path="profile" element={<ProfilePage profileData={userData} updateUser={updateUser} />} />
                <Route path="*" element={<Navigate to={`/${userData.role}/dashboard`} replace />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default HomeLayout;
