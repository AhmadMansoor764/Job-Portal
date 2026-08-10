import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaLinkedin,
  FaUsers,
  FaCalendarAlt,
  FaIndustry,
  FaBriefcase,
  FaBullseye,
  FaExternalLinkAlt,
} from "react-icons/fa";

const EmployerProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH EMPLOYER PROFILE
  // =====================================================

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/api/profile/employer",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch employer profile.",
          );
        }

        setProfile(result.profile);
      } catch (error) {
        console.error("Employer profile error:", error);

        setError(error.message || "Failed to load employer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerProfile();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading company profile...
          </p>
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
            <FaBuilding className="text-lg" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load company profile
          </h2>

          <p className="text-sm text-slate-500 mt-2 leading-6">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // =====================================================
  // DISPLAY VALUES
  // =====================================================

  const companyName = profile.name || "Company Name";

  const companyHeadline =
    profile.headline || "Building the future through great people.";

  const companyDescription =
    profile.bio || "This company has not added a company description yet.";

  const companyMission =
    profile.companyMission ||
    "This company has not added a mission statement yet.";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* =====================================================
    BACK TO EMPLOYER DASHBOARD
===================================================== */}
        <button
          type="button"
          onClick={() => navigate("/employer/dashboard")}
          className="
    inline-flex
    items-center
    gap-2
    mb-5
    text-sm
    font-semibold
    text-slate-600
    hover:text-blue-600
    transition
  "
        >
          <FaArrowLeft className="text-xs" />
          Back to Employer Dashboard
        </button>

        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}
        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* COVER */}

          <div className="h-28 sm:h-36 bg-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-white to-slate-100" />

            <div className="absolute inset-0 opacity-40">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-slate-200 blur-3xl" />

              <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-slate-200 blur-3xl" />
            </div>
          </div>

          {/* PROFILE CONTENT */}

          <div className="px-5 sm:px-8 lg:px-10 pb-7">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* COMPANY IDENTITY */}

              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 relative">
                {/* COMPANY LOGO */}

                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-slate-100 shadow-lg overflow-hidden">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <FaBuilding className="text-3xl text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* COMPANY NAME */}

                <div className="pb-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
                      {companyName}
                    </h1>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      Employer
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-2xl">
                    {companyHeadline}
                  </p>
                </div>
              </div>

              {/* EDIT BUTTON */}

              <div className="flex items-center">
                <button
                  onClick={() => navigate("/employer-profile/edit")}
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

            {/* CONTACT / QUICK INFORMATION */}

            <div className="mt-7 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
                {profile.location && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaMapMarkerAlt className="text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaEnvelope className="text-slate-400" />
                    <span>{profile.email}</span>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaPhone className="text-slate-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}

                {profile.industry && (
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <FaIndustry className="text-slate-400" />
                    <span>{profile.industry}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 mt-6">
          {/* =================================================
              MAIN COLUMN
          ================================================= */}

          <main className="space-y-6">
            {/* ABOUT COMPANY */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Company
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    About the Company
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
                  title="Edit company information"
                >
                  <FaEdit className="text-xs" />
                </button>
              </div>

              <p className="mt-5 text-sm sm:text-[15px] leading-7 text-slate-600 max-w-4xl whitespace-pre-line">
                {companyDescription}
              </p>
            </section>

            {/* COMPANY OVERVIEW */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Overview
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Company Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Key information about the organization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CompanyDetail
                  icon={<FaIndustry />}
                  label="Industry"
                  value={profile.industry}
                />

                <CompanyDetail
                  icon={<FaBuilding />}
                  label="Company Type"
                  value={profile.companyType}
                />

                <CompanyDetail
                  icon={<FaUsers />}
                  label="Company Size"
                  value={profile.companySize}
                />

                <CompanyDetail
                  icon={<FaCalendarAlt />}
                  label="Founded"
                  value={profile.foundedYear}
                />
              </div>
            </section>

            {/* MISSION */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Purpose
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Our Mission
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  What drives the company forward.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <FaBullseye className="text-slate-700 text-sm" />
                  </div>

                  <p className="text-sm sm:text-[15px] text-slate-600 leading-7 whitespace-pre-line">
                    {companyMission}
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* CONTACT */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Contact
              </p>

              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Contact Information
              </h2>

              <div className="mt-6 space-y-5">
                <ContactItem
                  icon={<FaEnvelope />}
                  label="Email"
                  value={profile.email}
                />

                <ContactItem
                  icon={<FaPhone />}
                  label="Phone"
                  value={profile.phone}
                />

                <ContactItem
                  icon={<FaMapMarkerAlt />}
                  label="Location"
                  value={profile.location}
                />
              </div>
            </section>

            {/* ONLINE PRESENCE */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Links
              </p>

              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Online Presence
              </h2>

              <div className="mt-5 space-y-3">
                {profile.companyWebsite ? (
                  <ExternalLink
                    icon={<FaGlobe />}
                    label="Company Website"
                    href={profile.companyWebsite}
                  />
                ) : (
                  <EmptyLink label="Company Website" />
                )}

                {profile.companyLinkedin ? (
                  <ExternalLink
                    icon={<FaLinkedin />}
                    label="LinkedIn"
                    href={profile.companyLinkedin}
                  />
                ) : (
                  <EmptyLink label="LinkedIn" />
                )}
              </div>
            </section>

            {/* EDIT PROFILE CARD */}

            <section className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaBuilding className="text-sm" />
              </div>

              <h2 className="font-bold text-base">
                Keep your company profile updated
              </h2>

              <p className="text-sm text-slate-300 leading-6 mt-2">
                A complete company profile helps candidates understand your
                organization and creates more trust in your job listings.
              </p>

              <button
                onClick={() => navigate("/employer-profile/edit")}
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
                Edit company profile
                <span className="text-xs">→</span>
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// COMPANY DETAIL
// =====================================================

const CompanyDetail = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-sm">{icon}</span>

        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-800 mt-3 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
};

// =====================================================
// CONTACT ITEM
// =====================================================

const ContactItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>

        <p className="text-sm text-slate-700 mt-1 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

// =====================================================
// EXTERNAL LINK
// =====================================================

const ExternalLink = ({ icon, label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3.5
        hover:border-slate-300
        hover:bg-slate-50
        transition
        group
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">
          {label}
        </span>
      </div>

      <FaExternalLinkAlt className="text-[10px] text-slate-400 group-hover:text-slate-700 flex-shrink-0" />
    </a>
  );
};

// =====================================================
// EMPTY LINK
// =====================================================

const EmptyLink = ({ label }) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3.5">
      <p className="text-sm font-medium text-slate-400">{label}</p>

      <p className="text-xs text-slate-400 mt-1">Not provided</p>
    </div>
  );
};

export default EmployerProfile;
