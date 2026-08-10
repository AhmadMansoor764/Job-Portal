import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaDollarSign,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const CreateJob = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyDescription: "",

    description: "",

    city: "",
    country: "",

    category: "Development",

    jobType: "Full-time",
    workMode: "On-site",
    experience: "",

    minSalary: "",
    maxSalary: "",
  });

  // =====================================================
  // RESPONSIBILITIES
  // =====================================================

  const [responsibilities, setResponsibilities] = useState([]);
  const [responsibilityInput, setResponsibilityInput] = useState("");

  // =====================================================
  // REQUIREMENTS
  // =====================================================

  const [requirements, setRequirements] = useState([]);
  const [requirementInput, setRequirementInput] = useState("");

  // =====================================================
  // SKILLS
  // =====================================================

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // HANDLE NORMAL INPUTS
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD RESPONSIBILITY
  // =====================================================

  const addResponsibility = () => {
    const value = responsibilityInput.trim();

    if (!value) return;

    setResponsibilities((prev) => [...prev, value]);
    setResponsibilityInput("");
  };

  // =====================================================
  // REMOVE RESPONSIBILITY
  // =====================================================

  const removeResponsibility = (index) => {
    setResponsibilities((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // =====================================================
  // ADD REQUIREMENT
  // =====================================================

  const addRequirement = () => {
    const value = requirementInput.trim();

    if (!value) return;

    setRequirements((prev) => [...prev, value]);
    setRequirementInput("");
  };

  // =====================================================
  // REMOVE REQUIREMENT
  // =====================================================

  const removeRequirement = (index) => {
    setRequirements((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      setError(`"${value}" has already been added.`);
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, value]);
    setSkillInput("");
    setError("");
  };

  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  // =====================================================
  // KEYBOARD SUPPORT
  // =====================================================

  const handleResponsibilityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addResponsibility();
    }
  };

  const handleRequirementKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // =====================================================
  // SUBMIT JOB
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.title.trim()) {
      setError("Please enter a job title.");
      return;
    }

    if (!formData.company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please provide a job description.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter the city.");
      return;
    }

    if (!formData.country.trim()) {
      setError("Please enter the country.");
      return;
    }

    if (!formData.category) {
      setError("Please select a job category.");
      return;
    }

    if (responsibilities.length === 0) {
      setError("Please add at least one responsibility.");
      return;
    }

    if (requirements.length === 0) {
      setError("Please add at least one requirement.");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one required skill.");
      return;
    }

    if (
      formData.minSalary !== "" &&
      formData.maxSalary !== "" &&
      Number(formData.minSalary) > Number(formData.maxSalary)
    ) {
      setError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    // ===================================================
    // START LOADING
    // ===================================================

    setLoading(true);

    try {
      // =================================================
      // SEND NORMAL JSON
      //
      // IMPORTANT:
      // There is no companyLogo here.
      //
      // The backend will get the employer's profile image
      // using req.user.id and save it as the job's
      // companyLogo.
      // =================================================

      const response = await fetch("http://localhost:8000/api/jobs", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          title: formData.title.trim(),
          company: formData.company.trim(),
          companyDescription: formData.companyDescription.trim(),
          description: formData.description.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          category: formData.category,
          jobType: formData.jobType,
          workMode: formData.workMode,
          experience: formData.experience.trim(),

          minSalary:
            formData.minSalary === "" ? null : Number(formData.minSalary),

          maxSalary:
            formData.maxSalary === "" ? null : Number(formData.maxSalary),

          responsibilities,
          requirements,
          skills,
        }),
      });

      const result = await response.json();

      // =================================================
      // HANDLE ERROR
      // =================================================

      if (!response.ok) {
        setError(result.message || "Failed to create job.");
        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess("Job created successfully!");

      console.log("Created job:", result);

      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1200);
    } catch (error) {
      console.error("Create job error:", error);

      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-16 py-3 flex items-center justify-between gap-4">
            {/* BACK BUTTON */}

            <button
              type="button"
              onClick={() => navigate("/EmployerDashboard")}
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-600
                hover:text-blue-600
                transition
                flex-shrink-0
              "
            >
              <FaArrowLeft className="text-xs" />

              <span>Back to Dashboard</span>
            </button>

            {/* LOGO */}

            <div className="flex items-center gap-2">
              <div
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                "
              >
                <FaBriefcase className="text-blue-600" />
              </div>

              <span className="font-bold text-slate-900">JobPortal</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">Employer</p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Create a New Job
          </h1>

          <p className="text-slate-500 mt-2">
            Add the details below to publish your job opportunity.
          </p>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              flex
              items-start
              gap-3
              text-sm
              text-red-600
            "
          >
            <span className="font-semibold">Error:</span>

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="
                text-red-400
                hover:text-red-600
                transition
              "
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* =====================================================
            SUCCESS
        ===================================================== */}

        {success && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              flex
              items-center
              gap-3
              text-sm
              text-green-600
            "
          >
            <FaCheck />

            <span>{success}</span>
          </div>
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =====================================================
              BASIC INFORMATION
          ===================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              sm:p-8
            "
          >
            <SectionHeader
              icon={<FaBuilding />}
              title="Basic Information"
              description="Tell candidates about the position and company."
            />

            <div className="grid grid-cols-1 gap-5 mt-7">
              {/* JOB TITLE */}

              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                required
              />

              {/* COMPANY NAME */}

              <Input
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Tech Solutions Inc."
                required
              />

              {/* COMPANY DESCRIPTION */}

              <TextArea
                label="Company Description"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                placeholder="Tell candidates about your company..."
                rows={4}
              />
            </div>
          </section>

          {/* =====================================================
              JOB DETAILS
          ===================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              sm:p-8
            "
          >
            <SectionHeader
              icon={<FaBriefcase />}
              title="Job Details"
              description="Provide the main details candidates need to know."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
              {/* CATEGORY */}

              <Select
                label="Job Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  "Development",
                  "Design",
                  "Marketing",
                  "Sales",
                  "Business",
                  "Customer Support",
                  "Finance",
                  "Human Resources",
                  "Healthcare",
                  "Education",
                  "Engineering",
                  "Legal",
                  "Media",
                  "Hospitality",
                  "Construction",
                  "Logistics",
                  "Retail",
                  "Other",
                ]}
              />

              {/* JOB TYPE */}

              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                  "Temporary",
                ]}
              />
              {/* WORK MODE */}

              <Select
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={["On-site", "Remote", "Hybrid"]}
              />

              {/* EXPERIENCE */}

              <Input
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2-4 years"
              />

              {/* CITY */}

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Kabul"
                required
              />

              {/* COUNTRY */}

              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Afghanistan"
                required
              />
            </div>
          </section>

          {/* =====================================================
              SALARY
          ===================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              sm:p-8
            "
          >
            <SectionHeader
              icon={<FaDollarSign />}
              title="Salary"
              description="Add a salary range to help attract the right candidates."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
              {/* MINIMUM */}

              <Input
                label="Minimum Salary"
                name="minSalary"
                type="number"
                value={formData.minSalary}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />

              {/* MAXIMUM */}

              <Input
                label="Maximum Salary"
                name="maxSalary"
                type="number"
                value={formData.maxSalary}
                onChange={handleChange}
                placeholder="e.g. 2000"
              />
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Leave the fields empty if the salary is negotiable.
            </p>
          </section>

          {/* =====================================================
              JOB DESCRIPTION
          ===================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              sm:p-8
            "
          >
            <SectionHeader
              icon={<FaBriefcase />}
              title="Job Description"
              description="Explain the position and what the candidate will be doing."
            />

            <div className="mt-7">
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description of the job..."
                rows={8}
                required
              />
            </div>
          </section>

          {/* =====================================================
              RESPONSIBILITIES
          ===================================================== */}

          <ItemSection
            title="Responsibilities"
            description="Add the main responsibilities of the position."
            inputLabel="Responsibility"
            inputValue={responsibilityInput}
            setInputValue={setResponsibilityInput}
            items={responsibilities}
            onAdd={addResponsibility}
            onRemove={removeResponsibility}
            onKeyDown={handleResponsibilityKeyDown}
            placeholder="e.g. Develop and maintain React applications"
            emptyText="No responsibilities added yet."
          />

          {/* =====================================================
              REQUIREMENTS
          ===================================================== */}

          <ItemSection
            title="Requirements"
            description="Add the qualifications and experience candidates should have."
            inputLabel="Requirement"
            inputValue={requirementInput}
            setInputValue={setRequirementInput}
            items={requirements}
            onAdd={addRequirement}
            onRemove={removeRequirement}
            onKeyDown={handleRequirementKeyDown}
            placeholder="e.g. 2+ years of React experience"
            emptyText="No requirements added yet."
          />

          {/* =====================================================
              SKILLS
          ===================================================== */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              sm:p-8
            "
          >
            <SectionHeader
              icon={<FaBriefcase />}
              title="Required Skills"
              description="Add the technologies and skills required for this position."
            />

            <div className="mt-7">
              {/* INPUT */}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. React.js"
                  className="
                    flex-1
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    text-sm
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-blue-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-blue-700
                    transition
                    flex-shrink-0
                  "
                >
                  <FaPlus className="text-xs" />
                  Add Skill
                </button>
              </div>

              {/* SKILLS */}

              {skills.length > 0 ? (
                <div className="mt-5">
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-slate-500
                      mb-3
                    "
                  >
                    Added skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-2
                          rounded-lg
                          bg-blue-50
                          border
                          border-blue-100
                          text-blue-700
                          text-sm
                          font-medium
                        "
                      >
                        <span>{skill}</span>

                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="
                            w-5
                            h-5
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-blue-500
                            hover:bg-blue-100
                            hover:text-red-500
                            transition
                          "
                          aria-label={`Remove ${skill}`}
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-5
                    text-center
                  "
                >
                  <p className="text-sm text-slate-400">No skills added yet.</p>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-3">
                Press Enter or click "Add Skill" to add a skill.
              </p>
            </div>
          </section>

          {/* =====================================================
              SUBMIT
          ===================================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-5
            "
          >
            {/* MESSAGE */}

            <div>
              <h3 className="font-semibold text-slate-900">
                Ready to publish?
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Your job will become visible to job seekers.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 w-full sm:w-auto">
              {/* CANCEL */}

              <button
                type="button"
                onClick={() => navigate("/employer/jobs")}
                className="
                  flex-1
                  sm:flex-none
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-slate-200
                  text-slate-700
                  font-semibold
                  hover:bg-slate-50
                  transition
                "
              >
                Cancel
              </button>

              {/* PUBLISH */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex-1
                  sm:flex-none
                  px-7
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  shadow-sm
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-blue-50
          flex
          items-center
          justify-center
          flex-shrink-0
        "
      >
        <span className="text-blue-600">{icon}</span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
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
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-2
        "
      >
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-slate-200
          bg-white
          text-sm
          text-slate-900
          outline-none
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-50
          transition
        "
      />
    </div>
  );
};

// =====================================================
// SELECT
// =====================================================

const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-2
        "
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-slate-200
          bg-white
          text-sm
          text-slate-900
          outline-none
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-50
          transition
        "
      >
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
// TEXT AREA
// =====================================================

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  required = false,
}) => {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-2
        "
      >
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-slate-200
          bg-white
          text-sm
          text-slate-900
          outline-none
          placeholder:text-slate-400
          resize-y
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-50
          transition
        "
      />
    </div>
  );
};

