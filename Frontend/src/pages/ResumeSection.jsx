import React, { useEffect, useRef, useState } from "react";
import {
  FaFilePdf,
  FaUpload,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const ResumeSection = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [resume, setResume] = useState(null);

  const [loadingResume, setLoadingResume] = useState(true);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [deletingResume, setDeletingResume] = useState(false);

  const [resumeError, setResumeError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // =====================================================
  // GET CURRENT RESUME
  // =====================================================

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoadingResume(true);
        setResumeError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch resume");
        }

        setResume(data.user?.resume || null);
      } catch (error) {
        console.error("Resume fetch error:", error);

        setResumeError(error.message);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchResume();
  }, []);

  // =====================================================
  // SELECT FILE
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setResumeError("");

    // Check PDF
    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed.");

      e.target.value = "";

      return;
    }

    // Check 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("CV must be smaller than 5 MB.");

      e.target.value = "";

      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD RESUME
  // =====================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setResumeError("Please select a PDF file first.");

      return;
    }

    try {
      setUploadingResume(true);
      setResumeError("");

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/resume`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload CV");
      }

      setResume(data.resume);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Resume upload error:", error);

      setResumeError(error.message);
    } finally {
      setUploadingResume(false);
    }
  };

  // =====================================================
  // DELETE RESUME
  // =====================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your CV?",
    );

    if (!confirmed) return;

    try {
      setDeletingResume(true);
      setResumeError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/resume`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete CV");
      }

      setResume(null);
    } catch (error) {
      console.error("Resume delete error:", error);

      setResumeError(error.message);
    } finally {
      setDeletingResume(false);
    }
  };

  // =====================================================
  // CANCEL SELECTED FILE
  // =====================================================

  const handleCancelSelection = () => {
    setSelectedFile(null);

    setResumeError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            Resume
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Upload your latest CV so employers can review your experience.
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {resumeError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {resumeError}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loadingResume ? (
        <div className="mt-6 text-sm text-slate-500">Loading resume...</div>
      ) : (
        <div className="mt-6">
          {/* =============================================
              EXISTING RESUME
          ============================================= */}

          {resume ? (
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* FILE INFORMATION */}

                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FaFilePdf className="text-red-500 text-xl" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {resume.fileName || "My Resume.pdf"}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1">
                      <FaCheckCircle className="text-green-500 text-xs" />

                      <span className="text-xs text-slate-500">
                        Resume uploaded
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:border-blue-300
                      hover:text-blue-600
                      transition
                    "
                  >
                    <FaEye className="text-xs" />

                    <span>View</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      rounded-lg
                      bg-blue-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-blue-700
                      disabled:opacity-60
                      transition
                    "
                  >
                    <FaUpload className="text-xs" />

                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deletingResume}
                    className="
                      w-9
                      h-9
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-slate-400
                      hover:bg-red-50
                      hover:text-red-600
                      disabled:opacity-60
                      transition
                    "
                    title="Delete CV"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ===========================================
               EMPTY STATE
            =========================================== */

            <div className="border border-dashed border-slate-300 rounded-xl p-8 sm:p-10 text-center">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto">
                <FaFilePdf className="text-red-500 text-xl" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No resume uploaded
              </h3>

              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Upload your latest CV in PDF format. Maximum file size is 5 MB.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-4
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
                <FaUpload className="text-xs" />
                Upload CV
              </button>
            </div>
          )}

          {/* =============================================
              HIDDEN FILE INPUT
          ============================================= */}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* =============================================
              SELECTED FILE
          ============================================= */}

          {selectedFile && (
            <div className="mt-4 border border-blue-100 bg-blue-50 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <FaFilePdf className="text-red-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCancelSelection}
                    disabled={uploadingResume}
                    className="
                      w-9
                      h-9
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-slate-400
                      hover:bg-white
                      hover:text-slate-700
                      transition
                    "
                    title="Cancel"
                  >
                    <FaTimes className="text-xs" />
                  </button>

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadingResume}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
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
                    <FaUpload className="text-xs" />

                    {uploadingResume ? "Uploading..." : "Upload CV"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ResumeSection;
