const MemberDashboard = () => {
  return (
    <main className="flex-grow flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4 animate-fadeIn">
          Welcome, Member!
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Explore your personalized content and features.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Your journey begins here.
        </p>
      </div>
    </main>
  );
};

export default MemberDashboard;