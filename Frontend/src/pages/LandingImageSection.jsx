import { SiDevelopmentcontainers } from "react-icons/si";
import { MdOutlineDesignServices } from "react-icons/md";
import { SiCardmarket } from "react-icons/si";
import { FcSalesPerformance } from "react-icons/fc";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FcCustomerSupport } from "react-icons/fc";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptopHouse,
  FaDollarSign,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Development",
    jobs: "14,278",
    icon: <SiDevelopmentcontainers />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Design",
    jobs: "12,459",
    icon: <MdOutlineDesignServices />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Marketing",
    jobs: "25,142",
    icon: <SiCardmarket />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Sales",
    jobs: "12,453",
    icon: <FcSalesPerformance />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Business",
    jobs: "23,415",
    icon: <LuBriefcaseBusiness />,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Customer Support",
    jobs: "2,458",
    icon: <FcCustomerSupport />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
];

const BottomSectionLandingPage = ({ jobs, search, onCategorySearch }) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ==========================================
          CATEGORIES
      ========================================== */}

      <div className="text-center mb-7">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Popular Categories
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Explore jobs by category
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          gap-3
          sm:gap-4
        "
      >
        {categories.map((category) => (
          <button
            key={category.title}
            type="button"
            onClick={() => onCategorySearch(category.title)}
            className="
              group
              bg-white
              border
              border-gray-200
              rounded-xl
              p-4
              h-32
              sm:h-36
              flex
              flex-col
              justify-between
              text-left
              cursor-pointer
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
              hover:border-blue-300
            "
          >
            {/* ICON */}

            <div
              className={`
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                ${category.iconBg}
                ${category.iconColor}
                text-lg
              `}
            >
              {category.icon}
            </div>

            {/* INFORMATION */}

            <div>
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                {category.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {category.jobs} jobs
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ==========================================
          SEARCH RESULTS
      ========================================== */}

      {search.trim() && (
        <div id="search-results" className="mt-14 scroll-mt-24">
          {/* RESULTS HEADER */}

          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Jobs for "{search}"
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
              </p>
            </div>

            <button
              onClick={() => navigate("/findjob")}
              className="
                hidden
                sm:flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              View All Jobs
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          {/* RESULTS */}

          {jobs.length > 0 ? (
            <div
              className="
                flex
                gap-4
                overflow-x-auto
                pb-4
                snap-x
                snap-mandatory
                scrollbar-thin
              "
            >
              {jobs.slice(0, 6).map((job) => (
                <div
                  key={job._id}
                  className="
                    flex-shrink-0
                    w-[300px]
                    sm:w-[340px]
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-5
                    shadow-sm
                    hover:shadow-md
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    snap-start
                  "
                >
                  {/* TOP */}

                  <div className="flex items-start gap-3">
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
                        <FaBuilding className="text-blue-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">
                        {job.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaMapMarkerAlt className="text-slate-400" />

                      <span className="truncate">
                        {job.city}, {job.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaBriefcase className="text-slate-400" />

                      <span>{job.jobType}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaLaptopHouse className="text-slate-400" />

                      <span>{job.workMode}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaDollarSign className="text-slate-400" />

                      <span>
                        {job.minSalary !== undefined &&
                        job.maxSalary !== undefined
                          ? `$${Number(job.minSalary).toLocaleString()} - $${Number(
                              job.maxSalary,
                            ).toLocaleString()}`
                          : "Negotiable"}
                      </span>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="
                      w-full
                      mt-5
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
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-10
                text-center
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >
                <FaBriefcase className="text-blue-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4">
                No jobs found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try another keyword or browse all available jobs.
              </p>

              <button
                onClick={() => navigate("/findjob")}
                className="
                  mt-5
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
                Browse All Jobs
              </button>
            </div>
          )}

          {/* MOBILE VIEW ALL */}

          <button
            onClick={() => navigate("/findjob")}
            className="
              sm:hidden
              flex
              items-center
              justify-center
              gap-2
              w-full
              mt-4
              py-3
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              text-blue-600
              text-sm
              font-semibold
            "
          >
            View All Jobs
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      )}
    </section>
  );
};

export default BottomSectionLandingPage;
