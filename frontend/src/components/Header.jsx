import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Header = ({ userData, isDarkMode, toggleTheme, handleLogout }) => {
    const navigate = useNavigate();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center relative rounded-b-lg">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {userData.role ? `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Dashboard` : 'My App'}
            </h1>

            <div className="flex items-center space-x-4">
                {/* Theme Toggler */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 3.325l-.707.707M5.372 5.372l-.707-.707M18.628 5.372l.707-.707M5.372 18.628l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                {/* Profile Icon and Dropdown */}
                {userData && (
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="p-2 rounded-full bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="User profile menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                                <a
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        navigate(`/${userData.role}/profile`);
                                        setIsProfileDropdownOpen(false);
                                    }}
                                >
                                    Profile
                                </a>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
