import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlineSafety } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const getProgress = () => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    if (step === "success") return 100;
    return 0;
  };

  const displayError = (message) => {
    setError(message);
    setShowError(true);

    // stay visible for 3 seconds
    setTimeout(() => {
      setShowError(false);

      // remove text after fade-out
      setTimeout(() => {
        setError("");
      }, 300);
    }, 3000);
  };

  const isValid = () => {
    if (step === 1) {
      return form.name.trim() && form.email.trim().includes("@");
    }

    if (step === 2) {
      return /^\d{10,15}$/.test(form.phone) && form.location.trim();
    }

    if (step === 3) {
      return (
        form.password.length >= 8 &&
        form.confirmPassword.length >= 8 &&
        form.password === form.confirmPassword
      );
    }

    return false;
  };

  const nextStep = async () => {
    if (!isValid()) return;

    if (step === 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: form.email,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          displayError(data.message);
          return;
        }
      } catch (error) {
        console.error(error);
        displayError("Something went wrong. Please try again.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    setLoading(true);
    setError("");

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
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            location: form.location,
            role: "jobSeeker",
          }),
        },
      );

      const data = await response.json();

      console.log(response.status);
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);

      setStep("success");

      setTimeout(() => {
        navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard");
      }, 1000);
    } catch (error) {
      displayError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">
        {/* Header */}
        <h1 className="text-center text-2xl font-bold mb-2">💼 JobPortal</h1>

        <p className="text-center text-gray-600 mb-5">
          Create your Job Seeker Account
        </p>

        {/* Google */}
        {step === 1 && (
          <>
            <GoogleLogin
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/google`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({
                        credential: credentialResponse.credential,
                        role: "jobSeeker",
                        action: "signup",
                      }),
                    },
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.message);
                  }

                  console.log(data);

                  // New Google user
                  if (
                    !data.profileComplete.phone ||
                    !data.profileComplete.location
                  ) {
                    navigate("/JobSeekerCompleteProfile");
                  }

                  // Existing user
                  else {
                    if (data.user.role === "jobSeeker") {
                      navigate("/JobSeekerDashboardTemplate");
                    } else {
                      navigate("/employer/dashboard");
                    }
                  }
                } catch (error) {
                  displayError(error.message);
                }
              }}
              onError={() => {
                displayError("Google Sign Up Failed");
              }}
            />

            <div className="flex items-center my-5">
              <hr className="flex-1" />
              <span className="px-3 text-sm text-gray-500">OR</span>
              <hr className="flex-1" />
            </div>
          </>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Profile Setup</span>
            <span>{getProgress()}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${getProgress()}%`,
              }}
            />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

            <div
              className={`
    overflow-hidden
    transition-all
    duration-300
    rounded-lg
    border
    px-4
    text-center

    ${
      error
        ? "max-h-24 py-3 mt-4 opacity-100 translate-y-0 border-red-300 bg-red-50 text-red-700"
        : "max-h-0 py-0 mt-0 opacity-0 -translate-y-2 border-transparent"
    }
  `}
            >
              {error}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value;

                if (/^\d*$/.test(value)) {
                  setForm({
                    ...form,
                    phone: value,
                  });
                }
              }}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Current Location"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password (At least should be 8 characters)"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
            {error && (
              <div
                className={`
      mt-4
      rounded-lg
      border
      border-red-300
      bg-red-50
      text-red-700
      px-4
      py-3
      text-center
      transition-all
      duration-300
      ${showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
    `}
              >
                {error}
              </div>
            )}

            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && step !== "success" && (
            <button
              onClick={prevStep}
              className="flex-1 border border-gray-300 py-3 rounded-lg"
            >
              Back
            </button>
          )}

          {step < 3 && (
            <button
              onClick={nextStep}
              disabled={!isValid()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={!isValid() || loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>

        {/* Security */}
        <p className="flex justify-center items-center gap-1 mt-6 text-sm text-gray-500">
          <AiOutlineSafety size={18} />
          Your data is safe and secure.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
