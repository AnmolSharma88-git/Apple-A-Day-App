import { mockMenu } from "../mock/menu"

export function getAllMenuItems() {
  return Promise.resolve(mockMenu)
}

export function addMenuItem(menuItem) {
  const newItem = {
    ...menuItem,
    id: `MENU${Date.now()}`,
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

  mockMenu[index] = {
    ...mockMenu[index],
    ...updates,
  }

  return Promise.resolve(mockMenu[index])
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