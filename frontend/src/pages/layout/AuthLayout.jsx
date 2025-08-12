const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex justify-center items-center flex-grow p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
