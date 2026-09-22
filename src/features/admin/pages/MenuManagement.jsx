import { useEffect, useMemo, useState } from "react"

import {
  Check,
  Grid2X2,
  List,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Utensils,
  X,
} from "lucide-react"

import {
  addMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  updateMenuItem,
} from "../../../services/menuService"

import { CATEGORIES } from "../../../constants/categories"


const categoryOptions = [
  CATEGORIES.FOOD,
  CATEGORIES.BEVERAGES,
  CATEGORIES.SNACKS,
  CATEGORIES.DESSERTS,
]


const emptyForm = {
  name: "",
  description: "",
  category: CATEGORIES.FOOD,
  price: "",
  stock: "",
  image: "",
}


function MenuManagement() {
  const [items, setItems] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [category, setCategory] = useState(
    CATEGORIES.ALL
  )

  const [status, setStatus] = useState("ALL")

  const [viewMode, setViewMode] = useState("list")

  const [showForm, setShowForm] = useState(false)

  const [editingItem, setEditingItem] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const [saving, setSaving] = useState(false)


  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await getAllMenuItems()

        setItems(data)
      } catch (error) {
        console.error(
          "Failed to load menu:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])


  const stats = useMemo(() => {
    const total = items.length

    const available = items.filter(
      (item) => item.available
    ).length

    const soldOut = items.filter(
      (item) => !item.available
    ).length

    return {
      total,
      available,
      soldOut,
    }
  }, [items])


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchText =
        search.trim().toLowerCase()

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText)

      const matchesCategory =
        category === CATEGORIES.ALL ||
        item.category === category

      const matchesStatus =
        status === "ALL" ||
        (status === "AVAILABLE" &&
          item.available) ||
        (status === "UNAVAILABLE" &&
          !item.available)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      )
    })
  }, [
    items,
    search,
    category,
    status,
  ])


  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }


  function openAddForm() {
    setEditingItem(null)

    setForm(emptyForm)

    setShowForm(true)
  }


  function closeForm() {
    setShowForm(false)

    setEditingItem(null)

    setForm(emptyForm)
  }


  function openEdit(item) {
    setEditingItem(item)

    setForm({
      name: item.name,
      description: item.description || "",
      category: item.category,
      price: item.price,
      stock: item.stock,
      image: item.image || "",
    })

    setShowForm(true)
  }


  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.name.trim() ||
      !form.category ||
      form.price === "" ||
      form.stock === ""
    ) {
      alert("Please fill all required fields.")

      return
    }

    if (
      Number(form.price) < 0 ||
      Number(form.stock) < 0
    ) {
      alert(
        "Price and stock cannot be negative."
      )

      return
    }

    try {
      setSaving(true)

      if (editingItem) {
        const updatedItem =
          await updateMenuItem(
            editingItem.id,
            {
              name: form.name.trim(),
              description:
                form.description.trim(),
              category: form.category,
              price: Number(form.price),
              stock: Number(form.stock),
              image: form.image,
            }
          )

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === updatedItem.id
              ? updatedItem
              : item
          )
        )
      } else {
        const newItem =
          await addMenuItem({
            name: form.name.trim(),
            description:
              form.description.trim(),
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            image: form.image,
          })

        setItems((currentItems) => [
          ...currentItems,
          newItem,
        ])
      }

      closeForm()
    } catch (error) {
      console.error(
        "Failed to save menu item:",
        error
      )

      alert(
        "Something went wrong while saving the item."
      )
    } finally {
      setSaving(false)
    }
  }


  async function handleToggleAvailability(item) {
    try {
      const updatedItem =
        await updateMenuItem(
          item.id,
          {
            available: !item.available,
          }
        )

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === updatedItem.id
            ? updatedItem
            : currentItem
        )
      )
    } catch (error) {
      console.error(
        "Failed to update availability:",
        error
      )
    }
  }


  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.name}" from the menu?`
    )

    if (!confirmed) return

    try {
      await deleteMenuItem(item.id)

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) =>
            currentItem.id !== item.id
        )
      )
    } catch (error) {
      console.error(
        "Failed to delete menu item:",
        error
      )

      alert(
        "Something went wrong while deleting the item."
      )
    }
  }


  function handleImage(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")

      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      updateForm(
        "image",
        reader.result
      )
    }

    reader.readAsDataURL(file)
  }


  function removeImage() {
    updateForm("image", "")
  }


  function formatCategory(value) {
    return value
      .toLowerCase()
      .replace(/^\w/, (letter) =>
        letter.toUpperCase()
      )
  }


  return (
    <section className="space-y-6">

      {/* ================= HEADER ================= */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
              <Utensils size={19} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708075]">
                Operations
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
                Menu Management
              </h1>

            </div>

          </div>

          <p className="mt-3 max-w-xl text-sm text-[#77736b]">
            Manage café items, pricing,
            categories, stock and availability.
          </p>

        </div>


        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#274c39]"
        >
          <Plus size={17} />

          Add Menu Item
        </button>

      </header>


      {/* ================= STATS ================= */}

      <div className="grid gap-3 sm:grid-cols-3">

        <StatCard
          label="Total Items"
          value={stats.total}
        />

        <StatCard
          label="Available"
          value={stats.available}
        />

        <StatCard
          label="Sold Out"
          value={stats.soldOut}
        />

      </div>


      {/* ================= FILTERS ================= */}

      <section className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Search */}

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#ded8cc] bg-[#fbf9f5] px-3.5 py-2.5">

            <Search
              size={17}
              className="shrink-0 text-[#9b978e]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search menu items..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa59b]"
            />

          </div>


          {/* View switcher */}

          <div className="flex items-center gap-1 rounded-xl border border-[#ded8cc] bg-[#fbf9f5] p-1">

            <button
              type="button"
              onClick={() =>
                setViewMode("list")
              }
              className={`rounded-lg p-2 ${
                viewMode === "list"
                  ? "bg-[#315d45] text-white"
                  : "text-[#77736b]"
              }`}
              title="List view"
            >
              <List size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode("grid")
              }
              className={`rounded-lg p-2 ${
                viewMode === "grid"
                  ? "bg-[#315d45] text-white"
                  : "text-[#77736b]"
              }`}
              title="Grid view"
            >
              <Grid2X2 size={17} />
            </button>

          </div>

        </div>


        {/* Filters */}

        <div className="mt-4 flex flex-col gap-4">

          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={15}
              className="text-[#8e897f]"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8e897f]">
              Filters
            </span>

          </div>


          {/* Category */}

          <div className="flex flex-wrap gap-2">

            <FilterButton
              active={
                category === CATEGORIES.ALL
              }
              onClick={() =>
                setCategory(CATEGORIES.ALL)
              }
            >
              All
            </FilterButton>

            {categoryOptions.map(
              (option) => (
                <FilterButton
                  key={option}
                  active={
                    category === option
                  }
                  onClick={() =>
                    setCategory(option)
                  }
                >
                  {formatCategory(option)}
                </FilterButton>
              )
            )}

          </div>


          {/* Status */}

          <div className="flex flex-wrap gap-2">

            <FilterButton
              active={status === "ALL"}
              onClick={() =>
                setStatus("ALL")
              }
            >
              All Status
            </FilterButton>

            <FilterButton
              active={
                status === "AVAILABLE"
              }
              onClick={() =>
                setStatus("AVAILABLE")
              }
            >
              Available
            </FilterButton>

            <FilterButton
              active={
                status === "UNAVAILABLE"
              }
              onClick={() =>
                setStatus("UNAVAILABLE")
              }
            >
              Sold Out
            </FilterButton>

          </div>

        </div>

      </section>


      {/* ================= RESULT COUNT ================= */}

      {!loading && (
        <div className="flex items-center justify-between">

          <p className="text-xs font-medium text-[#77736b]">
            Showing{" "}
            <span className="font-bold text-[#393833]">
              {filteredItems.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#393833]">
              {items.length}
            </span>{" "}
            items
          </p>

        </div>
      )}


      {/* ================= LOADING ================= */}

      {loading && (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">

          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

          <p className="mt-3 text-sm text-[#858078]">
            Loading menu...
          </p>

        </div>
      )}


      {/* ================= EMPTY ================= */}

      {!loading &&
        filteredItems.length === 0 && (
          <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">

            <Utensils
              size={32}
              className="mx-auto text-[#aaa59b]"
            />

            <h2 className="mt-4 text-sm font-bold text-[#59564f]">
              No menu items found
            </h2>

            <p className="mt-1 text-xs text-[#918d84]">
              Try changing your search or
              filters.
            </p>

          </div>
        )}


      {/* ================= LIST VIEW ================= */}

      {!loading &&
        filteredItems.length > 0 &&
        viewMode === "list" && (

          <div className="overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm">

            {/* Desktop heading */}

            <div className="hidden border-b border-[#e9e4da] bg-[#fbf9f5] px-5 py-3 lg:grid lg:grid-cols-[minmax(260px,1fr)_120px_120px_150px_120px] lg:items-center lg:gap-4">

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e897f]">
                Item
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e897f]">
                Category
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e897f]">
                Price
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e897f]">
                Availability
              </span>

              <span className="text-right text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e897f]">
                Actions
              </span>

            </div>


            {filteredItems.map((item) => (
              <MenuListItem
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleAvailability={
                  handleToggleAvailability
                }
              />
            ))}

          </div>
        )}


      {/* ================= GRID VIEW ================= */}

      {!loading &&
        filteredItems.length > 0 &&
        viewMode === "grid" && (

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {filteredItems.map((item) => (
              <MenuGridItem
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleAvailability={
                  handleToggleAvailability
                }
              />
            ))}

          </div>
        )}


      {/* ================= ADD / EDIT MODAL ================= */}

      {showForm && (
        <MenuFormModal
          form={form}
          editingItem={editingItem}
          saving={saving}
          onChange={updateForm}
          onSubmit={handleSubmit}
          onClose={closeForm}
          onImage={handleImage}
          onRemoveImage={removeImage}
        />
      )}

    </section>
  )
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">

      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8e897f]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-[#193528]">
        {value}
      </p>

    </div>
  )
}


