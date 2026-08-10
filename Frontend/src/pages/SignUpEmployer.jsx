import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { CiMail, CiLocationOn, CiPhone } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdBusiness } from "react-icons/md";

const SignupEmployer = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // NEXT STEP
  // ==========================================

  const nextStep = () => {
    setError("");
    setStep((s) => s + 1);
  };

  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  // ==========================================
  // REGISTER EMPLOYER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            location: formData.location,

            // VERY IMPORTANT
            role: "employer",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      console.log("Employer registered:", data);

      // Only navigate AFTER backend registration succeeds
      navigate("/EmployerDashboard");
    } catch (error) {
      console.error(error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* HEADER */}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">💼 JobPortal</h1>

          <h2 className="text-3xl font-bold mt-2">Create Employer Account</h2>

          <p className="text-gray-600 mt-1">Step {step} of 3</p>

          {/* Progress Bar */}

          <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{
                width: `${(step / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* CARD */}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-6 md:p-8"
        >
          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ==========================================
              STEP 1
          ========================================== */}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">
                Company Information
              </h3>

              {/* Company Name */}

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <MdBusiness />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Email */}

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <CiMail />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Company Email"
                  className="w-full outline-none"
                  required
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* ==========================================
              STEP 2
          ========================================== */}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Contact Details</h3>

              {/* Phone */}

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <CiPhone />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Location */}

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <CiLocationOn />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Company Location"
                  className="w-full outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 3
          ========================================== */}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Security</h3>

              {/* Password */}

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <RiLockPasswordLine />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full outline-none"
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>

              {/* Create Account */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Back */}

              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupEmployer;
