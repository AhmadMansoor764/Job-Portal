const ItemBuilder = ({
  title,
  description,
  value,
  setValue,
  items,
  setItems,
  placeholder,
  buttonText,
}) => {
  const handleAdd = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    if (items.includes(trimmedValue)) {
      return;
    }

    setItems((prev) => [...prev, trimmedValue]);
    setValue("");
  };

  const handleRemove = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <SectionHeader
        icon={<FaBriefcase />}
        title={title}
        description={description}
      />

      {/* INPUT */}
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
          onClick={handleAdd}
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
          {buttonText}
        </button>
      </div>

      {/* ADDED ITEMS */}
      {items.length > 0 && (
        <div className="mt-5 space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-start
                justify-between
                gap-3
                px-4
                py-3
                rounded-xl
                bg-slate-50
                border
                border-slate-100
              "
            >
              <div className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5
                    w-6
                    h-6
                    rounded-full
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    text-xs
                    font-bold
                  "
                >
                  {index + 1}
                </span>

                <span className="text-sm text-slate-700 leading-6">{item}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="
                  w-7
                  h-7
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-red-500
                  hover:bg-red-50
                  transition
                  flex-shrink-0
                "
                aria-label={`Remove ${title}`}
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p className="mt-4 text-xs text-slate-400">
          Nothing added yet. Add at least one item to make the job clearer for
          candidates.
        </p>
      )}
    </section>
  );
};

export default ItemBuilder;
