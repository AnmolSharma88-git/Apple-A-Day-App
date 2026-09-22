function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-[#315d45] text-white hover:bg-[#274c39]",
    secondary:
      "border border-[#ded8cc] bg-white text-[#4f4b44] hover:bg-[#f7f3eb]",
    danger:
      "bg-[#b94a48] text-white hover:bg-[#a63f3d]",
    ghost:
      "text-[#5f5b54] hover:bg-[#f5f1e9]",
  }

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button;