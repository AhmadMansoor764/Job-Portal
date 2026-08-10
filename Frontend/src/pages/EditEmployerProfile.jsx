import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaCamera,
  FaCheck,
  FaGlobe,
  FaIndustry,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaBriefcase,
  FaInfoCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api/profile";

const EditEmployerProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
    companyType: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    companyWebsite: "",
    companyLinkedin: "",
    companyMission: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH EMPLOYER PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/employer`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch employer profile.",
          );
        }

        const profile = result.profile;

        setFormData({
          name: profile?.name || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          headline: profile?.headline || "",
          bio: profile?.bio || "",
          companyType: profile?.companyType || "",
          industry: profile?.industry || "",
          companySize: profile?.companySize || "",
          foundedYear: profile?.foundedYear || "",
          companyWebsite: profile?.companyWebsite || "",
          companyLinkedin: profile?.companyLinkedin || "",
          companyMission: profile?.companyMission || "",
        });

        setProfileImage(profile?.profileImage || "");
      } catch (error) {
        console.error("Fetch employer profile error:", error);
        setError(error.message || "Failed to load your company profile.");
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

    setError("");
    setSuccess("");
  };

  // =====================================================
  // HANDLE PROFILE IMAGE
  // =====================================================

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PNG, JPG, JPEG, or WEBP image.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setProfileImage(previewUrl);

    try {
      setUploadingImage(true);

      const imageFormData = new FormData();

      imageFormData.append("profileImage", file);

      const response = await fetch(`${API_URL}/profile-image`, {
        method: "PUT",
        credentials: "include",
        body: imageFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload company logo.");
      }

      setProfileImage(result.profileImage || "");
      setSelectedImage(null);

      setSuccess("Company logo updated successfully.");
    } catch (error) {
      console.error("Upload company logo error:", error);

      setError(error.message || "Failed to upload company logo.");

      setProfileImage("");
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =====================================================
  // DELETE PROFILE IMAGE
  // =====================================================

  const handleDeleteImage = async () => {
    if (!profileImage) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your company logo?",
    );

    if (!confirmed) return;

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/profile-image`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove company logo.");
      }

      setProfileImage("");
      setSelectedImage(null);

      setSuccess("Company logo removed successfully.");
    } catch (error) {
      console.error("Delete company logo error:", error);

      setError(error.message || "Failed to remove company logo.");
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Company name is required.");
      return false;
    }

    if (formData.headline.length > 120) {
      setError("Company tagline cannot exceed 120 characters.");
      return false;
    }

    if (formData.bio.length > 1000) {
      setError("Company description cannot exceed 1000 characters.");
      return false;
    }

    if (formData.companyMission.length > 1000) {
      setError("Company mission cannot exceed 1000 characters.");
      return false;
    }

    if (formData.foundedYear) {
      const year = Number(formData.foundedYear);
      const currentYear = new Date().getFullYear();

      if (!Number.isInteger(year) || year < 1800 || year > currentYear) {
        setError(`Founded year must be between 1800 and ${currentYear}.`);
        return false;
      }
    }

    return true;
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/employer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          headline: formData.headline.trim(),
          bio: formData.bio.trim(),
          companyType: formData.companyType.trim(),
          industry: formData.industry.trim(),
          companySize: formData.companySize || "",
          foundedYear: formData.foundedYear,
          companyWebsite: formData.companyWebsite.trim(),
          companyLinkedin: formData.companyLinkedin.trim(),
          companyMission: formData.companyMission.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update company profile.");
      }

      setSuccess("Company profile updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Update employer profile error:", error);

      setError(error.message || "Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-11 h-11 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/employer-profile")}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <FaArrowLeft className="text-xs" />
              Back to Profile
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <FaBuilding className="text-slate-700 text-sm" />
              </div>

              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Employer
                </p>

                <p className="text-sm font-bold text-slate-900">
                  Company Profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 lg:py-10">
        {/* =====================================================
            PAGE INTRO
        ===================================================== */}

        <div className="max-w-4xl mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Company settings
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">
            Edit company profile
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-3 leading-7 max-w-2xl">
            Keep your company information accurate and professional so
            candidates can understand your organization before applying.
          </p>
        </div>

        {/* =====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 flex items-start gap-3 text-sm text-red-700">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <FaTimes className="text-xs" />
            </div>

            <div className="flex-1">
              <p className="font-bold">Something went wrong</p>

              <p className="mt-0.5 leading-6">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 transition"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 flex items-center gap-3 text-sm text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <FaCheck className="text-xs" />
            </div>

            <span className="font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
            {/* =================================================
                STICKY COMPANY PANEL
            ================================================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start space-y-5">
              {/* COMPANY IDENTITY */}

              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="h-20 bg-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />

                  <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/5" />
                  <div className="absolute -left-10 -bottom-16 w-36 h-36 rounded-full bg-white/5" />
                </div>

                <div className="px-6 pb-6">
                  {/* LOGO */}

                  <div className="relative -mt-10 flex justify-center">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white bg-slate-100 shadow-xl flex items-center justify-center">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Company logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaBuilding className="text-4xl text-slate-300" />
                        )}

                        {uploadingImage && (
                          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                            <div className="w-7 h-7 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      <label
                        htmlFor="profileImage"
                        className={`absolute -right-2 -bottom-2 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-800 transition ${
                          uploadingImage ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <FaCamera className="text-xs" />

                        <input
                          ref={fileInputRef}
                          id="profileImage"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <h2 className="font-bold text-lg text-slate-900 truncate">
                      {formData.name || "Your Company"}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      {formData.industry || "Company profile"}
                    </p>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-xs text-slate-400" />
                      </div>

                      <span className="truncate">
                        {formData.location || "Location not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <FaUsers className="text-xs text-slate-400" />
                      </div>

                      <span>
                        {formData.companySize || "Company size not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    {profileImage && !uploadingImage && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                      >
                        Remove company logo
                      </button>
                    )}

                    {!profileImage && (
                      <p className="text-center text-[11px] text-slate-400 leading-5">
                        Upload a clear company logo.
                        <br />
                        PNG, JPG or WEBP · Maximum 5MB
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* PROFILE CHECKLIST */}

              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FaCheck className="text-slate-700 text-xs" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Profile checklist
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Keep these details complete
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <ChecklistItem
                    label="Company name"
                    completed={Boolean(formData.name.trim())}
                  />

                  <ChecklistItem
                    label="Company tagline"
                    completed={Boolean(formData.headline.trim())}
                  />

                  <ChecklistItem
                    label="Company description"
                    completed={Boolean(formData.bio.trim())}
                  />

                  <ChecklistItem
                    label="Industry"
                    completed={Boolean(formData.industry.trim())}
                  />

                  <ChecklistItem
                    label="Location"
                    completed={Boolean(formData.location.trim())}
                  />

                  <ChecklistItem
                    label="Website or LinkedIn"
                    completed={Boolean(
                      formData.companyWebsite.trim() ||
                      formData.companyLinkedin.trim(),
                    )}
                  />

                  <ChecklistItem
                    label="Company mission"
                    completed={Boolean(formData.companyMission.trim())}
                  />
                </div>
              </section>

              {/* STICKY TIP */}

              <section className="rounded-3xl bg-slate-900 p-6 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaInfoCircle className="text-sm" />
                </div>

                <h3 className="font-bold mt-5">Build candidate trust</h3>

                <p className="text-sm text-slate-300 leading-6 mt-2">
                  Clear company information gives candidates confidence before
                  they decide to apply.
                </p>
              </section>
            </aside>

            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <div className="min-w-0 space-y-6">
              {/* BASIC INFORMATION */}

              <FormCard
                icon={<FaBuilding />}
                title="Basic Information"
                description="The primary information candidates will see about your company."
              >
                <div className="space-y-5">
                  <Input
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. TechNova Solutions"
                    required
                  />

                  <Input
                    label="Account Email"
                    name="email"
                    value={formData.email}
                    disabled
                    placeholder="company@example.com"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+93 700 000 000"
                      icon={<FaPhone />}
                    />

                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Kabul, Afghanistan"
                      icon={<FaMapMarkerAlt />}
                    />
                  </div>

                  <TextareaCounter
                    label="Company Tagline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    rows={3}
                    maxLength={120}
                    placeholder="e.g. Building technology for a better future."
                  />
                </div>
              </FormCard>

              {/* COMPANY DETAILS */}

              <FormCard
                icon={<FaIndustry />}
                title="Company Details"
                description="Help candidates understand the nature, size, and history of your organization."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectInput
                    label="Company Type"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    options={[
                      "Startup",
                      "Private Company",
                      "Public Company",
                      "Nonprofit",
                      "Government",
                      "Agency",
                      "Educational Institution",
                      "Other",
                    ]}
                    placeholder="Select company type"
                  />

                  <Input
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Information Technology"
                    icon={<FaIndustry />}
                  />

                  <SelectInput
                    label="Company Size"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    options={[
                      "1-10",
                      "11-50",
                      "51-200",
                      "201-500",
                      "501-1000",
                      "1001-5000",
                      "5001-10000",
                      "10000+",
                    ]}
                    placeholder="Select company size"
                  />

                  <Input
                    label="Founded Year"
                    name="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    placeholder="e.g. 2018"
                    min="1800"
                    max={new Date().getFullYear()}
                    icon={<FaCalendarAlt />}
                  />
                </div>
              </FormCard>

              {/* ABOUT COMPANY */}

              <FormCard
                icon={<FaBriefcase />}
                title="About Your Company"
                description="Tell candidates what your company does and what makes your organization different."
              >
                <TextareaCounter
                  label="Company Description"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={8}
                  maxLength={1000}
                  placeholder="Tell candidates about your company, what you do, the problems you solve, and what makes your organization unique..."
                  helper="A clear description helps candidates understand your organization."
                />
              </FormCard>

              {/* ONLINE PRESENCE */}

              <FormCard
                icon={<FaGlobe />}
                title="Online Presence"
                description="Give candidates official places where they can learn more about your company."
              >
                <div className="space-y-5">
                  <Input
                    label="Company Website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                    icon={<FaGlobe />}
                  />

                  <Input
                    label="Company LinkedIn"
                    name="companyLinkedin"
                    value={formData.companyLinkedin}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/company/example"
                    icon={<FaLinkedin />}
                  />
                </div>
              </FormCard>

              {/* MISSION */}

              <FormCard
                icon={<FaCheck />}
                title="Company Mission"
                description="Share the purpose and values that drive your organization."
              >
                <TextareaCounter
                  label="Mission Statement"
                  name="companyMission"
                  value={formData.companyMission}
                  onChange={handleChange}
                  rows={7}
                  maxLength={1000}
                  placeholder="What does your company aim to achieve? What values guide your work?"
                />
              </FormCard>

              {/* SAVE */}

              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <p className="font-bold text-slate-900">
                      Ready to save your changes?
                    </p>

                    <p className="text-sm text-slate-500 mt-1.5 leading-6">
                      Your updated company profile will be visible to
                      candidates.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => navigate("/employer-profile")}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || uploadingImage}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="text-xs" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

// =====================================================
// FORM CARD
// =====================================================

const FormCard = ({ icon, title, description, children }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-7">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="text-sm text-slate-500 mt-1.5 leading-6">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

// =====================================================
// INPUT
// =====================================================

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  type = "text",
  min,
  max,
  icon,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-full ${
            icon ? "pl-10" : "px-4"
          } pr-4 py-3.5 rounded-xl border border-slate-200 text-sm outline-none transition ${
            disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed"
              : "bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          }`}
        />
      </div>
    </div>
  );
};

// =====================================================
// TEXTAREA COUNTER
// =====================================================

const TextareaCounter = ({
  label,
  name,
  value,
  onChange,
  rows = 5,
  maxLength,
  placeholder,
  helper,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none resize-y placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition"
      />

      <div className="flex items-start justify-between gap-4 mt-2">
        <span className="text-xs text-slate-400 leading-5">{helper || ""}</span>

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

// =====================================================
// SELECT
// =====================================================

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// =====================================================
// CHECKLIST ITEM
// =====================================================

const ChecklistItem = ({ label, completed }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          completed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-300"
        }`}
      >
        {completed ? (
          <FaCheck className="text-[8px]" />
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

export default EditEmployerProfile;
