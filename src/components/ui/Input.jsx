function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">

      {label && (
        <label className="block text-xs font-bold text-[#5f5b54]">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#393833] outline-none transition placeholder:text-[#aaa59b] focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de] ${
          error ? "border-red-300" : ""
        } ${className}`}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  )
}

export default Input;