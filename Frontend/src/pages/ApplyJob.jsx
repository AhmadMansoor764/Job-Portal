import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaLaptopHouse,
  FaDollarSign,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
} from "react-icons/fa";
import { formatSalary } from "../utils/formatSalary";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // JOB STATE
  // =====================================================

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [jobError, setJobError] = useState("");

  const [cvError, setCvError] = useState("");

  // =====================================================
  // USER STATE
  // =====================================================

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState("");

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    coverLetter: "",
    cv: null,
  });

  const [formErrors, setFormErrors] = useState({});

  // =====================================================
  // SUBMIT STATE
  // =====================================================

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // =====================================================
  // FETCH JOB
  // =====================================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoadingJob(true);
        setJobError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load job");
        }

        setJob(data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
        setJobError(error.message);
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id]);

  // =====================================================
  // FETCH CURRENT USER
  // =====================================================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        setUserError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Please log in to apply");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
        setUserError(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  const handleCvChange = (event) => {
    const file = event.target.files[0];

    setCvError("");

    if (!file) {
      setFormData((previous) => ({
        ...previous,
        cv: null,
      }));
      return;
    }

    // Only PDF files
    if (file.type !== "application/pdf") {
      setCvError("Please upload your CV as a PDF file.");
      event.target.value = "";

      setFormData((previous) => ({
        ...previous,
        cv: null,
      }));

      return;
    }

    // Maximum 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setCvError("CV file size must be less than 5 MB.");
      event.target.value = "";

      setFormData((previous) => ({
        ...previous,
        cv: null,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      cv: file,
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const errors = {};

    if (!formData.coverLetter.trim()) {
      errors.coverLetter = "Please write a short cover letter.";
    } else if (formData.coverLetter.trim().length < 50) {
      errors.coverLetter =
        "Your cover letter should be at least 50 characters.";
    }

    if (!formData.cv) {
      errors.cv = "Please upload your CV.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setFormErrors({});

    const errors = {};

    if (!formData.coverLetter.trim()) {
      errors.coverLetter = "Cover letter is required";
    }

    if (!formData.cv) {
      errors.cv = "Please upload your CV";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("coverLetter", formData.coverLetter);
      data.append("cv", formData.cv);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}/apply`,
        {
          method: "POST",
          credentials: "include",
          body: data,
        },
      );

      const result = await response.json();

      console.log("Application response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application");
      }

      alert("Application submitted successfully!");

      navigate(`/my-applications/${result.application._id}`);
    } catch (error) {
      console.error("Submit application error:", error);

      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingJob || loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Preparing application...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // USER ERROR
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-7 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
            <FaUser className="text-blue-600 text-xl" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Login required
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            You need to be logged in as a job seeker before applying for a job.
          </p>

          {userError && (
            <p className="text-sm text-red-500 mt-3">{userError}</p>
          )}

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="
                px-5
                py-2.5
                rounded-xl
                border
                border-slate-200
                text-sm
                font-semibold
                text-slate-700
                hover:bg-slate-50
                transition
              "
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/login")}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-blue-600
                text-white
                text-sm
                font-semibold
                hover:bg-blue-700
                transition
              "
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // JOB ERROR
  // =====================================================

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-7 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load job
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {jobError || "The requested job could not be found."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="
              mt-6
              px-6
              py-2.5
              rounded-xl
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // JOB DATA
  // =====================================================

  const salary = formatSalary(job.minSalary, job.maxSalary);

  const location = [job.city, job.country].filter(Boolean).join(", ");

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mt-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Apply for this Job
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Review your information and submit your application.
          </p>
        </div>

        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-7 mt-7">
          {/* =================================================
              APPLICATION FORM
          ================================================= */}

          <main>
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              {/* =================================================
                  APPLICANT INFORMATION
              ================================================= */}

              <section className="p-6 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Your Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    This information comes from your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {/* NAME */}

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Full Name
                    </label>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                      "
                    >
                      <FaUser className="text-slate-400 text-sm" />

                      <span className="text-sm text-slate-800">
                        {user.name || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Email
                    </label>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                      "
                    >
                      <FaEnvelope className="text-slate-400 text-sm" />

                      <span className="text-sm text-slate-800 truncate">
                        {user.email || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Phone
                    </label>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                      "
                    >
                      <FaPhone className="text-slate-400 text-sm" />

                      <span className="text-sm text-slate-800">
                        {user.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Location
                    </label>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                      "
                    >
                      <FaMapMarkerAlt className="text-slate-400 text-sm" />

                      <span className="text-sm text-slate-800">
                        {user.location || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  COVER LETTER
              ================================================= */}

              <section className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Cover Letter
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Tell the employer why you are a good fit for this position.
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="coverLetter"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Your message
                  </label>

                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={9}
                    placeholder="Write your cover letter here..."
                    className={`
                      w-full
                      mt-2
                      px-4
                      py-3
                      rounded-xl
                      border
                      bg-white
                      text-sm
                      text-slate-800
                      placeholder:text-slate-400
                      outline-none
                      resize-none
                      transition
                      ${
                        formErrors.coverLetter
                          ? "border-red-300 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      }
                    `}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-400">
                      Minimum 50 characters
                    </p>

                    <p className="text-xs text-slate-400">
                      {formData.coverLetter.length} characters
                    </p>
                  </div>

                  {formErrors.coverLetter && (
                    <p className="text-xs text-red-500 mt-2">
                      {formErrors.coverLetter}
                    </p>
                  )}
                </div>
              </section>

              {/* =================================================
                  CV PLACEHOLDER
              ================================================= */}

              {/* =================================================
    CV UPLOAD
================================================= */}

              <section className="px-6 pb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    CV / Resume
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Upload your latest CV for the employer to review.
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="cv"
                    className={`
        relative
        flex
        flex-col
        items-center
        justify-center
        w-full
        min-h-[180px]
        px-6
        py-8
        rounded-xl
        border-2
        border-dashed
        cursor-pointer
        transition
        ${
          cvError || formErrors.cv
            ? "border-red-300 bg-red-50"
            : formData.cv
              ? "border-green-300 bg-green-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
        }
      `}
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;

                        setFormData((previous) => ({
                          ...previous,
                          cv: file,
                        }));

                        setFormErrors((previous) => ({
                          ...previous,
                          cv: "",
                        }));
                      }}
                    />

                    {formData.cv ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <FaPaperPlane className="text-green-600 text-lg" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-green-700 text-center break-all">
                          {formData.cv.name}
                        </p>

                        <p className="text-xs text-green-600 mt-1">
                          {(formData.cv.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        <p className="text-xs text-slate-500 mt-3">
                          Click to replace your CV
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                          <FaPaperPlane className="text-blue-600 text-lg" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          Upload your CV
                        </p>

                        <p className="text-xs text-slate-500 mt-1 text-center">
                          Click here to choose your PDF CV
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                          PDF only • Maximum 5 MB
                        </p>
                      </>
                    )}
                  </label>

                  {(cvError || formErrors.cv) && (
                    <p className="text-xs text-red-500 mt-2">
                      {cvError || formErrors.cv}
                    </p>
                  )}

                  {formData.cv && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((previous) => ({
                          ...previous,
                          cv: null,
                        }));

                        setCvError("");
                        setFormErrors((previous) => ({
                          ...previous,
                          cv: "",
                        }));
                      }}
                      className="
          mt-3
          text-xs
          font-semibold
          text-red-500
          hover:text-red-600
          transition
        "
                    >
                      Remove CV
                    </button>
                  )}
                </div>
              </section>

              {/* =================================================
                  SUBMIT ERROR
              ================================================= */}

              {submitError && (
                <div className="px-6 pb-6">
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                </div>
              )}

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:items-center
                  sm:justify-end
                  gap-3
                  px-6
                  py-5
                  border-t
                  border-slate-200
                  bg-slate-50/70
                  rounded-b-2xl
                "
              >
                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-2.5
                    rounded-xl
                    bg-blue-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-blue-700
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>

          {/* =================================================
              JOB SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <section
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                p-5
              "
            >
              <h2 className="text-lg font-bold text-slate-900">Job Summary</h2>

              {/* COMPANY */}

              <div className="flex items-start gap-3 mt-5">
                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <FaBuilding className="text-blue-600 text-lg" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">
                    {job.company}
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {job.title}
                  </h3>
                </div>
              </div>

              {/* DETAILS */}

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-400">Location</p>

                    <p className="text-sm font-medium text-slate-700">
                      {location || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-400">Job Type</p>

                    <p className="text-sm font-medium text-slate-700">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaLaptopHouse className="text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-400">Work Mode</p>

                    <p className="text-sm font-medium text-slate-700">
                      {job.workMode || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-400">Salary</p>

                    <p className="text-sm font-medium text-slate-700">
                      {salary}
                    </p>
                  </div>
                </div>
              </div>

              {/* CLOSED JOB */}

              {job.status !== "active" && (
                <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    This job is no longer accepting applications.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
