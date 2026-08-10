import React, { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const ProfessionalLinksSection = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [links, setLinks] = useState({
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const [formData, setFormData] = useState({
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const [loadingLinks, setLoadingLinks] = useState(true);
  const [savingLinks, setSavingLinks] = useState(false);

  const [editing, setEditing] = useState(false);

  const [linksError, setLinksError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // GET PROFESSIONAL LINKS
  // =====================================================

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoadingLinks(true);
        setLinksError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/links`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch professional links");
        }

        const fetchedLinks = {
          linkedinUrl: data.links?.linkedinUrl || "",
          githubUrl: data.links?.githubUrl || "",
          portfolioUrl: data.links?.portfolioUrl || "",
        };

        setLinks(fetchedLinks);
        setFormData(fetchedLinks);
      } catch (error) {
        console.error("Professional links error:", error);

        setLinksError(error.message);
      } finally {
        setLoadingLinks(false);
      }
    };

    fetchLinks();
  }, []);

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
  // START EDITING
  // =====================================================

  const handleEdit = () => {
    setFormData(links);

    setLinksError("");
    setSuccessMessage("");

    setEditing(true);
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = () => {
    setFormData(links);

    setLinksError("");
    setEditing(false);
  };

  // =====================================================
  // VALIDATE URL
  // =====================================================

  const isValidUrl = (value) => {
    if (!value.trim()) return true;

    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // =====================================================
  // SAVE LINKS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingLinks(true);
      setLinksError("");
      setSuccessMessage("");

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!isValidUrl(formData.linkedinUrl)) {
        throw new Error("Please enter a valid LinkedIn URL.");
      }

      if (!isValidUrl(formData.githubUrl)) {
        throw new Error("Please enter a valid GitHub URL.");
      }

      if (!isValidUrl(formData.portfolioUrl)) {
        throw new Error("Please enter a valid portfolio URL.");
      }

      // -----------------------------------------------
      // UPDATE BACKEND
      // -----------------------------------------------

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/links`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            linkedinUrl: formData.linkedinUrl.trim(),
            githubUrl: formData.githubUrl.trim(),
            portfolioUrl: formData.portfolioUrl.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update professional links");
      }

      // -----------------------------------------------
      // UPDATE UI
      // -----------------------------------------------

      const updatedLinks = {
        linkedinUrl: data.links?.linkedinUrl || "",
        githubUrl: data.links?.githubUrl || "",
        portfolioUrl: data.links?.portfolioUrl || "",
      };

      setLinks(updatedLinks);
      setFormData(updatedLinks);

      setEditing(false);

      setSuccessMessage("Professional links updated successfully.");

      // Remove success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Save professional links error:", error);

      setLinksError(error.message);
    } finally {
      setSavingLinks(false);
    }
  };

  // =====================================================
  // LINK DATA
  // =====================================================

  const linkItems = [
    {
      key: "linkedinUrl",
      label: "LinkedIn",
      placeholder: "https://www.linkedin.com/in/yourname",
      icon: FaLinkedin,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      key: "githubUrl",
      label: "GitHub",
      placeholder: "https://github.com/yourname",
      icon: FaGithub,
      iconColor: "text-slate-800",
      bgColor: "bg-slate-100",
    },
    {
      key: "portfolioUrl",
      label: "Portfolio",
      placeholder: "https://yourportfolio.com",
      icon: FaGlobe,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Professional Links
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add links to your professional profiles and personal website.
          </p>
        </div>

        {!editing && !loadingLinks && (
          <button
            type="button"
            onClick={handleEdit}
            className="
              flex
              items-center
              gap-2
              px-3
              sm:px-4
              py-2
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-700
              text-sm
              font-semibold
              hover:border-blue-300
              hover:text-blue-600
              transition
              flex-shrink-0
            "
          >
            <FaEdit className="text-xs" />

            <span className="hidden sm:inline">Edit Links</span>

            <span className="sm:hidden">Edit</span>
          </button>
        )}
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {linksError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {linksError}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-600">
          {successMessage}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loadingLinks ? (
        <div className="mt-6 text-sm text-slate-500">
          Loading professional links...
        </div>
      ) : editing ? (
        /* =================================================
           EDIT FORM
        ================================================= */

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-5">
            {linkItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {item.label}
                  </label>

                  <div className="relative">
                    <div
                      className={`
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        w-8
                        h-8
                        rounded-lg
                        ${item.bgColor}
                        flex
                        items-center
                        justify-center
                      `}
                    >
                      <Icon className={`${item.iconColor} text-sm`} />
                    </div>

                    <input
                      type="url"
                      name={item.key}
                      value={formData[item.key]}
                      onChange={handleChange}
                      placeholder={item.placeholder}
                      className="
                        w-full
                        pl-14
                        pr-4
                        py-3
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={savingLinks}
              className="
                flex
                items-center
                gap-2
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
                disabled:opacity-60
                transition
              "
            >
              <FaTimes className="text-xs" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingLinks}
              className="
                flex
                items-center
                gap-2
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
              <FaSave className="text-xs" />

              {savingLinks ? "Saving..." : "Save Links"}
            </button>
          </div>
        </form>
      ) : (
        /* =================================================
           DISPLAY LINKS
        ================================================= */

        <div className="mt-6">
          {links.linkedinUrl || links.githubUrl || links.portfolioUrl ? (
            <div className="space-y-3">
              {linkItems.map((item) => {
                const Icon = item.icon;
                const url = links[item.key];

                if (!url) return null;

                return (
                  <a
                    key={item.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-xl
                      border
                      border-slate-200
                      hover:border-blue-300
                      hover:bg-slate-50
                      transition
                      group
                    "
                  >
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        ${item.bgColor}
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      `}
                    >
                      <Icon className={`${item.iconColor} text-lg`} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.label}
                      </p>

                      <p className="text-sm text-slate-500 truncate group-hover:text-blue-600 transition">
                        {url}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="border border-dashed border-slate-300 rounded-xl p-8 sm:p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                <FaGlobe className="text-blue-600 text-lg" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No professional links added yet
              </h3>

              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Add your LinkedIn, GitHub, or portfolio website so employers can
                learn more about you.
              </p>

              <button
                type="button"
                onClick={handleEdit}
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
                Add Professional Links
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProfessionalLinksSection;
