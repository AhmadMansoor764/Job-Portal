import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch, CiFilter, CiCalendar } from "react-icons/ci";
import { formatSalary } from "../utils/formatSalary";
import {
  FaBriefcase,
  FaLaptopHouse,
  FaDollarSign,
  FaChevronDown,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaClock,
  FaBuilding,
} from "react-icons/fa";

// =====================================================
// COUNTRIES
// =====================================================

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Italy",
  "Japan",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Pakistan",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

// =====================================================
// COUNTRY DROPDOWN
// =====================================================

const CountryDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          h-12
          flex
          items-center
          justify-between
          px-4
          bg-white
          border
          border-slate-200
          rounded-xl
          hover:border-blue-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
          transition-all
          duration-200
        "
      >
        <div className="flex items-center gap-3 min-w-0">
          <FaMapMarkerAlt className="text-slate-400 flex-shrink-0" />

          <span
            className={`truncate ${
              value ? "text-slate-700" : "text-slate-400"
            }`}
          >
            {value || "Select Country"}
          </span>
        </div>

        <FaChevronDown
          className={`
            text-slate-400
            flex-shrink-0
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            mt-2
            z-[100]
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-xl
            overflow-hidden
          "
        >
          <div className="max-h-60 overflow-y-auto py-2">
            {countries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                }}
                className={`
                  w-full
                  text-left
                  px-4
                  py-2.5
                  text-sm
                  transition-colors
                  duration-150
                  ${
                    value === country
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// JOB CARD
// =====================================================

const JobCard = ({ job, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        sm:p-6
        cursor-pointer
        hover:border-blue-300
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all
        duration-200
      "
    >
      {/* TOP */}

      <div className="flex gap-4">
        {/* Company Logo */}

        <div
          className="
            w-14
            h-14
            rounded-xl
            bg-blue-50
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <div
            className="
    w-14
    h-14
    rounded-xl
    bg-blue-50
    flex
    items-center
    justify-center
    flex-shrink-0
    overflow-hidden
  "
          >
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company || "Company"}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaBriefcase />
            )}
          </div>
        </div>

        {/* Job Information */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <h3
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-slate-900
                  group-hover:text-blue-600
                  transition-colors
                "
              >
                {job.title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">{job.company}</p>
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* JOB DETAILS */}

      <div className="flex flex-wrap gap-x-5 gap-y-3 mt-5 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-slate-400" />
          {job.city}, {job.country}
        </div>

        <div className="flex items-center gap-2">
          <FaBriefcase className="text-slate-400" />
          {job.jobType}
        </div>

        <div className="flex items-center gap-2">
          <FaLaptopHouse className="text-slate-400" />
          {job.workMode}
        </div>

        <div className="flex items-center gap-2">
          <FaDollarSign className="text-slate-400" />
          {formatSalary(job.minSalary, job.maxSalary)}
        </div>
      </div>

      {/* DESCRIPTION */}

      <p className="text-sm text-slate-600 mt-5 leading-6 line-clamp-2">
        {job.description}
      </p>

      {/* SKILLS */}

      <div className="flex flex-wrap gap-2 mt-5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="
              px-3
              py-1
              rounded-full
              bg-slate-100
              text-slate-600
              text-xs
              font-medium
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* BOTTOM */}

      <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="
            px-5
            py-2.5
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            active:scale-[0.98]
            transition-all
          "
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// =====================================================
// FIND JOBS
// =====================================================

const FindJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    country: "",
    city: "",
    jobType: "",
    workMode: "",
    minSalary: "",
    maxSalary: "",
    datePosted: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs`,
        );

        const data = await response.json();
        console.log("Jobs received from backend:", data.jobs);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.jobs);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setFilters({
      country: "",
      city: "",
      jobType: "",
      workMode: "",
      minSalary: "",
      maxSalary: "",
      datePosted: "",
    });

    setSearch("");
  };

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.trim().toLowerCase();

      // SEARCH
      const searchMatch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.skills?.some((skill) => skill.toLowerCase().includes(searchText));

      // COUNTRY
      const countryMatch =
        !filters.country ||
        job.country?.toLowerCase() === filters.country.toLowerCase();

      // CITY
      const cityMatch =
        !filters.city ||
        job.city?.toLowerCase().includes(filters.city.toLowerCase());

      // JOB TYPE
      const jobTypeMatch = !filters.jobType || job.jobType === filters.jobType;

      // WORK MODE
      const workModeMatch =
        !filters.workMode || job.workMode === filters.workMode;

      // MINIMUM SALARY
      const minSalaryMatch =
        !filters.minSalary ||
        Number(job.maxSalary) >= Number(filters.minSalary);

      // MAXIMUM SALARY
      const maxSalaryMatch =
        !filters.maxSalary ||
        Number(job.minSalary) <= Number(filters.maxSalary);

      return (
        searchMatch &&
        countryMatch &&
        cityMatch &&
        jobTypeMatch &&
        workModeMatch &&
        minSalaryMatch &&
        maxSalaryMatch
      );
    });
  }, [jobs, search, filters]);
  // =====================================================
  // ACTIVE FILTERS
  // =====================================================

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "",
  ).length;

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    console.log({
      search,
      ...filters,
    });
  };

  // =====================================================
  // OPEN JOB DETAILS
  // =====================================================

  const openJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="
      inline-flex
      items-center
      gap-2
      mb-5
      text-sm
      font-medium
      text-slate-500
      hover:text-blue-600
      transition-colors
      duration-200
      group
    "
          >
            <FaArrowLeft
              className="
        text-sm
        transition-transform
        duration-200
        group-hover:-translate-x-1
      "
            />
            Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Find Jobs
          </h1>

          <p className="mt-2 text-slate-500">
            Find the perfect opportunity for your next career move.
          </p>
        </div>

        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div
              className="
                flex
                items-center
                flex-1
                border
                border-slate-200
                rounded-xl
                px-4
                h-12
                focus-within:border-blue-500
                focus-within:ring-4
                focus-within:ring-blue-100
                transition
              "
            >
              <CiSearch className="text-2xl text-slate-400 flex-shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, keyword..."
                className="
                  w-full
                  ml-2
                  outline-none
                  text-slate-700
                  placeholder:text-slate-400
                  bg-transparent
                "
              />
            </div>

            <button
              onClick={handleSearch}
              className="
                h-12
                px-8
                rounded-xl
                bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-700
                active:scale-[0.98]
                transition-all
                duration-200
              "
            >
              Search Jobs
            </button>

            {/* Mobile Filter Button */}

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="
                lg:hidden
                h-12
                px-5
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-700
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-slate-50
                transition
              "
            >
              <CiFilter className="text-xl" />
              Filters
              {hasActiveFilters && (
                <span
                  className="
                    flex
                    items-center
                    justify-center
                    w-5
                    h-5
                    rounded-full
                    bg-blue-600
                    text-white
                    text-xs
                  "
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mt-6">
          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside
            className={`
    ${showFilters ? "block" : "hidden"}
    lg:block
    bg-white
    rounded-2xl
    border
    border-slate-200
    shadow-sm
    h-fit
    relative

    lg:sticky
    lg:top-6
    lg:self-start
  `}
          >
            {/* Filter Header */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-slate-200
              "
            >
              <div className="flex items-center gap-2">
                <CiFilter className="text-xl text-blue-600" />

                <h2 className="font-bold text-slate-900">Filters</h2>
              </div>

              <button
                onClick={clearFilters}
                className="
                  text-sm
                  text-blue-600
                  font-medium
                  hover:text-blue-800
                  transition
                "
              >
                Clear All
              </button>
            </div>

            {/* Filter Content */}

            <div className="p-5 space-y-7">
              {/* LOCATION */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-sm text-blue-600" />

                  <h3 className="font-semibold text-slate-900">Location</h3>
                </div>

                <CountryDropdown
                  value={filters.country}
                  onChange={(value) => handleFilterChange("country", value)}
                />

                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  placeholder="City"
                  className="
                    w-full
                    mt-3
                    border
                    border-slate-200
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    transition
                  "
                />
              </div>

              {/* JOB TYPE */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaBriefcase className="text-sm text-blue-600" />

                  <h3 className="font-semibold text-slate-900">Job Type</h3>
                </div>

                <div className="space-y-3">
                  {["Full-time", "Part-time", "Internship", "Contract"].map(
                    (type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={filters.jobType === type}
                          onChange={(e) =>
                            handleFilterChange("jobType", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-600"
                        />

                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                          {type}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* WORK MODE */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaLaptopHouse className="text-sm text-blue-600" />

                  <h3 className="font-semibold text-slate-900">Work Mode</h3>
                </div>

                <div className="space-y-3">
                  {["Remote", "On-site", "Hybrid"].map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="workMode"
                        value={mode}
                        checked={filters.workMode === mode}
                        onChange={(e) =>
                          handleFilterChange("workMode", e.target.value)
                        }
                        className="w-4 h-4 accent-blue-600"
                      />

                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SALARY */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaDollarSign className="text-sm text-blue-600" />

                  <h3 className="font-semibold text-slate-900">Salary</h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={filters.minSalary}
                    onChange={(e) =>
                      handleFilterChange("minSalary", e.target.value)
                    }
                    placeholder="Min"
                    className="
                      w-full
                      min-w-0
                      border
                      border-slate-200
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      transition
                    "
                  />

                  <span className="text-slate-400">—</span>

                  <input
                    type="number"
                    min="0"
                    value={filters.maxSalary}
                    onChange={(e) =>
                      handleFilterChange("maxSalary", e.target.value)
                    }
                    placeholder="Max"
                    className="
                      w-full
                      min-w-0
                      border
                      border-slate-200
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      transition
                    "
                  />
                </div>
              </div>

              {/* DATE POSTED */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CiCalendar className="text-xl text-blue-600" />

                  <h3 className="font-semibold text-slate-900">Date Posted</h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Today",
                      value: "today",
                    },
                    {
                      label: "Last 3 days",
                      value: "3days",
                    },
                    {
                      label: "Last 7 days",
                      value: "7days",
                    },
                    {
                      label: "Last 30 days",
                      value: "30days",
                    },
                  ].map((date) => (
                    <label
                      key={date.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="datePosted"
                        value={date.value}
                        checked={filters.datePosted === date.value}
                        onChange={(e) =>
                          handleFilterChange("datePosted", e.target.value)
                        }
                        className="w-4 h-4 accent-blue-600"
                      />

                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                        {date.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              JOB RESULTS
          ================================================= */}

          <main>
            <div
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
              "
            >
              {/* RESULTS HEADER */}

              <div
                className="
                  px-5
                  sm:px-6
                  py-5
                  border-b
                  border-slate-200
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >
                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    Recommended Jobs
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Find opportunities that match your skills.
                  </p>
                </div>

                <div className="text-sm text-slate-500">
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"} found
                </div>
              </div>

              {/* JOB LIST */}

              {/* JOB LIST */}

              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

                  <p className="text-slate-500 mt-4">Loading jobs...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center min-h-[400px] px-6">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
                    <CiSearch className="text-3xl text-red-500" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Failed to load jobs
                  </h3>

                  <p className="text-slate-500 max-w-md mt-2">{error}</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="p-4 sm:p-5 space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => openJob(job._id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="
      flex
      flex-col
      items-center
      justify-center
      text-center
      min-h-[400px]
      px-6
    "
                >
                  <div
                    className="
        w-16
        h-16
        rounded-full
        bg-blue-50
        flex
        items-center
        justify-center
        mb-5
      "
                  >
                    <CiSearch className="text-3xl text-blue-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    No jobs found
                  </h3>

                  <p className="text-slate-500 max-w-md mt-2">
                    Try changing your search keywords or removing some filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="
        mt-5
        px-5
        py-2.5
        rounded-xl
        bg-blue-600
        text-white
        font-semibold
        hover:bg-blue-700
        transition
      "
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