/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  children,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
        active
          ? "bg-[#315d45] text-white"
          : "bg-[#f7f3eb] text-[#706c64] hover:bg-[#eee9df]"
      }`}
    >
      {children}
    </button>
  )
}


/* =========================================================
   LIST ITEM
========================================================= */

function MenuListItem({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <article className="border-b border-[#eee9df] p-4 last:border-b-0 sm:p-5">

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(260px,1fr)_120px_120px_150px_120px] lg:items-center lg:gap-4">

        {/* ITEM */}

        <div className="flex min-w-0 items-center gap-3">

          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#e6e1d7] bg-[#f5f1e9]">

            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#8ba08f]">
                <Utensils size={19} />
              </div>
            )}

          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="truncate text-sm font-bold text-[#193528] sm:text-base">
                {item.name}
              </h3>

              <span className="rounded-md bg-[#f3efe7] px-2 py-1 text-[9px] font-bold uppercase text-[#817c73]">
                {item.category}
              </span>

            </div>

            <p className="mt-1 truncate text-xs text-[#8a867d]">
              {item.description ||
                "No description added"}
            </p>

            <p className="mt-1 text-[11px] font-medium text-[#77736b]">
              Stock:{" "}
              <span className="font-bold text-[#393833]">
                {item.stock}
              </span>
            </p>

          </div>

        </div>


        {/* CATEGORY */}

        <div className="hidden lg:block">

          <span className="text-xs font-semibold text-[#625f58]">
            {formatCategoryValue(
              item.category
            )}
          </span>

        </div>


        {/* PRICE */}

        <div>

          <p className="text-base font-bold text-[#193528]">
            ₹{item.price}
          </p>

          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[#aaa59b]">
            Price
          </p>

        </div>


        {/* AVAILABILITY */}

        <div className="flex items-center justify-between gap-3 lg:block">

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
              item.available
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                item.available
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />

            {item.available
              ? "Available"
              : "Sold Out"}
          </span>

          <button
            type="button"
            onClick={() =>
              onToggleAvailability(item)
            }
            className="text-[10px] font-bold text-[#315d45] hover:underline"
          >
            {item.available
              ? "Mark sold out"
              : "Mark available"}
          </button>

        </div>


        {/* ACTIONS */}

        <div className="flex items-center justify-end gap-2">

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ded8cc] bg-white text-[#625f58] transition hover:bg-[#f7f3eb] hover:text-[#315d45]"
            title="Edit item"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
            title="Delete item"
          >
            <Trash2 size={15} />
          </button>

        </div>

      </div>

    </article>
  )
}


/* =========================================================
   GRID ITEM
========================================================= */

function MenuGridItem({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="h-44 bg-[#f5f1e9]">

        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#8ba08f]">
            <Utensils size={28} />
          </div>
        )}

      </div>


      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate text-base font-bold text-[#193528]">
              {item.name}
            </h3>

            <span className="mt-2 inline-flex rounded-md bg-[#f3efe7] px-2 py-1 text-[9px] font-bold uppercase text-[#817c73]">
              {item.category}
            </span>

          </div>

          <p className="shrink-0 text-base font-bold text-[#193528]">
            ₹{item.price}
          </p>

        </div>


        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#858078]">
          {item.description ||
            "No description added"}
        </p>


        <div className="mt-4 flex items-center justify-between border-t border-[#eee9df] pt-4">

          <div>

            <p className="text-[9px] uppercase tracking-wide text-[#aaa59b]">
              Stock
            </p>

            <p className="mt-1 text-sm font-bold text-[#393833]">
              {item.stock}
            </p>

          </div>


          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              item.available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {item.available
              ? "Available"
              : "Sold Out"}
          </span>

        </div>


        <button
          type="button"
          onClick={() =>
            onToggleAvailability(item)
          }
          className="mt-4 w-full rounded-xl border border-[#ded8cc] bg-[#fbf9f5] px-3 py-2.5 text-xs font-bold text-[#315d45] transition hover:bg-[#f3efe7]"
        >
          {item.available
            ? "Mark Sold Out"
            : "Mark Available"}
        </button>


        <div className="mt-2 flex gap-2">

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ded8cc] px-3 py-2.5 text-xs font-bold text-[#625f58] hover:bg-[#f7f3eb]"
          >
            <Pencil size={14} />

            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100"
          >
            <Trash2 size={14} />

            Delete
          </button>

        </div>

      </div>

    </article>
  )
}


/* =========================================================
   ADD / EDIT MODAL
========================================================= */

function MenuFormModal({
  form,
  editingItem,
  saving,
  onChange,
  onSubmit,
  onClose,
  onImage,
  onRemoveImage,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#e6e1d7] bg-[#fffdf9] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#e6e1d7] px-5 py-4 sm:px-6">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#708075]">
              Menu
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#193528]">
              {editingItem
                ? "Edit Menu Item"
                : "Add Menu Item"}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#77736b] hover:bg-[#f3efe7]"
          >
            <X size={18} />
          </button>

        </div>


        {/* Body */}

        <form
          onSubmit={onSubmit}
          className="overflow-y-auto p-5 sm:p-6"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Image */}

            <div className="sm:col-span-2">

              <label className="block text-xs font-bold text-[#5f5b54]">
                Item Image
              </label>


              <div className="mt-2 overflow-hidden rounded-xl border border-[#ded8cc] bg-[#f5f1e9]">

                <div className="h-44">

                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-[#aaa59b]">
                      No image selected
                    </div>
                  )}

                </div>

              </div>


              <div className="mt-3 flex flex-wrap gap-2">

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#315d45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#274c39]">

                  <Plus size={14} />

                  Upload Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImage}
                    className="hidden"
                  />

                </label>


                {form.image && (
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Remove Image
                  </button>
                )}

              </div>

            </div>


            {/* Name */}

            <FormField label="Item Name">

              <input
                required
                value={form.name}
                onChange={(event) =>
                  onChange(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Veg Burger"
                className={inputClass}
              />

            </FormField>


            {/* Category */}

            <FormField label="Category">

              <select
                value={form.category}
                onChange={(event) =>
                  onChange(
                    "category",
                    event.target.value
                  )
                }
                className={inputClass}
              >

                {categoryOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {formatCategoryValue(
                        option
                      )}
                    </option>
                  )
                )}

              </select>

            </FormField>


            {/* Price */}

            <FormField label="Price">

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#77736b]">
                  ₹
                </span>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    onChange(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="80"
                  className={`${inputClass} pl-8`}
                />

              </div>

            </FormField>


            {/* Stock */}

            <FormField label="Stock">

              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  onChange(
                    "stock",
                    event.target.value
                  )
                }
                placeholder="20"
                className={inputClass}
              />

            </FormField>


            {/* Description */}

            <FormField
              label="Description"
              className="sm:col-span-2"
            >

              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  onChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Short description of the item..."
                className={`${inputClass} resize-none`}
              />

            </FormField>

          </div>


          {/* Footer */}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#e6e1d7] pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#ded8cc] bg-white px-5 py-2.5 text-sm font-semibold text-[#625f58] hover:bg-[#f7f3eb]"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315d45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#274c39] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />

                  {editingItem
                    ? "Save Changes"
                    : "Add Item"}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
  className = "",
}) {
  return (
    <div className={className}>

      <label className="block text-xs font-bold text-[#5f5b54]">
        {label}
      </label>

      <div className="mt-1.5">
        {children}
      </div>

    </div>
  )
}


const inputClass =
  "w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#393833] outline-none transition placeholder:text-[#aaa59b] focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"


function formatCategoryValue(value) {
  return value
    .toLowerCase()
    .replace(/^\w/, (letter) =>
      letter.toUpperCase()
    )
}


function formatCategory(value) {
  return value
    .toLowerCase()
    .replace(/^\w/, (letter) =>
      letter.toUpperCase()
    )
}


export default MenuManagement;