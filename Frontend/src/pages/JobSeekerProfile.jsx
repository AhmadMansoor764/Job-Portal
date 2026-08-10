import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ProfessionalLinksSection from "./ProfessionalLinksSection";
import ResumeSection from "./ResumeSection";

import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaTrash,
  FaCamera,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

const JobSeekerProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:8000/api/profile/me", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
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
  // PROFILE COMPLETION
  // =====================================================
  const profileCompletionItems = [
    {
      label: "Basic information",
      completed: Boolean(
        user?.name && user?.email && user?.phone && user?.location,
      ),
      weight: 15,
    },
    {
      label: "Profile photo",
      completed: Boolean(user?.profileImage),
      weight: 10,
    },
    {
      label: "Professional headline",
      completed: Boolean(user?.headline?.trim()),
      weight: 10,
    },
    {
      label: "About Me",
      completed: Boolean(user?.bio?.trim()),
      weight: 10,
    },
    {
      label: "Skills",
      completed: Boolean(user?.skills?.length > 0),
      weight: 15,
    },
    {
      label: "Experience",
      completed: Boolean(user?.experience?.length > 0),
      weight: 15,
    },
    {
      label: "Education",
      completed: Boolean(user?.education?.length > 0),
      weight: 10,
    },
    {
      label: "Projects",
      completed: Boolean(user?.projects?.length > 0),
      weight: 10,
    },
    {
      label: "Professional links",
      completed: Boolean(
        user?.linkedinUrl?.trim() ||
        user?.githubUrl?.trim() ||
        user?.portfolioUrl?.trim(),
      ),
      weight: 2.5,
    },
    {
      label: "Resume",
      completed: Boolean(user?.resume?.url),
      weight: 2.5,
    },
  ];

  const profileCompletion = profileCompletionItems.reduce(
    (total, item) => total + (item.completed ? item.weight : 0),
    0,
  );

  const completedItems = profileCompletionItems.filter(
    (item) => item.completed,
  ).length;

  // =====================================================
  // PROFILE IMAGE UPLOAD
  // =====================================================

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("Image must be smaller than 1MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("profileImage", file);

      const response = await fetch(
        "http://localhost:8000/api/profile/profile-image",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload profile image");
      }

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: data.profileImage,
      }));
    } catch (error) {
      console.error("Profile image upload error:", error);
      alert(error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // =====================================================
  // REMOVE PROFILE IMAGE
  // =====================================================

  const handleRemoveProfileImage = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?",
    );

    if (!confirmed) return;

    try {
      setUploadingImage(true);

      const response = await fetch(
        "http://localhost:8000/api/profile/profile-image",
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove profile image");
      }

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: "",
      }));
    } catch (error) {
      console.error("Remove profile image error:", error);
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <span className="text-lg font-bold">!</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load profile
          </h2>

          <p className="text-sm text-slate-500 mt-2 leading-6">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="
              mt-6
              px-5
              py-2.5
              rounded-xl
              bg-slate-900
              text-white
              text-sm
              font-semibold
              hover:bg-slate-800
              transition
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* =====================================================
BACK TO DASHBOARD
===================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard")
            }
            className="
      flex
      items-center
      gap-2
      text-sm
      font-medium
      text-slate-600
      hover:text-blue-600
      transition
    "
          >
            <FaArrowLeft className="text-xs" />

            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* =====================================================
