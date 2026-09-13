import {
  Edit3,
  Package,
  Trash2,
} from "lucide-react"

function MenuTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm transition hover:border-[#d8d1c5] hover:shadow-md sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* IMAGE */}

            <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-[#f4f1e9] sm:h-16 sm:w-16">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#78907f]">
                  <Package size={22} />
                </div>
              )}
            </div>

            {/* ITEM INFO */}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-[#193528] sm:text-base">
                  {item.name}
                </h3>

                <span className="rounded-md bg-[#f5f1e9] px-2 py-1 text-[9px] font-bold text-[#77736b]">
                  {formatCategory(item.category)}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold ${
                    item.available
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.available
                        ? "bg-emerald-500"
                        : "bg-red-400"
                    }`}
                  />

                  {item.available
                    ? "Available"
                    : "Sold out"}
                </span>
              </div>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#858078]">
                {item.description ||
                  "No description available"}
              </p>
            </div>

            {/* PRICE */}

            <div className="sm:min-w-[80px] sm:text-right">
              <p className="text-lg font-bold text-[#193528]">
                ₹{item.price}
              </p>

              <p className="text-[9px] uppercase tracking-wide text-[#9a958b]">
                Price
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex gap-2 border-t border-[#eeeae2] pt-3 sm:border-0 sm:pt-0">

              <button
                type="button"
                onClick={() =>
                  onToggleAvailability(item)
                }
                className={`flex-1 rounded-lg px-3 py-2 text-[10px] font-bold transition sm:flex-none ${
                  item.available
                    ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {item.available
                  ? "Mark Sold Out"
                  : "Mark Available"}
              </button>

              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2ddd3] text-[#625f58] transition hover:bg-[#f5f1e9] hover:text-[#315d45]"
              >
                <Edit3 size={14} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(item)}
                aria-label={`Delete ${item.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>

            </div>

          </div>
        </article>
      ))}
    </div>
  )
}

function formatCategory(category) {
  const labels = {
    FOOD: "Food",
    BEVERAGES: "Beverages",
    SNACKS: "Snacks",
    DESSERTS: "Desserts",
  }

  return labels[category] || category
}

export default MenuTable;