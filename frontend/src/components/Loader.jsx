const Loader = () => {
    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex flex-grow justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-300"></div>
            </div>
        </div>
    );
};

export default Loader;