PROFILE HEADER
===================================================== */}

        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* SUBTLE HEADER */}
          <div className="h-24 sm:h-32 bg-slate-100 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-white to-slate-100 opacity-70" />
          </div>

          {/* PROFILE CONTENT */}
          <div className="px-5 sm:px-8 lg:px-10 pb-7">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* PROFILE IDENTITY */}

              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 relative">
                {/* PROFILE IMAGE */}

                <div className="relative group flex-shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    id="profileImageInput"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />

                  <label
                    htmlFor="profileImageInput"
                    className="
                      relative
                      block
                      w-24
                      h-24
                      sm:w-28
                      sm:h-28
                      rounded-2xl
                      border-4
                      border-white
                      bg-slate-100
                      shadow-lg
                      overflow-hidden
                      cursor-pointer
                    "
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-3xl text-slate-400" />
                      </div>
                    )}

                    {/* HOVER */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-slate-900/60
                        opacity-0
                        group-hover:opacity-100
                        transition
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <FaCamera className="text-sm mb-1" />

                      <span className="text-[11px] font-semibold">
                        Change photo
                      </span>
                    </div>

                    {/* UPLOADING */}

                    {uploadingImage && (
                      <div
                        className="
                          absolute
                          inset-0
                          bg-slate-900/70
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </label>

                  {/* REMOVE */}

                  {user.profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      disabled={uploadingImage}
                      title="Remove profile photo"
                      className="
                        absolute
                        -right-2
                        -bottom-2
                        w-8
                        h-8
                        rounded-full
                        bg-white
                        border
                        border-slate-200
                        shadow-md
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-red-500
                        hover:bg-red-50
                        transition
                        disabled:opacity-50
                        z-10
                      "
                    >
                      <FaTrash className="text-[11px]" />
                    </button>
                  )}
                </div>

                {/* NAME */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {user.name}
                    </h1>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      Job Seeker
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1.5">
                    Open to new opportunities
                  </p>
                </div>
              </div>

              {/* EDIT BUTTON */}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-slate-900
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-slate-800
                    transition
                    shadow-sm
                  "
                >
                  <FaEdit className="text-xs" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* CONTACT INFORMATION */}

            <div className="mt-7 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
                {user.location && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaMapMarkerAlt className="text-slate-400" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.email && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaEnvelope className="text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaPhone className="text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 mt-6">
          {/* =================================================
              MAIN PROFILE
          ================================================= */}

          <main className="space-y-6">
            {/* ABOUT */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    About
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    About Me
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/profile/edit")}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-slate-400
                    hover:text-slate-900
                    hover:bg-slate-100
                    transition
                  "
                  title="Edit about"
                >
                  <FaEdit className="text-xs" />
                </button>
              </div>

              <p className="mt-5 text-sm sm:text-[15px] leading-7 text-slate-600 max-w-3xl">
                {user.bio ||
                  "You haven't added a professional summary yet. Add a short introduction about yourself, your experience, and your career goals."}
              </p>
            </section>

            {/* PROJECTS */}

            <ProjectsSection />

            {/* SKILLS */}

            <SkillsSection />

            {/* EXPERIENCE */}

            <ExperienceSection />

            {/* EDUCATION */}

            <EducationSection />

            {/* PROFESSIONAL LINKS */}

            <ProfessionalLinksSection />

            {/* RESUME */}

            <ResumeSection />
          </main>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* PROFILE STRENGTH */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Profile
                  </p>

                  <h2 className="font-bold text-slate-900 mt-1">
                    Profile strength
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">
                    {Math.round(profileCompletion)}%
                  </span>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="mt-5">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round(profileCompletion)}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {completedItems} of {profileCompletionItems.length} sections
                  completed
                </p>
              </div>

              {/* CHECKLIST */}

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
                {profileCompletionItems.map((item) => (
                  <ProfileItem
                    key={item.label}
                    label={item.label}
                    completed={item.completed}
                  />
                ))}
              </div>
            </section>

            {/* PROFILE TIP */}

            <section className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaUser className="text-sm text-white" />
              </div>

              <h2 className="font-bold text-base">
                Make your profile stronger
              </h2>

              <p className="text-sm text-slate-300 leading-6 mt-2">
                Complete your profile with relevant skills, experience,
                education and projects to give employers a clearer picture of
                your background.
              </p>

              <button
                onClick={() => navigate("/profile/edit")}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-white
                  hover:text-slate-300
                  transition
                "
              >
                Complete profile
                <FaArrowRight className="text-[10px]" />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// PROFILE COMPLETION ITEM
// =====================================================

const ProfileItem = ({ label, completed }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          w-5
          h-5
          rounded-full
          flex
          items-center
          justify-center
          flex-shrink-0
          ${
            completed
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400"
          }
        `}
      >
        {completed ? (
          <FaCheck className="text-[9px]" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        )}
      </div>

      <span
        className={`text-sm ${completed ? "text-slate-700" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
};

export default JobSeekerProfile;
