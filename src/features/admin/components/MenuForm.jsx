import { useEffect, useState } from "react"

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "FOOD",
  image: "",
  available: true,
}

function MenuForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (item) {
      setForm(item)
    } else {
      setForm(initialForm)
    }
  }, [item])

  function handleChange(event) {
    const { name, value, type, checked } =
      event.target

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSave({
      ...form,
      price: Number(form.price),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        {item ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Item name"
        className="w-full rounded-lg border p-3"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full rounded-lg border p-3"
      />

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full rounded-lg border p-3"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      >
        <option value="FOOD">Food</option>
        <option value="BEVERAGES">Beverages</option>
        <option value="SNACKS">Snacks</option>
        <option value="DESSERTS">Desserts</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
        />

        Available
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Save
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default MenuForm;