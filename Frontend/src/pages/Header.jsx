import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-gray-100 px-4 sm:px-6 lg:px-12 py-4 sm:py-5 border-b-2 border-gray-300">
      {/* Logo */}
      <h1 className="text-xl sm:text-2xl font-bold">JobPortal</h1>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/login"
          className="px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-indigo-600 hover:text-white transition-colors duration-300"
        >
          Login
        </Link>

        <Link
          to="/accountType"
          className="px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:scale-105 transition"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;
