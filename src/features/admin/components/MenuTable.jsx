function MenuTable({
  menuItems,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4">Name</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Availability</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {menuItems.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-0"
            >
              <td className="px-5 py-4 font-medium">
                {item.name}
              </td>

              <td className="px-5 py-4">
                {item.category}
              </td>

              <td className="px-5 py-4">
                ₹{item.price}
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={() =>
                    onToggleAvailability(item)
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  {item.available
                    ? "Available"
                    : "Sold Out"}
                </button>
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MenuTable;