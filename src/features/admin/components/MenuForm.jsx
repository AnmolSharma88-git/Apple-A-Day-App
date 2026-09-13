import { useEffect, useState } from "react"
import {
  ImagePlus,
  Upload,
  X,
} from "lucide-react"

import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"

const CATEGORY_OPTIONS = [
  ["FOOD", "Food"],
  ["BEVERAGES", "Beverages"],
  ["SNACKS", "Snacks"],
  ["DESSERTS", "Desserts"],
]

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "FOOD",
  image: "",
  available: true,
}

function MenuForm({
  item,
  onSubmit,
  onClose,
  loading = false,
}) {
  const [form, setForm] =
    useState(initialForm)

  const [error, setError] = useState("")

  const isEditing = Boolean(item)

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        description: item.description || "",
        price: item.price ?? "",
        category: item.category || "FOOD",
        image: item.image || "",
        available: item.available ?? true,
      })
    } else {
      setForm(initialForm)
    }

    setError("")
  }, [item])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleImage(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.")
      return
    }

    const maxSize = 2 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        "Image must be smaller than 2 MB."
      )
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setForm((current) => ({
        ...current,
        image: reader.result,
      }))

      setError("")
    }

    reader.readAsDataURL(file)
  }

  function removeImage() {
    setForm((current) => ({
      ...current,
      image: "",
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setError("")

    if (!form.name.trim()) {
      setError(
        "Please enter the menu item name."
      )
      return
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid price.")
      return
    }

    if (!form.category) {
      setError("Please select a category.")
      return
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      description:
        form.description.trim(),
      price: Number(form.price),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#193528]/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">

      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-[#e6e1d7] bg-[#fffdf9] shadow-2xl sm:max-w-xl sm:rounded-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e7e1d6] bg-[#fffdf9] px-5 py-4 sm:px-6">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#708075]">
              Menu Management
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#193528]">
              {isEditing
                ? "Edit Menu Item"
                : "Add New Menu Item"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#77736b] transition hover:bg-[#f5f1e9]"
          >
            <X size={18} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >

          {/* IMAGE */}

          <div>
            <p className="mb-2 text-xs font-bold text-[#5f5b54]">
              Item Image
            </p>

            <div className="relative h-44 overflow-hidden rounded-xl border border-[#e2ddd3] bg-[#f5f1e9]">

              {form.image ? (
                <img
                  src={form.image}
                  alt="Menu preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-[#9b978e]">
                  <ImagePlus size={28} />

                  <p className="mt-2 text-xs font-semibold">
                    No image selected
                  </p>

                  <p className="mt-1 text-[10px]">
                    JPG, PNG or WEBP · Max 2 MB
                  </p>
                </div>
              )}

            </div>

            <div className="mt-3 flex flex-wrap gap-2">

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#315d45] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#274c39]">

                <Upload size={14} />

                {form.image
                  ? "Change Image"
                  : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />

              </label>

              {form.image && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                >
                  Remove
                </button>
              )}

            </div>
          </div>

          {/* NAME */}

          <Input
            label="Item name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Veg Burger"
          />

          {/* CATEGORY + PRICE */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-1.5">

              <label className="block text-xs font-bold text-[#5f5b54]">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#393833] outline-none transition focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
              >
                {CATEGORY_OPTIONS.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

            </div>

            <Input
              label="Price"
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              placeholder="80"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="space-y-1.5">

            <label className="block text-xs font-bold text-[#5f5b54]">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of the item..."
              className="w-full resize-none rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#393833] outline-none transition placeholder:text-[#aaa59b] focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
            />

          </div>

          {/* AVAILABILITY */}

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e5dfd4] bg-[#faf8f3] p-4">

            <div>
              <p className="text-xs font-bold text-[#393833]">
                Item available
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#8a867d]">
                Customers can order this item
                when it is available.
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.available}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  available:
                    event.target.checked,
                }))
              }
              className="h-5 w-5 accent-[#315d45]"
            />

          </label>

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-2 border-t border-[#eeeae2] pt-4 sm:flex-row sm:justify-end">

            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Item"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default MenuForm;