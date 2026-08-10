import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [savingSkills, setSavingSkills] = useState(false);

  const [skillsError, setSkillsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isSaved, setIsSaved] = useState(true);

  // =====================================================
  // GET SKILLS
  // =====================================================

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        setSkillsError("");

        const response = await fetch(
          "http://localhost:8000/api/profile/skills",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch skills");
        }

        setSkills(data.skills || []);
      } catch (error) {
        console.error("Skills error:", error);
        setSkillsError(error.message);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // =====================================================
  // ADD SKILL
  // =====================================================

  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = skills.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      setSkillsError("This skill has already been added.");
      return;
    }

    setSkills((prev) => [...prev, skill]);

    setNewSkill("");
    setSkillsError("");
    setSuccessMessage("");

    // There are unsaved changes
    setIsSaved(false);
  };

  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));

    setSuccessMessage("");

    // There are unsaved changes
    setIsSaved(false);
  };

  // =====================================================
  // SAVE SKILLS
  // =====================================================

  const handleSaveSkills = async () => {
    try {
      setSavingSkills(true);
      setSkillsError("");
      setSuccessMessage("");

      const response = await fetch("http://localhost:8000/api/profile/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          skills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save skills");
      }

      setSkills(data.skills || []);

      // Mark as saved
      setIsSaved(true);

      setSuccessMessage("Skills updated successfully.");
    } catch (error) {
      console.error("Save skills error:", error);
      setSkillsError(error.message);
    } finally {
      setSavingSkills(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Skills</h2>

        <p className="text-sm text-slate-500 mt-1">
          Add skills that represent your professional abilities and
          technologies.
        </p>
      </div>

      {/* =================================================
          ADD SKILL
      ================================================= */}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React, JavaScript, Node.js"
          className="
            flex-1
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

        <button
          type="button"
          onClick={handleAddSkill}
          className="
            flex
            items-center
            justify-center
            gap-2
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
          <FaPlus className="text-xs" />
          Add Skill
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {skillsError && (
        <p className="mt-3 text-sm text-red-500">{skillsError}</p>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <p className="mt-3 text-sm text-green-600">{successMessage}</p>
      )}

      {/* =================================================
          SKILLS
      ================================================= */}

      <div className="mt-7">
        <h3 className="text-sm font-semibold text-slate-800">Your Skills</h3>

        {loadingSkills ? (
          <p className="mt-4 text-sm text-slate-500">Loading skills...</p>
        ) : skills.length === 0 ? (
          <div className="mt-4 border border-dashed border-slate-300 rounded-xl p-7 text-center">
            <p className="text-sm text-slate-500">No skills added yet.</p>

            <p className="text-xs text-slate-400 mt-1">
              Add your skills above to strengthen your profile.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill, index) => (
              <div
                key={`${skill}-${index}`}
                className="
                  flex
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
                  onClick={() => handleRemoveSkill(skill)}
                  className="
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-blue-400
                    hover:bg-blue-100
                    hover:text-blue-700
                    transition
                  "
                  aria-label={`Remove ${skill}`}
                >
                  <FaTimes className="text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="flex justify-end mt-7 pt-5 border-t border-slate-200">
        <button
          type="button"
          onClick={handleSaveSkills}
          disabled={savingSkills || loadingSkills || isSaved}
          className={`
    px-5
    py-2.5
    rounded-lg
    text-sm
    font-semibold
    transition
    ${
      isSaved
        ? "bg-green-600 text-white cursor-default"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }
    disabled:cursor-not-allowed
  `}
        >
          {savingSkills ? "Saving..." : isSaved ? "✓ Saved" : "Save Skills"}
        </button>
      </div>
    </section>
  );
};

export default SkillsSection;
