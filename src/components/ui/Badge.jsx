function Badge({
  children,
  variant = "neutral",
}) {
  const variants = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    warning:
      "border-amber-200 bg-amber-50 text-amber-700",

    info:
      "border-blue-200 bg-blue-50 text-blue-700",

    danger:
      "border-red-200 bg-red-50 text-red-700",

    neutral:
      "border-stone-200 bg-stone-50 text-stone-600",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

export default Badge;