// =====================================================
// RESPONSIBILITIES / REQUIREMENTS
// =====================================================

const ItemSection = ({
  title,
  description,
  inputLabel,
  inputValue,
  setInputValue,
  items,
  onAdd,
  onRemove,
  onKeyDown,
  placeholder,
  emptyText,
}) => {
  return (
    <section
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-6
        sm:p-8
      "
    >
      <SectionHeader
        icon={<FaBriefcase />}
        title={title}
        description={description}
      />

      <div className="mt-7">
        {/* LABEL */}

        <label
          className="
            block
            text-sm
            font-semibold
            text-slate-700
            mb-2
          "
        >
          {inputLabel}
        </label>

        {/* INPUT + ADD */}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="
              flex-1
              px-4
              py-3
              rounded-xl
              border
              border-slate-200
              text-sm
              text-slate-900
              outline-none
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-50
              transition
            "
          />

          <button
            type="button"
            onClick={onAdd}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
              flex-shrink-0
            "
          >
            <FaPlus className="text-xs" />
            Add
          </button>
        </div>

        {/* =================================================
            ADDED ITEMS
        ================================================= */}

        {items.length > 0 ? (
          <div className="mt-5 space-y-2">
            <p
              className="
                text-xs
                font-semibold
                text-slate-500
                mb-3
              "
            >
              Added {title.toLowerCase()}
            </p>

            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  group
                "
              >
                {/* NUMBER */}

                <div
                  className="
                    w-6
                    h-6
                    rounded-full
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    text-xs
                    font-bold
                    mt-0.5
                  "
                >
                  {index + 1}
                </div>

                {/* TEXT */}

                <p
                  className="
                    flex-1
                    text-sm
                    text-slate-700
                    leading-6
                  "
                >
                  {item}
                </p>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="
                    w-8
                    h-8
                    rounded-lg
                    text-slate-400
                    hover:bg-red-50
                    hover:text-red-500
                    flex
                    items-center
                    justify-center
                    transition
                    flex-shrink-0
                  "
                  aria-label={`Remove ${item}`}
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-dashed
              border-slate-200
              bg-slate-50
              px-4
              py-5
              text-center
            "
          >
            <p className="text-sm text-slate-400">{emptyText}</p>
          </div>
        )}

        {/* HELP TEXT */}

        <p className="text-xs text-slate-400 mt-3">
          Press Enter or click "Add" to add an item.
        </p>
      </div>
    </section>
  );
};
