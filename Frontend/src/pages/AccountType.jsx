import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AccountType = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center px-6 pt-8">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Choose How You Want to Use JobPortal
        </h2>

        <p className="text-gray-600 my-3 text-lg">
          Select the account type that best describes you.
        </p>
      </div>

      {message && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                  w-[90%] max-w-2xl
                  rounded-xl border border-blue-200
                  bg-blue-50 shadow-lg
                  px-6 py-4
                  flex gap-3"
        >
          <div className="text-2xl">ℹ️</div>

          <div>
            <h3 className="font-semibold text-blue-800">No account found</h3>

            <p className="text-blue-700 mt-1">{message}</p>
          </div>
          <button
            onClick={() => setMessage("")}
            className="fixed right-2 text-blue-500 hover:text-blue-700"
          >
            <IoClose size={20} />
          </button>
        </div>
      )}
      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Job Seeker Card */}
        <div
          onClick={() => navigate("/signup/jobseeker")}
          className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-500"
        >
          <span className="mb-4 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
            Most Popular
          </span>
          <div className="bg-blue-100 p-5 rounded-full mb-5">
            <FaUserTie size={50} className="text-blue-600" />
          </div>

          <h3 className="text-2xl font-semibold text-gray-800">Job Seeker</h3>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Build your profile, discover jobs, apply with one click, and track
            every application from one place.
          </p>

          <button className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Create Job Seeker Account
            <FaArrowRight size={14} />
          </button>
        </div>

        {/* Employer Card */}
        <div
          onClick={() => navigate("/signup/employer")}
          className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-500 mb-5 sm:mb-0"
        >
          <span className="mb-4 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
            For Recuirters
          </span>
          <div className="bg-indigo-100 p-5 rounded-full mb-5">
            <MdBusinessCenter size={50} className="text-indigo-600" />
          </div>

          <h3 className="text-2xl font-semibold text-gray-800">Employer</h3>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Post jobs, manage candidates, review applications, and hire the best
            talent faster.
          </p>

          <button className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
            Create Employer Account
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>

      <p className="mt-10 text-gray-500 text-sm text-center">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default AccountType;
