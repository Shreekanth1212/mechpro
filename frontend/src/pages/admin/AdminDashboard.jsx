const AdminDashboard = () => {
    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 animate-fadeIn">
                    Welcome, Admin!
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    This is your exclusive administration panel.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Here you can manage users, content, and application settings.
                </p>
            </div>
        </main>
    );
};
export default AdminDashboard;