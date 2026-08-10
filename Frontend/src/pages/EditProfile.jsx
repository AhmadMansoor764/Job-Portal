import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    headline: "",
    bio: "",
  });

  // =====================================================
  // GET CURRENT PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        console.log("PROFILE API RESPONSE:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const profile = data.user;

        setFormData({
          phone: profile.phone || "",
          location: profile.location || "",
          headline: profile.headline || "",
          bio: profile.bio || "",
        });
      } catch (error) {
        console.error("Profile error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/basic`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully.");

      // Give the user a moment to see success message
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Update your basic professional information.
          </p>
        </div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* =================================================
                  PHONE
              ================================================= */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="
                    w-full
                    px-4
                    py-2.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kabul, Afghanistan"
                  className="
                    w-full
                    px-4
                    py-2.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* =================================================
                  HEADLINE
              ================================================= */}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Professional Headline
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.headline.length}/120
                  </span>
                </div>

                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  maxLength={120}
                  placeholder="e.g. Full Stack MERN Developer"
                  className="
                    w-full
                    px-4
                    py-2.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                <p className="text-xs text-slate-400 mt-1.5">
                  A short professional description that appears below your name.
                </p>
              </div>

              {/* =================================================
                  BIO
              ================================================= */}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    About Me
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.bio.length}/1000
                  </span>
                </div>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={7}
                  placeholder="Tell employers about yourself, your skills, experience, goals, and what kind of opportunities you are looking for."
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    outline-none
                    resize-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                <p className="text-xs text-slate-400 mt-1.5">
                  Keep your introduction clear and professional.
                </p>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="
                  px-5
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  font-semibold
                  text-slate-600
                  hover:bg-slate-50
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-blue-700
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <FaSave />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
