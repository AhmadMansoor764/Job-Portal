import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyLogo: "",
    companyDescription: "",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    city: "",
    country: "",
    jobType: "Full-time",
    workMode: "On-site",
    experience: "",
    minSalary: "",
    maxSalary: "",
  });

  // =====================================================
  // FETCH JOB
  // =====================================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job");
        }

        const job = data.job;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          companyLogo: job.companyLogo || "",
          companyDescription: job.companyDescription || "",
          description: job.description || "",
          responsibilities: job.responsibilities?.join("\n") || "",
          requirements: job.requirements?.join("\n") || "",
          skills: job.skills?.join(", ") || "",
          city: job.city || "",
          country: job.country || "",
          jobType: job.jobType || "Full-time",
          workMode: job.workMode || "On-site",
          experience: job.experience || "",
          minSalary: job.minSalary ?? "",
          maxSalary: job.maxSalary ?? "",
        });
      } catch (error) {
        console.error("Fetch job error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,

        responsibilities: formData.responsibilities
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        requirements: formData.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        minSalary:
          formData.minSalary === "" ? null : Number(formData.minSalary),

        maxSalary:
          formData.maxSalary === "" ? null : Number(formData.maxSalary),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job");
      }

      alert("Job updated successfully!");

      navigate("/my-jobs");
    } catch (error) {
      console.error("Update job error:", error);
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
        <div className="text-slate-500">Loading job...</div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load job
          </h2>

          <p className="text-sm text-red-500 mt-3">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* HEADER */}

        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-slate-900 mt-4">Edit Job</h1>

          <p className="text-sm text-slate-500 mt-1">
            Update the information for your job posting.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">
              {error}
            </div>
          )}

          {/* BASIC INFORMATION */}

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update the main information about your job.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          {/* JOB TYPE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            <Select
              label="Work Mode"
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              options={["On-site", "Remote", "Hybrid"]}
            />
          </div>

          <Input
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 2-3 years"
          />

          {/* COMPANY */}

          <Input
            label="Company Logo URL"
            name="companyLogo"
            value={formData.companyLogo}
            onChange={handleChange}
            placeholder="https://..."
          />

          <Textarea
            label="Company Description"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            rows={4}
          />

          {/* DESCRIPTION */}

          <Textarea
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
          />

          {/* RESPONSIBILITIES */}

          <Textarea
            label="Responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            rows={6}
            placeholder={"Develop applications\nFix bugs\nWork with the team"}
          />

          <p className="text-xs text-slate-400 -mt-4">
            Write one responsibility per line.
          </p>

          {/* REQUIREMENTS */}

          <Textarea
            label="Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={6}
            placeholder={
              "2 years of experience\nGood communication\nReact knowledge"
            }
          />

          <p className="text-xs text-slate-400 -mt-4">
            Write one requirement per line.
          </p>

          {/* SKILLS */}

          <Input
            label="Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />

          <p className="text-xs text-slate-400 -mt-4">
            Separate skills with commas.
          </p>

          {/* SALARY */}

          <div>
            <h2 className="text-lg font-bold text-slate-900">Salary</h2>

            <p className="text-sm text-slate-500 mt-1">
              Optional salary information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Minimum Salary"
              name="minSalary"
              type="number"
              value={formData.minSalary}
              onChange={handleChange}
            />

            <Input
              label="Maximum Salary"
              name="maxSalary"
              type="number"
              value={formData.maxSalary}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
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
  type = "text",
  placeholder = "",
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// =====================================================
// TEXTAREA
// =====================================================

const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 5,
  placeholder = "",
  required = false,
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
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

export default EditJob;
