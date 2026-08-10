const SkillsBuilder = ({ value, setValue, skills, setSkills }) => {
  const handleAddSkill = () => {
    const trimmedSkill = value.trim();

    if (!trimmedSkill) return;

    if (
      skills.some((skill) => skill.toLowerCase() === trimmedSkill.toLowerCase())
    ) {
      return;
    }

    setSkills((prev) => [...prev, trimmedSkill]);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <SectionHeader
        icon={<FaBriefcase />}
        title="Required Skills"
        description="Add the technologies, tools, and skills required for this position."
      />

      {/* INPUT */}
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React.js"
          className="
            flex-1
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

        <button
          type="button"
          onClick={handleAddSkill}
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
            active:scale-[0.98]
            transition
          "
        >
          <FaPlus className="text-xs" />
          Add Skill
        </button>
      </div>

      {/* SKILL TAGS */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {skills.map((skill, index) => (
            <div
              key={index}
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
                  text-blue-400
                  hover:bg-blue-100
                  hover:text-red-500
                  transition
                "
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="mt-4 text-xs text-slate-400">
          Add skills one at a time. Press Enter to quickly add a skill.
        </p>
      )}
    </section>
  );
};

export default SkillsBuilder;
