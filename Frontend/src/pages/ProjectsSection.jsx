import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
  });

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/projects`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Fetch projects error:", error);
        setProjectsError(error.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
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

  const handleAddProject = () => {
    setEditingIndex(null);

    setFormData({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    });

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (index) => {
    const project = projects[index];

    setFormData({
      title: project.title || "",
      description: project.description || "",

      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",

      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      startDate: project.startDate ? project.startDate.substring(0, 10) : "",
      endDate: project.endDate ? project.endDate.substring(0, 10) : "",
      currentlyWorking: project.currentlyWorking || false,
    });

    setEditingIndex(index);
    setShowForm(true);
  };

  // =====================================================
  // SAVE PROJECT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,

        technologies: formData.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),

        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate,
        currentlyWorking: formData.currentlyWorking,
      };

      // =====================================================
      // ADD PROJECT
      // =====================================================

      if (editingIndex === null) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/projects`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(projectData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add project");
        }

        // Add the project returned by backend
        setProjects((prev) => [...prev, data.project]);
      }

      // =====================================================
      // UPDATE PROJECT
      // =====================================================
      else {
        const projectId = projects[editingIndex]._id;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/projects/${projectId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(projectData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update project");
        }

        setProjects((prev) =>
          prev.map((project, index) =>
            index === editingIndex ? data.project : project,
          ),
        );
      }

      // Reset form
      setShowForm(false);
      setEditingIndex(null);

      setFormData({
        title: "",
        description: "",
        technologies: "",
        liveUrl: "",
        githubUrl: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      });
    } catch (error) {
      console.error("Save project error:", error);
      setProjectsError(error.message);
    }
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDelete = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      const projectId = projects[index]._id;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/projects/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete project error:", error);
      setProjectsError(error.message);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Projects
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Showcase projects that demonstrate your skills and experience.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProject}
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

          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loadingProjects && projects.length === 0 && !showForm && (
        <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
            <FaPlus className="text-blue-600" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No projects added yet
          </h3>

          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Add your best projects to help employers understand your skills and
            experience.
          </p>

          <button
            type="button"
            onClick={handleAddProject}
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
            Add Your First Project
          </button>
        </div>
      )}

      {/* =================================================
          PROJECT FORM
      ================================================= */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 border border-slate-200 rounded-xl p-5 sm:p-6 bg-slate-50"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">
                {editingIndex !== null ? "Edit Project" : "Add Project"}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Add details about your project.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* PROJECT TITLE */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Project Name
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Job Portal Application"
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

            {/* DESCRIPTION */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you built, your responsibilities, and the problem the project solves."
                rows={5}
                required
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
            </div>

            {/* TECHNOLOGIES */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, Express, MongoDB"
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

              <p className="text-xs text-slate-400 mt-1.5">
                Separate technologies with commas.
              </p>
            </div>

            {/* LIVE URL */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Live Project URL
              </label>

              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://example.com"
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

            {/* GITHUB URL */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                GitHub URL
              </label>

              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
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
                  I am currently working on this project
                </span>
              </label>
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
              "
            >
              {editingIndex !== null ? "Update Project" : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* =================================================
          PROJECT LIST
      ================================================= */}

      {/* =================================================
    PROJECT LIST
================================================= */}

      <div className="mt-6 space-y-4">
        {/* LOADING */}

        {loadingProjects && (
          <div className="border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-500">Loading projects...</p>
          </div>
        )}

        {/* ERROR */}

        {!loadingProjects && projectsError && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-5">
            <p className="text-sm text-red-600">{projectsError}</p>
          </div>
        )}

        {/* PROJECTS */}

        {!loadingProjects &&
          !projectsError &&
          projects.length > 0 &&
          projects.map((project, index) => (
            <div
              key={project._id}
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
                {/* PROJECT INFORMATION */}

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900">
                    {project.title}
                  </h3>

                  {(project.startDate || project.endDate) && (
                    <p className="text-xs text-slate-400 mt-1">
                      {project.startDate
                        ? project.startDate.substring(0, 10)
                        : "Start date"}{" "}
                      {project.currentlyWorking
                        ? "— Present"
                        : project.endDate
                          ? `— ${project.endDate.substring(0, 10)}`
                          : ""}
                    </p>
                  )}
                </div>

                {/* EDIT / DELETE */}

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

              {/* DESCRIPTION */}

              {project.description && (
                <p className="text-sm text-slate-600 leading-6 mt-4">
                  {project.description}
                </p>
              )}

              {/* TECHNOLOGIES */}

              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map((technology, techIndex) => (
                    <span
                      key={techIndex}
                      className="
                  px-2.5
                  py-1
                  rounded-md
                  bg-slate-100
                  border
                  border-slate-200
                  text-xs
                  font-medium
                  text-slate-600
                "
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}

              {/* LINKS */}

              {(project.liveUrl || project.githubUrl) && (
                <div
                  className="
            flex
            flex-wrap
            items-center
            gap-4
            mt-5
            pt-4
            border-t
            border-slate-100
          "
                >
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                "
                    >
                      <FaExternalLinkAlt />
                      Live Project
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-slate-600
                  hover:text-slate-900
                "
                    >
                      <FaGithub />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
