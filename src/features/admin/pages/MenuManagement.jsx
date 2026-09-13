import { useEffect, useState } from "react"

import MenuTable from "../components/MenuTable"
import MenuForm from "../components/MenuForm"

import {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../../services/menuService"

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function loadMenu() {
      const data = await getAllMenuItems()
      setMenuItems(data)
    }

    loadMenu()
  }, [])

  async function handleSave(formData) {
    if (editingItem) {
      const updated = await updateMenuItem(
        editingItem.id,
        formData
      )

      setMenuItems((items) =>
        items.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      )
    } else {
      const created = await addMenuItem(formData)

      setMenuItems((items) => [
        ...items,
        created,
      ])
    }

    setEditingItem(null)
    setShowForm(false)
  }

  async function handleDelete(itemId) {
    await deleteMenuItem(itemId)

    setMenuItems((items) =>
      items.filter((item) => item.id !== itemId)
    )
  }

  async function handleToggleAvailability(item) {
    const updated = await updateMenuItem(
      item.id,
      {
        available: !item.available,
      }
    )

    setMenuItems((items) =>
      items.map((current) =>
        current.id === updated.id
          ? updated
          : current
      )
    )
  }

  function handleEdit(item) {
    setEditingItem(item)
    setShowForm(true)
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Menu Management
          </h1>

          <p className="mt-2 text-slate-500">
            Add, edit and manage café menu items.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null)
            setShowForm(true)
          }}
          className="rounded-lg bg-slate-900 px-4 py-3 text-white"
        >
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <MenuForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setEditingItem(null)
              setShowForm(false)
            }}
          />
        </div>
      )}

      <MenuTable
        menuItems={menuItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={
          handleToggleAvailability
        }
      />
    </section>
  )
}

export default MenuManagement;