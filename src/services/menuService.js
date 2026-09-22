import { mockMenu } from "../mock/menu"

export function getAllMenuItems() {
  return Promise.resolve([...mockMenu])
}

export function addMenuItem(menuItem) {
  const newItem = {
    ...menuItem,
    id: `MENU${Date.now()}`,
    category: menuItem.category.toUpperCase(),
    price: Number(menuItem.price),
    stock: Number(menuItem.stock),
    available: Number(menuItem.stock) > 0,
  }

  mockMenu.push(newItem)

  return Promise.resolve(newItem)
}

export function updateMenuItem(itemId, updates) {
  const index = mockMenu.findIndex(
    (item) => item.id === itemId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Menu item not found")
    )
  }

  const updatedItem = {
    ...mockMenu[index],
    ...updates,
  }

  if (updates.stock !== undefined) {
    updatedItem.stock = Number(updates.stock)

    if (updatedItem.stock === 0) {
      updatedItem.available = false
    }
  }

  if (updates.category) {
    updatedItem.category =
      updates.category.toUpperCase()
  }

  mockMenu[index] = updatedItem

  return Promise.resolve(updatedItem)
}

export function deleteMenuItem(itemId) {
  const index = mockMenu.findIndex(
    (item) => item.id === itemId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Menu item not found")
    )
  }

  mockMenu.splice(index, 1)

  return Promise.resolve()
}