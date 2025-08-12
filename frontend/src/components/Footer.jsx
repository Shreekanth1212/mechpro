const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto p-4 text-center text-gray-600 dark:text-gray-400 text-sm rounded-t-lg">
            <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        </footer>
    );
};

export default Footer;