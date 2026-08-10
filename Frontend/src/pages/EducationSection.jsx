import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaGraduationCap,
} from "react-icons/fa";

const EducationSection = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [education, setEducation] = useState([]);

  const [loadingEducation, setLoadingEducation] = useState(true);

  const [educationError, setEducationError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [savingEducation, setSavingEducation] = useState(false);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
  });

  // =====================================================
  // GET EDUCATION
  // =====================================================

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoadingEducation(true);
        setEducationError("");

        const response = await fetch(
          "http://localhost:8000/api/profile/education",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch education");
        }

        setEducation(data.education || []);
      } catch (error) {
        console.error("Education error:", error);
        setEducationError(error.message);
      } finally {
        setLoadingEducation(false);
      }
    };

    fetchEducation();
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
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
    });

    setEditingIndex(null);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddEducation = () => {
    resetForm();

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (index) => {
    const item = education[index];

    setFormData({
      institution: item.institution || "",
      degree: item.degree || "",
      fieldOfStudy: item.fieldOfStudy || "",
      startDate: item.startDate ? item.startDate.substring(0, 10) : "",
      endDate: item.endDate ? item.endDate.substring(0, 10) : "",
      currentlyStudying: item.currentlyStudying || false,
    });

    setEditingIndex(index);

    setShowForm(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingEducation(true);
      setEducationError("");

      const educationData = {
        institution: formData.institution,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startDate: formData.startDate || null,
        endDate: formData.currentlyStudying ? null : formData.endDate || null,
        currentlyStudying: formData.currentlyStudying,
      };

      // =================================================
      // UPDATE
      // =================================================

      if (editingIndex !== null) {
        const educationId = education[editingIndex]._id;

        const response = await fetch(
          `http://localhost:8000/api/profile/education/${educationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(educationData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update education");
        }

        setEducation((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? data.education : item,
          ),
        );
      }

      // =================================================
      // ADD
      // =================================================
      else {
        const response = await fetch(
          "http://localhost:8000/api/profile/education",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(educationData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add education");
        }

        setEducation((prev) => [...prev, data.education]);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Education save error:", error);
      setEducationError(error.message);
    } finally {
      setSavingEducation(false);
    }
  };

  // =====================================================
  // DELETE EDUCATION
  // =====================================================

  const handleDelete = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?",
    );

    if (!confirmed) return;

    try {
      setEducationError("");

      const educationId = education[index]._id;

      const response = await fetch(
        `http://localhost:8000/api/profile/education/${educationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete education");
      }

      setEducation((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete education error:", error);
      setEducationError(error.message);
    }
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
  // RETURN
  // =====================================================

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Education
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add your educational background and academic achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEducation}
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

          <span className="hidden sm:inline">Add Education</span>

          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {educationError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {educationError}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loadingEducation ? (
        <div className="mt-6 text-sm text-slate-500">Loading education...</div>
      ) : (
        <>
          {/* =============================================
              EMPTY STATE
          ============================================= */}

          {education.length === 0 && !showForm && (
            <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-8 sm:p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                <FaGraduationCap className="text-blue-600 text-lg" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No education added yet
              </h3>

              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Add your education to help employers understand your academic
                background.
              </p>

              <button
                type="button"
                onClick={handleAddEducation}
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
                Add Your Education
              </button>
            </div>
          )}

          {/* =============================================
              FORM
          ============================================= */}

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
                    {editingIndex !== null ? "Edit Education" : "Add Education"}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Add details about your education.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
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
                {/* INSTITUTION */}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Institution
                  </label>

                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. Kabul University"
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

                {/* DEGREE */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Degree
                  </label>

                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. Bachelor's Degree"
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

                {/* FIELD OF STUDY */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Field of Study
                  </label>

                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
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
                    disabled={formData.currentlyStudying}
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

                {/* CURRENTLY STUDYING */}

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="currentlyStudying"
                      checked={formData.currentlyStudying}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600"
                    />

                    <span className="text-sm text-slate-700">
                      I am currently studying here
                    </span>
                  </label>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
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
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEducation}
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-blue-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-blue-700
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition
                  "
                >
                  {savingEducation
                    ? "Saving..."
                    : editingIndex !== null
                      ? "Update Education"
                      : "Save Education"}
                </button>
              </div>
            </form>
          )}

          {/* =============================================
              EDUCATION LIST
          ============================================= */}

          {education.length > 0 && (
            <div className="mt-6 space-y-4">
              {education.map((item, index) => (
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900">
                        {item.degree}
                      </h3>

                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {item.institution}
                      </p>

                      {item.fieldOfStudy && (
                        <p className="text-sm text-slate-500 mt-1">
                          {item.fieldOfStudy}
                        </p>
                      )}

                      {(item.startDate ||
                        item.endDate ||
                        item.currentlyStudying) && (
                        <p className="text-xs text-slate-400 mt-2">
                          {item.startDate
                            ? formatDate(item.startDate)
                            : "Start date"}

                          {" — "}

                          {item.currentlyStudying
                            ? "Present"
                            : item.endDate
                              ? formatDate(item.endDate)
                              : "End date"}
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
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
                        onClick={() => handleDelete(index)}
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
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default EducationSection;
