import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBriefcase } from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/profile/experience`;

const emptyForm = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};

const ExperienceSection = () => {
  const [experience, setExperience] = useState([]);

  const [loadingExperience, setLoadingExperience] = useState(true);
  const [experienceError, setExperienceError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  // =====================================================
  // GET EXPERIENCE
  // =====================================================

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoadingExperience(true);
        setExperienceError("");

        const response = await fetch(API_URL, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch experience");
        }

        setExperience(data.experience || []);
      } catch (error) {
        console.error("Experience error:", error);
        setExperienceError(error.message);
      } finally {
        setLoadingExperience(false);
      }
    };

    fetchExperience();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddExperience = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      jobTitle: item.jobTitle || "",
      company: item.company || "",
      location: item.location || "",
      startDate: item.startDate ? item.startDate.substring(0, 10) : "",
      endDate: item.endDate ? item.endDate.substring(0, 10) : "",
      currentlyWorking: Boolean(item.currentlyWorking),
      description: item.description || "",
    });

    setShowForm(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setExperienceError("");

      const payload = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate || null,
        currentlyWorking: formData.currentlyWorking,
        description: formData.description,
      };

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update experience");
        }

        setExperience((prev) =>
          prev.map((item) => (item._id === editingId ? data.experience : item)),
        );
      }

      // =================================================
      // ADD
      // =================================================
      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add experience");
        }

        setExperience((prev) => [...prev, data.experience]);
      }

      // Reset form
      setFormData({ ...emptyForm });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save experience error:", error);
      setExperienceError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (experienceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?",
    );

    if (!confirmed) return;

    try {
      setExperienceError("");

      const response = await fetch(`${API_URL}/${experienceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete experience");
      }

      setExperience((prev) => prev.filter((item) => item._id !== experienceId));
    } catch (error) {
      console.error("Delete experience error:", error);
      setExperienceError(error.message);
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Experience
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add your professional experience and work history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddExperience}
          className="
            flex
            items-center
            gap-2
            px-3
            sm:px-4
            py-2
            rounded-lg
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

          <span className="hidden sm:inline">Add Experience</span>

          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {experienceError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{experienceError}</p>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loadingExperience && (
        <div className="mt-6 text-sm text-slate-500">Loading experience...</div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loadingExperience && experience.length === 0 && !showForm && (
        <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
            <FaBriefcase className="text-blue-600" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No experience added yet
          </h3>

          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Add your professional experience to help employers understand your
            background.
          </p>

          <button
            type="button"
            onClick={handleAddExperience}
            className="
                mt-5
                px-4
                py-2
                rounded-lg
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-700
                hover:border-blue-300
                hover:text-blue-600
                transition
              "
          >
            Add Your First Experience
          </button>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="
            mt-6
            border
            border-slate-200
            rounded-xl
            p-5
            sm:p-6
            bg-slate-50
          "
        >
          {/* FORM HEADER */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">
                {editingId ? "Edit Experience" : "Add Experience"}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Add details about your professional experience.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseForm}
              className="
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:bg-white
                hover:text-slate-700
                transition
              "
            >
              <FaTimes />
            </button>
          </div>

          {/* FORM FIELDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* JOB TITLE */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Job Title
              </label>

              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* COMPANY */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                required
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* LOCATION */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kabul, Afghanistan"
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* START DATE */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* END DATE */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  disabled:bg-slate-100
                  disabled:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* CURRENTLY WORKING */}

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="currentlyWorking"
                  checked={formData.currentlyWorking}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-slate-700">
                  I currently work here
                </span>
              </label>
            </div>

            {/* DESCRIPTION */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your responsibilities, achievements, and what you worked on."
                rows={5}
                required
                maxLength={1000}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  outline-none
                  resize-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <p className="text-xs text-slate-400 mt-1.5">
                {formData.description.length}/1000
              </p>
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseForm}
              disabled={saving}
              className="
                px-4
                py-2.5
                rounded-lg
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-600
                hover:bg-slate-50
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                px-5
                py-2.5
                rounded-lg
                bg-blue-600
                text-white
                text-sm
                font-semibold
                hover:bg-blue-700
                transition
                disabled:opacity-50
              "
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Experience"
                  : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      {/* =================================================
          EXPERIENCE LIST
      ================================================= */}

      {!loadingExperience && experience.length > 0 && (
        <div className="mt-6 space-y-4">
          {experience.map((item) => (
            <div
              key={item._id}
              className="
                  border
                  border-slate-200
                  rounded-xl
                  p-5
                  hover:border-slate-300
                  transition
                "
            >
              {/* TOP */}

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900">
                    {item.jobTitle}
                  </h3>

                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {item.company}
                  </p>

                  {item.location && (
                    <p className="text-xs text-slate-400 mt-1">
                      {item.location}
                    </p>
                  )}

                  {(item.startDate || item.endDate) && (
                    <p className="text-xs text-slate-400 mt-2">
                      {formatDate(item.startDate)}

                      {" — "}

                      {item.currentlyWorking
                        ? "Present"
                        : formatDate(item.endDate)}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:bg-blue-50
                        hover:text-blue-600
                        transition
                      "
                  >
                    <FaEdit className="text-xs" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:bg-red-50
                        hover:text-red-600
                        transition
                      "
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}

              {item.description && (
                <p className="text-sm text-slate-600 leading-6 mt-4">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
