import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaCode,
  FaPaintBrush,
  FaBullhorn,
  FaChartLine,
  FaBriefcase,
  FaHeadset,
  FaArrowRight,
  FaBuilding,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api";

const categoryConfig = [
  {
    title: "Development",
    icon: <FaCode />,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    title: "Design",
    icon: <FaPaintBrush />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    title: "Marketing",
    icon: <FaBullhorn />,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    title: "Sales",
    icon: <FaChartLine />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Business",
    icon: <FaBriefcase />,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    title: "Customer Support",
    icon: <FaHeadset />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-500",
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET ACTIVE JOBS
  // =====================================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/jobs`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Fetch jobs error:", error);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =====================================================
  // CATEGORY JOB COUNTS
  // =====================================================

  const categories = useMemo(() => {
    return categoryConfig.map((category) => {
      const count = jobs.filter(
        (job) => job.category?.toLowerCase() === category.title.toLowerCase(),
      ).length;

      return {
        ...category,
        jobs: count,
      };
    });
  }, [jobs]);

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  const searchResults = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return jobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(keyword) ||
        job.category?.toLowerCase().includes(keyword) ||
        job.company?.toLowerCase().includes(keyword) ||
        job.description?.toLowerCase().includes(keyword) ||
        job.city?.toLowerCase().includes(keyword) ||
        job.country?.toLowerCase().includes(keyword) ||
        job.jobType?.toLowerCase().includes(keyword) ||
        job.workMode?.toLowerCase().includes(keyword) ||
        job.skills?.some((skill) => skill.toLowerCase().includes(keyword))
      );
    });
  }, [jobs, search]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    if (!search.trim()) {
      setSearched(false);
      return;
    }

    setSearched(true);

    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // =====================================================
  // CATEGORY SEARCH
  // =====================================================

  const handleCategorySearch = (category) => {
    setSearch(category);
    setSearched(true);

    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // =====================================================
  // POPULAR SEARCH
  // =====================================================

  const handlePopularSearch = (keyword) => {
    setSearch(keyword);
    setSearched(true);

    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-white border-b border-gray-100">
        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            lg:px-12
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <span className="text-xl font-bold text-slate-900">JobPortal</span>
          </button>

          {/* Auth buttons */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                px-6
                py-2.5
                rounded-lg
                border
                border-gray-200
                bg-white
                text-sm
                font-semibold
                text-slate-800
                hover:border-indigo-300
                transition
              "
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/accountType")}
              className="
                px-6
                py-2.5
                rounded-lg
                bg-indigo-600
                text-white
                text-sm
                font-semibold
                hover:bg-indigo-700
                transition
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-[#f8f9ff] border-b border-gray-100">
        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            lg:px-12
            py-12
            lg:py-10
            min-h-[490px]
            flex
            items-center
          "
        >
          <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            {/* LEFT */}

            <div className="max-w-2xl">
              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  lg:text-[52px]
                  font-bold
                  leading-[1.12]
                  tracking-tight
                  text-slate-900
                "
              >
                Find Your Dream Job
                <br />
                Find Your <span className="text-indigo-600">Future</span>
              </h1>

              <p
                className="
                  mt-6
                  text-base
                  sm:text-lg
                  leading-7
                  text-slate-600
                  max-w-xl
                "
              >
                Discover thousands of job opportunities with
                <br className="hidden sm:block" />
                all the information you need.
              </p>

              {/* SEARCH */}

              <div
                className="
                  mt-7
                  w-full
                  max-w-2xl
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  p-1.5
                  shadow-sm
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                "
              >
                <div className="flex items-center flex-1 px-3 py-2">
                  <FaSearch className="text-gray-400 text-sm flex-shrink-0" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);

                      if (!e.target.value.trim()) {
                        setSearched(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="Job title, keyword..."
                    className="
                      w-full
                      ml-3
                      outline-none
                      text-sm
                      text-slate-700
                      placeholder:text-gray-400
                      bg-transparent
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    w-full
                    sm:w-auto
                    px-7
                    py-3
                    rounded-lg
                    bg-indigo-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-indigo-700
                    transition
                  "
                >
                  Search Jobs
                </button>
              </div>

              {/* POPULAR SEARCHES */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                    mr-1
                  "
                >
                  Popular Searches:
                </span>

                {[
                  "Developer",
                  "Designer",
                  "Marketing",
                  "Sales",
                  "Business",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePopularSearch(item)}
                    className="
                      px-4
                      py-1.5
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      text-xs
                      sm:text-sm
                      text-slate-600
                      hover:border-indigo-300
                      hover:text-indigo-600
                      transition
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT IMAGE */}

            <div
              className="
                hidden
                lg:flex
                justify-end
                items-center
                h-full
              "
            >
              <div className="relative w-[500px] h-[450px]">
                <div
                  className="
                    absolute
                    w-[350px]
                    h-[350px]
                    rounded-full
                    border
                    border-indigo-100
                    right-8
                    top-8
                  "
                />

                <div
                  className="
                    absolute
                    w-24
                    h-24
                    rounded-full
                    bg-indigo-100
                    right-20
                    bottom-12
                    opacity-70
                  "
                />

                <div className="absolute top-24 right-2 text-orange-400 text-xl">
                  ✦
                </div>

                <div className="absolute top-36 left-10 text-indigo-500 text-2xl">
                  ✦
                </div>

                <div className="absolute top-10 right-28 text-indigo-300 text-xl">
                  ✦
                </div>

                <img
                  src="/lastone.png"
                  alt="Person working with laptop"
                  className="
                    absolute
                    right-0
                    bottom-0
                    w-[430px]
                    h-[430px]
                    object-contain
                    z-10
                    mix-blend-multiply
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="bg-white">
        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            lg:px-12
            py-8
            sm:py-10
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Popular Categories
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Browse jobs by category
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/findjob")}
              className="
                hidden
                sm:flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-indigo-600
                hover:text-indigo-700
                transition
              "
            >
              View all jobs
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-6
              gap-3
              sm:gap-4
            "
          >
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                onClick={() => handleCategorySearch(category.title)}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  sm:p-5
                  h-36
                  sm:h-44
                  flex
                  flex-col
                  justify-between
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                  hover:border-indigo-200
                "
              >
                <div
                  className={`
                    w-10
                    h-10
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-lg
                    ${category.iconBg}
                    ${category.iconColor}
                  `}
                >
                  {category.icon}
                </div>

                <div>
                  <h3
                    className="
                      text-sm
                      sm:text-base
                      font-semibold
                      text-slate-900
                      truncate
                    "
                  >
                    {category.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      sm:text-sm
                      text-slate-500
                    "
                  >
                    {category.jobs.toLocaleString()} Jobs
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      {searched && (
        <section
          id="search-results"
          className="
            bg-slate-50
            border-t
            border-gray-100
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto
              px-5
              sm:px-8
              lg:px-12
              py-10
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Jobs for "{search}"
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "job" : "jobs"} found
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/findjob")}
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-indigo-600
                "
              >
                View All Jobs
                <FaArrowRight className="text-xs" />
              </button>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="text-center py-10 text-gray-500">
                Loading jobs...
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="text-center py-10 text-red-500">{error}</div>
            )}

            {/* RESULTS */}

            {!loading && !error && searchResults.length > 0 && (
              <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                  "
              >
                {searchResults.slice(0, 6).map((job) => (
                  <div
                    key={job._id}
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-5
                        shadow-sm
                        hover:shadow-md
                        transition
                      "
                  >
                    {/* COMPANY */}

                    <div className="flex items-start gap-3">
                      <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-indigo-50
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
                            alt={job.company}
                            className="
                                w-full
                                h-full
                                object-cover
                              "
                          />
                        ) : (
                          <FaBuilding className="text-indigo-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">
                          {job.title}
                        </h3>

                        <p className="text-sm text-gray-500 truncate mt-1">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY */}

                    <div className="mt-4">
                      <span
                        className="
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            bg-indigo-50
                            text-indigo-600
                            text-xs
                            font-semibold
                          "
                      >
                        {job.category}
                      </span>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-500">
                        📍 {job.city}, {job.country}
                      </p>

                      <p className="text-sm text-gray-500">💼 {job.jobType}</p>

                      <p className="text-sm text-gray-500">🏠 {job.workMode}</p>

                      <p className="text-sm text-gray-500">
                        💰{" "}
                        {job.minSalary !== null && job.maxSalary !== null
                          ? `$${Number(
                              job.minSalary,
                            ).toLocaleString()} - $${Number(
                              job.maxSalary,
                            ).toLocaleString()}`
                          : "Negotiable"}
                      </p>
                    </div>

                    {/* BUTTON */}

                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="
                          w-full
                          mt-5
                          py-2.5
                          rounded-xl
                          bg-indigo-600
                          text-white
                          text-sm
                          font-semibold
                          hover:bg-indigo-700
                          transition
                        "
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* NO RESULTS */}

            {!loading && !error && searchResults.length === 0 && (
              <div
                className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    p-10
                    text-center
                  "
              >
                <div
                  className="
                      w-14
                      h-14
                      mx-auto
                      rounded-full
                      bg-indigo-50
                      flex
                      items-center
                      justify-center
                    "
                >
                  <FaBriefcase className="text-indigo-600" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-4">
                  No jobs found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try another keyword or browse all available jobs.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/findjob")}
                  className="
                      mt-5
                      px-5
                      py-2.5
                      rounded-xl
                      bg-indigo-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-indigo-700
                    "
                >
                  Browse All Jobs
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Welcome;
