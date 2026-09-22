function StatsCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-sm text-slate-400">
          {description}
        </p>
      )}
    </div>
  )
}

export default StatsCard;