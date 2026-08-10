import { SiDevelopmentcontainers } from "react-icons/si";
import { MdOutlineDesignServices } from "react-icons/md";
import { SiCardmarket } from "react-icons/si";
import { FcSalesPerformance } from "react-icons/fc";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FcCustomerSupport } from "react-icons/fc";

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

const BottomSectionLandingPage = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading */}
      <div className="text-center mb-7">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Popular Categories
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Explore jobs by category
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category.title}
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
              cursor-pointer
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
              hover:border-blue-300
            "
          >
            {/* Icon */}
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

            {/* Information */}
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                {category.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {category.jobs} jobs
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BottomSectionLandingPage;
