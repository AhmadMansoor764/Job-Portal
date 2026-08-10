import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaUserTie,
  FaBuilding,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

const JobSeekerCompleteProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const displayError = (message) => {
    setError(message);
    setShowError(true);

    setTimeout(() => {
      setShowError(false);

      setTimeout(() => {
        setError("");
      }, 300); // Wait for animation to finish
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      displayError("Please select your account type.");
      return;
    }

    if (!formData.phone) {
      displayError("Please insert your phone number.");
      return;
    }

    if (!formData.location) {
      displayError("Please insert your location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/complete-profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center px-4 py-2 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl "
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-7 lg:p-8 flex flex-col justify-center ">
            <div className="text-4xl lg:text-5xl mb-4">🎉</div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Welcome to
              <br />
              JobPortal
            </h1>

            <p className="mt-6 text-blue-100 text-base leading-7">
              Your Google account has been connected successfully.
              <br />
              Complete your profile to unlock your personalized dashboard.
            </p>

            <div className="mt-12">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Profile Completion</span>

                <span className="font-bold">40%</span>
              </div>

              <div className="w-full bg-blue-400/40 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="mt-8 lg:mt-12 mb-10 lg:mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Secure Google Authentication</span>
              </div>

              <div className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Create your professional profile</span>
              </div>

              <div className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Access your personalized dashboard</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="p-6 lg:p-6">
            <h2 className="text-2xl font-bold">Complete Your Profile</h2>

            <p className="text-gray-600 mt-2 mb-5">
              Tell us a little about yourself to continue.
            </p>

            {/* ROLE */}

            <div>
              <label className="font-semibold text-gray-700 text-lg">
                Choose your account type
              </label>

              <div className="grid md:grid-cols-2 gap-5 mt-4">
                {/* JOB SEEKER */}

                <div
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "jobSeeker",
                    })
                  }
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300

                  ${
                    formData.role === "jobSeeker"
                      ? "border-blue-600 bg-blue-50 shadow-xl scale-[1.02]"
                      : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <FaUserTie className="text-5xl text-blue-600" />

                    <FaCheckCircle className="text-green-500 text-2xl" />
                  </div>

                  <h3 className="font-bold text-2xl mt-6">Job Seeker</h3>

                  <p className="text-gray-600 mt-3">
                    Search jobs, apply instantly, and track your applications.
                  </p>
                </div>

                {/* EMPLOYER */}

                <div
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "employer",
                    })
                  }
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300

                  ${
                    formData.role === "employer"
                      ? "border-blue-600 bg-blue-50 shadow-xl scale-[1.02]"
                      : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <FaBuilding className="text-5xl text-blue-600" />

                    {formData.role === "employer" && (
                      <FaCheckCircle className="text-green-500 text-2xl" />
                    )}
                  </div>

                  <h3 className="font-bold text-xl mt-4">Employer</h3>

                  <p className="text-gray-600 mt-3">
                    Post jobs, manage applicants, and hire top talent.
                  </p>
                </div>
              </div>
            </div>

            {/* INPUTS */}

            <div className="grid md:grid-cols-2 gap-5 mt-6">
              <div>
                <label className="font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="mt-2 flex items-center border-2 border-gray-300 rounded-xl px-4 py-2.5">
                  <FaPhoneAlt className="text-gray-500 mr-3" />

                  <input
                    type="text"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Location</label>

                <div className="mt-2 flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
                  <FaMapMarkerAlt className="text-gray-500 mr-3" />

                  <input
                    type="text"
                    placeholder="Kabul, Afghanistan"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    className="w-full outline-none"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>

            {/* ERROR */}

            {error && (
              <div
                className={`mt-4 border rounded-xl py-1 px-3 transition-all duration-300
      ${showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      bg-red-100 border-red-300 text-red-600`}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobSeekerCompleteProfile;
